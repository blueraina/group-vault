import { getCurrentUser, json, missingEnv } from "../_lib/auth.js"

const indexPath = "/static/ai-search-index.json"
const maxQueryLength = 500
const minQueryLength = 2
const recallLimit = 30
const finalLimit = 8
const rateWindowMs = 60 * 1000
const rateMaxRequests = 10
const rateBuckets = new Map()

let cachedIndex = null
let cachedIndexAt = 0
const indexCacheTtlMs = 5 * 60 * 1000

const systemPrompt = `你是一个数学笔记学习导航助手，面向正在学习数学概念的学生。
你只能基于提供的候选笔记生成推荐，不能编造不存在的笔记、链接、标题或结论。
你的目标不是泛泛总结，而是帮用户判断应该先读哪些笔记、为什么这样排序、每篇笔记大概解决什么学习问题。
回答要自然、具体，像给同学做学习建议，不要使用机械模板句。
先用 2-4 句话概括推荐路线，再给出 3-8 篇推荐笔记。
每篇推荐都必须对应候选笔记中的真实 title 和 url。
每篇推荐理由要具体说明：它和用户问题的关系、适合放在这个顺序的原因。
如果候选笔记只覆盖了问题的一部分，不要直接说“没有找到非常匹配的笔记”，而是说明当前笔记更接近哪些方向，并给出最值得先看的入口。
除非候选列表为空，否则不要回答“没有找到合适笔记”。
输出要适合学习路径规划，避免长篇百科式解释。`

function envValue(env, name) {
  return String(env[name] || "").trim()
}

function envFlag(env, name) {
  return /^(1|true|yes|on)$/iu.test(envValue(env, name))
}

function httpError(message, status = 400, code = "BAD_REQUEST") {
  const error = new Error(message)
  error.status = status
  error.code = code
  return error
}

function normalizeQuery(value) {
  const query = String(value || "").trim()
  if (!query) throw httpError("缺少 query", 400, "INVALID_QUERY")
  if (query.length < minQueryLength) {
    throw httpError(`query 至少需要 ${minQueryLength} 个字符`, 400, "INVALID_QUERY")
  }
  if (query.length > maxQueryLength) {
    throw httpError(`query 不能超过 ${maxQueryLength} 个字符`, 400, "INVALID_QUERY")
  }
  return query
}

async function readJsonBody(request) {
  const body = await request.json().catch(() => null)
  if (!body || typeof body !== "object") {
    throw httpError("请求体必须是 JSON", 400, "INVALID_JSON")
  }
  return body
}

async function requireUser(request, env) {
  const user = await getCurrentUser(request, env)
  if (!user) throw httpError("请先登录 GitHub 后再使用 AI 找笔记", 401, "LOGIN_REQUIRED")
  return user
}

function checkRateLimit(user, request) {
  const ip = request.headers.get("cf-connecting-ip") || request.headers.get("x-forwarded-for") || ""
  const key = user?.login ? `user:${user.login}` : `ip:${ip}`
  const now = Date.now()
  const bucket = (rateBuckets.get(key) || []).filter((time) => now - time < rateWindowMs)
  if (bucket.length >= rateMaxRequests) {
    throw httpError("请求太频繁，请稍后再试", 429, "RATE_LIMITED")
  }
  bucket.push(now)
  rateBuckets.set(key, bucket)
}

function requireAiConfig(env) {
  if (!envFlag(env, "AI_SEARCH_ENABLED")) {
    throw httpError("AI 搜索未启用", 503, "AI_SEARCH_DISABLED")
  }

  const missing = missingEnv(env, [
    "AI_EMBEDDING_BASE_URL",
    "AI_EMBEDDING_API_KEY",
    "AI_EMBEDDING_MODEL",
    "AI_CHAT_BASE_URL",
    "AI_CHAT_API_KEY",
    "AI_CHAT_MODEL",
  ])
  const fallbackMissing = incompleteChatFallbackEnv(env)

  if (missing.length > 0 || fallbackMissing.length > 0) {
    throw httpError(
      `模型未配置：${[...missing, ...fallbackMissing].join(", ")}`,
      503,
      "MODEL_NOT_CONFIGURED",
    )
  }
}

function joinApiUrl(baseUrl, pathname) {
  return baseUrl.replace(/\/+$/u, "") + pathname
}

async function fetchOpenAIJson({ baseUrl, apiKey, path, body }) {
  const response = await fetch(joinApiUrl(baseUrl, path), {
    method: "POST",
    headers: {
      authorization: "Bearer " + apiKey,
      "content-type": "application/json",
    },
    body: JSON.stringify(body),
    signal: AbortSignal.timeout(120000),
  })

  if (!response.ok) {
    const text = await response.text().catch(() => "")
    const error = httpError(
      `模型服务返回 HTTP ${response.status}${text ? "：" + text.slice(0, 300) : ""}`,
      response.status >= 500 ? 502 : 400,
      "MODEL_REQUEST_FAILED",
    )
    error.upstreamStatus = response.status
    throw error
  }

  return response.json()
}

function chatProviderConfigs(env) {
  return [
    {
      name: "chat_1",
      baseUrl: envValue(env, "AI_CHAT_BASE_URL"),
      apiKey: envValue(env, "AI_CHAT_API_KEY"),
      model: envValue(env, "AI_CHAT_MODEL"),
    },
    {
      name: "chat_2",
      baseUrl: envValue(env, "AI_CHAT_FALLBACK_1_BASE_URL"),
      apiKey: envValue(env, "AI_CHAT_FALLBACK_1_API_KEY"),
      model: envValue(env, "AI_CHAT_FALLBACK_1_MODEL"),
    },
    {
      name: "chat_3",
      baseUrl: envValue(env, "AI_CHAT_FALLBACK_2_BASE_URL"),
      apiKey: envValue(env, "AI_CHAT_FALLBACK_2_API_KEY"),
      model: envValue(env, "AI_CHAT_FALLBACK_2_MODEL"),
    },
  ].filter((provider) => provider.baseUrl && provider.apiKey && provider.model)
}

function incompleteChatFallbackEnv(env) {
  const groups = [
    ["AI_CHAT_FALLBACK_1_BASE_URL", "AI_CHAT_FALLBACK_1_API_KEY", "AI_CHAT_FALLBACK_1_MODEL"],
    ["AI_CHAT_FALLBACK_2_BASE_URL", "AI_CHAT_FALLBACK_2_API_KEY", "AI_CHAT_FALLBACK_2_MODEL"],
  ]
  const missing = []

  for (const group of groups) {
    const hasAny = group.some((name) => envValue(env, name))
    if (!hasAny) continue
    missing.push(...group.filter((name) => !envValue(env, name)))
  }

  return missing
}

async function createEmbedding(env, input) {
  const data = await fetchOpenAIJson({
    baseUrl: envValue(env, "AI_EMBEDDING_BASE_URL"),
    apiKey: envValue(env, "AI_EMBEDDING_API_KEY"),
    path: "/embeddings",
    body: {
      model: envValue(env, "AI_EMBEDDING_MODEL"),
      input,
    },
  })

  const embedding = data?.data?.[0]?.embedding
  if (!Array.isArray(embedding)) {
    throw httpError("Embedding 模型返回格式异常", 502, "MODEL_RESPONSE_INVALID")
  }
  return embedding.map(Number)
}

async function callChatProvider(provider, messages) {
  const body = {
    model: provider.model,
    messages,
    temperature: 0.2,
    max_tokens: 900,
    response_format: { type: "json_object" },
  }

  try {
    return await fetchOpenAIJson({
      baseUrl: provider.baseUrl,
      apiKey: provider.apiKey,
      path: "/chat/completions",
      body,
    })
  } catch (error) {
    if (error?.upstreamStatus !== 400) throw error
    const fallbackBody = { ...body }
    delete fallbackBody.response_format
    return fetchOpenAIJson({
      baseUrl: provider.baseUrl,
      apiKey: provider.apiKey,
      path: "/chat/completions",
      body: fallbackBody,
    })
  }
}

async function createChatCompletion(env, messages) {
  const providers = chatProviderConfigs(env)
  let lastError = null

  for (const provider of providers) {
    try {
      return await callChatProvider(provider, messages)
    } catch (error) {
      lastError = error
    }
  }

  const error = httpError("所有对话模型暂时不可用", 502, "CHAT_MODEL_UNAVAILABLE")
  error.cause = lastError
  throw error
}

async function fetchIndexFromAssets(request, env, pathname = indexPath) {
  if (env.ASSETS && typeof env.ASSETS.fetch === "function") {
    const url = new URL(pathname, request.url)
    return env.ASSETS.fetch(url)
  }

  const url = new URL(pathname, request.url)
  return fetch(url)
}

async function readIndexJson(request, env, pathname) {
  const response = await fetchIndexFromAssets(request, env, pathname)
  if (!response.ok) {
    const code = pathname === indexPath ? "INDEX_NOT_FOUND" : "INDEX_SHARD_NOT_FOUND"
    throw httpError("AI search index file is missing, please rebuild the AI search index", 503, code)
  }
  return response.json().catch(() => null)
}

async function loadIndex(request, env) {
  const now = Date.now()
  if (cachedIndex && now - cachedIndexAt < indexCacheTtlMs) return cachedIndex

  const response = await fetchIndexFromAssets(request, env)
  if (!response.ok) {
    throw httpError("AI 搜索索引不存在，请先运行构建索引", 503, "INDEX_NOT_FOUND")
  }

  const index = await response.json().catch(() => null)
  if (!index?.enabled || !Array.isArray(index.chunks) || index.chunks.length === 0) {
    throw httpError("AI 搜索索引未启用或为空", 503, "INDEX_DISABLED")
  }

  cachedIndex = index
  cachedIndexAt = now
  return index
}

async function loadSearchIndex(request, env) {
  const now = Date.now()
  if (cachedIndex && now - cachedIndexAt < indexCacheTtlMs) return cachedIndex

  const manifest = await readIndexJson(request, env, indexPath)
  const chunks = []

  if (Array.isArray(manifest?.chunks)) {
    chunks.push(...manifest.chunks)
  } else if (Array.isArray(manifest?.shards)) {
    for (const shard of manifest.shards) {
      const shardPath = String(shard?.path || "")
      if (!shardPath) continue
      const shardIndex = await readIndexJson(request, env, shardPath)
      if (Array.isArray(shardIndex?.chunks)) chunks.push(...shardIndex.chunks)
    }
  }

  const index = manifest ? { ...manifest, chunks } : null
  if (!index?.enabled || !Array.isArray(index.chunks) || index.chunks.length === 0) {
    throw httpError("AI search index is disabled or empty", 503, "INDEX_DISABLED")
  }

  cachedIndex = index
  cachedIndexAt = now
  return index
}

function cosineSimilarity(a, b) {
  let dot = 0
  let normA = 0
  let normB = 0
  const length = Math.min(a.length, b.length)

  for (let i = 0; i < length; i += 1) {
    const x = Number(a[i]) || 0
    const y = Number(b[i]) || 0
    dot += x * y
    normA += x * x
    normB += y * y
  }

  if (!normA || !normB) return 0
  return dot / (Math.sqrt(normA) * Math.sqrt(normB))
}

function recallChunks(index, queryEmbedding) {
  return index.chunks
    .filter((chunk) => Array.isArray(chunk.embedding))
    .map((chunk) => ({
      ...chunk,
      score: cosineSimilarity(queryEmbedding, chunk.embedding),
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, recallLimit)
}

function rerankConfigured(env) {
  return (
    envValue(env, "AI_RERANK_BASE_URL") &&
    envValue(env, "AI_RERANK_API_KEY") &&
    envValue(env, "AI_RERANK_MODEL")
  )
}

async function maybeRerank(env, query, candidates) {
  if (!rerankConfigured(env) || candidates.length === 0) return candidates

  try {
    const data = await fetchOpenAIJson({
      baseUrl: envValue(env, "AI_RERANK_BASE_URL"),
      apiKey: envValue(env, "AI_RERANK_API_KEY"),
      path: "/rerank",
      body: {
        model: envValue(env, "AI_RERANK_MODEL"),
        query,
        documents: candidates.map((candidate) =>
          [candidate.title, candidate.summary, candidate.text].filter(Boolean).join("\n"),
        ),
        top_n: finalLimit,
      },
    })

    const results = Array.isArray(data?.results) ? data.results : []
    if (results.length === 0) return candidates

    return results
      .map((result) => {
        const candidate = candidates[Number(result.index)]
        if (!candidate) return null
        return {
          ...candidate,
          rerankScore: Number(result.relevance_score ?? result.score ?? candidate.score),
        }
      })
      .filter(Boolean)
      .sort((a, b) => (b.rerankScore ?? b.score) - (a.rerankScore ?? a.score))
  } catch {
    return candidates
  }
}

function inferLevel(candidate, index) {
  if (/例|题|problem|exercise/iu.test(candidate.title || "")) return "例题"
  if (index === 0) return "入门"
  if (index <= 3) return "核心"
  return "进阶"
}

function uniqueNoteCandidates(candidates, limit = finalLimit) {
  const seen = new Set()
  const notes = []

  for (const candidate of candidates) {
    if (!candidate?.url || seen.has(candidate.url)) continue
    seen.add(candidate.url)
    notes.push({
      title: candidate.title,
      url: candidate.url,
      tags: candidate.tags || [],
      summary: candidate.summary || "",
      text: candidate.text || "",
      score: candidate.score || 0,
    })
    if (notes.length >= limit) break
  }

  return notes.map((candidate, index) => ({
    ...candidate,
    level: inferLevel(candidate, index),
  }))
}

function sourcesFromCandidates(candidates) {
  return candidates.map((candidate) => ({
    title: candidate.title,
    url: candidate.url,
    score: Number(candidate.score.toFixed(4)),
  }))
}

function parseJsonFromChat(content) {
  const text = String(content || "").trim()
  if (!text) return null

  try {
    return JSON.parse(text)
  } catch {}

  const fenced = text.match(/```(?:json)?\s*([\s\S]*?)```/iu)
  if (fenced) {
    try {
      return JSON.parse(fenced[1])
    } catch {}
  }

  const start = text.indexOf("{")
  const end = text.lastIndexOf("}")
  if (start !== -1 && end > start) {
    try {
      return JSON.parse(text.slice(start, end + 1))
    } catch {}
  }

  return null
}

function normalizeLevel(value, fallback) {
  const level = String(value || "").trim()
  return ["入门", "核心", "进阶", "例题"].includes(level) ? level : fallback
}

function fallbackReason(candidate, weakMatch) {
  if (weakMatch) return "这是检索结果中相对接近的问题或概念，可作为进一步定位的起点。"
  if (candidate.summary) return "标题和正文摘要与当前学习目标较接近，适合按顺序阅读。"
  return "该笔记在向量检索中靠前，可能包含相关概念或例题。"
}

function validateModelItems(parsed, candidates, weakMatch) {
  const byUrl = new Map(candidates.map((candidate) => [candidate.url, candidate]))
  const used = new Set()
  const valid = []

  for (const item of Array.isArray(parsed?.items) ? parsed.items : []) {
    const url = String(item?.url || "").trim()
    const candidate = byUrl.get(url)
    if (!candidate || used.has(url)) continue
    used.add(url)
    valid.push({
      title: candidate.title,
      url: candidate.url,
      reason: String(item?.reason || "").trim() || fallbackReason(candidate, weakMatch),
      level: normalizeLevel(item?.level, candidate.level),
    })
    if (valid.length >= finalLimit) break
  }

  for (const candidate of candidates) {
    if (valid.length >= Math.min(3, candidates.length)) break
    if (used.has(candidate.url)) continue
    used.add(candidate.url)
    valid.push({
      title: candidate.title,
      url: candidate.url,
      reason: fallbackReason(candidate, weakMatch),
      level: candidate.level,
    })
  }

  return valid.slice(0, finalLimit)
}

function fallbackAnswer(query, candidates, weakMatch) {
  if (candidates.length === 0) return "没有找到合适笔记。"
  const prefix = weakMatch
    ? "可以先参考下面这些当前索引里较接近的阅读入口。"
    : "可以按下面顺序阅读这些笔记，先建立概念，再看核心结论和例题。"
  return `${prefix}\n学习目标：${query}`
}

async function generateReport(env, query, candidates, weakMatch) {
  if (candidates.length === 0) {
    return {
      answer: "没有找到合适笔记。",
      items: [],
    }
  }

  const messages = [
    { role: "system", content: systemPrompt },
    {
      role: "user",
      content: JSON.stringify(
        {
          query,
          outputContract:
            "只输出 JSON：{ answer: string, items: [{ title: string, url: string, reason: string, level: '入门'|'核心'|'进阶'|'例题' }] }。answer 用 2-4 句话写成自然的学习建议；reason 不要太短，要具体说明推荐原因。",
          candidates: candidates.map((candidate, index) => ({
            order: index + 1,
            title: candidate.title,
            url: candidate.url,
            levelHint: candidate.level,
            tags: candidate.tags,
            summary: candidate.summary,
            excerpt: String(candidate.text || "").slice(0, 700),
          })),
        },
        null,
        2,
      ),
    },
  ]

  const completion = await createChatCompletion(env, messages)
  const content = completion?.choices?.[0]?.message?.content || ""
  const parsed = parseJsonFromChat(content)
  const items = validateModelItems(parsed, candidates, weakMatch)
  const answer = String(parsed?.answer || "").trim() || fallbackAnswer(query, candidates, weakMatch)

  return { answer, items }
}

async function handlePost(request, env) {
  const body = await readJsonBody(request)
  const query = normalizeQuery(body.query)
  const user = await requireUser(request, env)
  checkRateLimit(user, request)
  requireAiConfig(env)

  const index = await loadSearchIndex(request, env)
  const queryEmbedding = await createEmbedding(env, query)
  const recalled = recallChunks(index, queryEmbedding)
  const reranked = await maybeRerank(env, query, recalled)
  const candidates = uniqueNoteCandidates(reranked, finalLimit)
  const weakMatch = (candidates[0]?.score || 0) < 0.18
  const report = await generateReport(env, query, candidates, weakMatch)

  return json({
    answer: report.answer,
    items: report.items,
    sources: sourcesFromCandidates(candidates),
  })
}

export async function onRequest({ request, env }) {
  if (request.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: { "cache-control": "no-store" } })
  }

  try {
    if (request.method !== "POST") return json({ error: "Method not allowed" }, 405)
    return await handlePost(request, env)
  } catch (error) {
    const status = error?.status || 500
    const code = error?.code || "AI_SEARCH_ERROR"
    const message = error instanceof Error ? error.message : "AI 搜索服务暂时不可用"
    return json({ error: message, code }, status)
  }
}
