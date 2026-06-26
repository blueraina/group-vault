import { getCurrentUser, json, missingEnv } from "../_lib/auth.js"

const indexPath = "/static/ai-search-index.json"
const maxQueryLength = 500
const minQueryLength = 2
const embeddingRecallLimit = 50
const bm25RecallLimit = 50
const fusedRecallLimit = 30
const finalLimit = 8
const rerankDocumentMaxChars = 1800
const maxQueryVariants = 6
const bm25K1 = 1.2
const rrfK = 60
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
每篇推荐尽量包含 locationHint：如果候选 excerpt 中出现明确相关的定义、定理、命题、引理、推论、例题、习题、问题或题号，就提取一个最相关的名称或编号；如果 excerpt 没有明确内容，locationHint 留空字符串，不要编造。
每篇推荐必须包含 relevantExcerpt，用 1-2 句话概括候选 excerpt 中最相关的片段；只能概括候选片段，不要编造小节名、页码、章节号或不存在的锚点。
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
  const rerankMissing = incompleteRerankEnv(env)

  if (missing.length > 0 || fallbackMissing.length > 0 || rerankMissing.length > 0) {
    throw httpError(
      `模型未配置：${[...missing, ...fallbackMissing, ...rerankMissing].join(", ")}`,
      503,
      "MODEL_NOT_CONFIGURED",
    )
  }
}

function joinApiUrl(baseUrl, pathname) {
  return baseUrl.replace(/\/+$/u, "") + pathname
}

async function fetchOpenAIJson({ baseUrl, apiKey, path, body, timeoutMs = 120000 }) {
  const response = await fetch(joinApiUrl(baseUrl, path), {
    method: "POST",
    headers: {
      authorization: "Bearer " + apiKey,
      "content-type": "application/json",
    },
    body: JSON.stringify(body),
    signal: AbortSignal.timeout(timeoutMs),
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

function incompleteRerankEnv(env) {
  const group = ["AI_RERANK_BASE_URL", "AI_RERANK_API_KEY", "AI_RERANK_MODEL"]
  const hasAny = group.some((name) => envValue(env, name))
  if (!hasAny) return []
  return group.filter((name) => !envValue(env, name))
}

async function createEmbeddings(env, inputs) {
  let data
  try {
    data = await fetchOpenAIJson({
      baseUrl: envValue(env, "AI_EMBEDDING_BASE_URL"),
      apiKey: envValue(env, "AI_EMBEDDING_API_KEY"),
      path: "/embeddings",
      body: {
        model: envValue(env, "AI_EMBEDDING_MODEL"),
        input: inputs,
      },
    })
  } catch (error) {
    if (inputs.length <= 1) throw error
    const embeddings = []
    for (const input of inputs) {
      const [embedding] = await createEmbeddings(env, [input])
      embeddings.push(embedding)
    }
    return embeddings
  }

  const embeddings = Array.isArray(data?.data)
    ? [...data.data].sort((a, b) => Number(a.index || 0) - Number(b.index || 0))
    : []
  if (embeddings.length !== inputs.length) {
    if (inputs.length > 1) {
      const fallback = []
      for (const input of inputs) {
        const [embedding] = await createEmbeddings(env, [input])
        fallback.push(embedding)
      }
      return fallback
    }
    throw httpError("Embedding 模型返回格式异常", 502, "MODEL_RESPONSE_INVALID")
  }
  return embeddings.map((entry) => {
    if (!Array.isArray(entry.embedding)) {
      throw httpError("Embedding 模型返回格式异常", 502, "MODEL_RESPONSE_INVALID")
    }
    return entry.embedding.map(Number)
  })
}

async function callChatProvider(provider, messages, options = {}) {
  const body = {
    model: provider.model,
    messages,
    temperature: 0.2,
    max_tokens: options.maxTokens || 900,
    response_format: { type: "json_object" },
  }

  try {
    return await fetchOpenAIJson({
      baseUrl: provider.baseUrl,
      apiKey: provider.apiKey,
      path: "/chat/completions",
      body,
      timeoutMs: options.timeoutMs,
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
      timeoutMs: options.timeoutMs,
    })
  }
}

async function createChatCompletion(env, messages, options = {}) {
  const providers = chatProviderConfigs(env)
  let lastError = null

  for (const provider of providers) {
    try {
      return await callChatProvider(provider, messages, options)
    } catch (error) {
      lastError = error
    }
  }

  const error = httpError("所有对话模型暂时不可用", 502, "CHAT_MODEL_UNAVAILABLE")
  error.cause = lastError
  throw error
}

function normalizeQueryVariant(value) {
  return String(value || "")
    .trim()
    .replace(/\s+/gu, " ")
    .slice(0, 120)
}

function uniqueQueryVariants(query, values) {
  const variants = []
  const seen = new Set()

  for (const value of [query, ...values]) {
    const normalized = normalizeQueryVariant(value)
    if (!normalized) continue
    const key = normalized.toLocaleLowerCase()
    if (seen.has(key)) continue
    seen.add(key)
    variants.push(normalized)
    if (variants.length >= maxQueryVariants) break
  }

  return variants.length > 0 ? variants : [query]
}

async function rewriteQueryVariants(env, query) {
  const messages = [
    {
      role: "system",
      content:
        "你是中文数学知识库的检索查询改写器。只做术语扩展和同义表达补充，不要引入与原问题无关的新主题。输出 JSON。",
    },
    {
      role: "user",
      content: JSON.stringify(
        {
          query,
          outputContract:
            "只输出 JSON：{ queries: string[] }。queries 放 3-6 个适合检索的短查询，优先包含数学术语、中文/英文别名、人名译名和常见相关概念；每个查询不超过 40 个字。",
        },
        null,
        2,
      ),
    },
  ]

  try {
    const completion = await createChatCompletion(env, messages, { maxTokens: 260, timeoutMs: 12000 })
    const content = completion?.choices?.[0]?.message?.content || ""
    const parsed = parseJsonFromChat(content)
    const rewritten = Array.isArray(parsed?.queries) ? parsed.queries : []
    return uniqueQueryVariants(query, rewritten)
  } catch {
    return [query]
  }
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
    throw httpError(
      "AI search index file is missing, please rebuild the AI search index",
      503,
      code,
    )
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

const bm25Fields = [
  { name: "title", weight: 4.2, b: 0.25 },
  { name: "tags", weight: 3.2, b: 0.2 },
  { name: "path", weight: 2.2, b: 0.35 },
  { name: "summary", weight: 1.5, b: 0.55 },
  { name: "text", weight: 1, b: 0.75 },
]

function normalizeSearchText(value) {
  return String(value || "")
    .normalize("NFKC")
    .toLocaleLowerCase()
    .replace(/\\([a-zA-Z]+)/gu, " $1 ")
    .replace(/[^\p{Script=Han}\p{Script=Latin}\p{Script=Greek}0-9]+/gu, " ")
    .replace(/\s+/gu, " ")
    .trim()
}

function tokenizeSearchText(value) {
  const text = normalizeSearchText(value)
  if (!text) return []

  const tokens = []
  for (const match of text.matchAll(/[\p{Script=Latin}\p{Script=Greek}0-9]+/gu)) {
    const token = match[0]
    if (token) tokens.push(token)
  }

  for (const match of text.matchAll(/\p{Script=Han}+/gu)) {
    const chars = Array.from(match[0])
    for (const char of chars) tokens.push(char)
    for (const n of [2, 3]) {
      for (let i = 0; i + n <= chars.length; i += 1) {
        tokens.push(chars.slice(i, i + n).join(""))
      }
    }
    if (chars.length >= 4 && chars.length <= 10) tokens.push(chars.join(""))
  }

  return tokens
}

function tokenFrequency(tokens) {
  const counts = new Map()
  for (const token of tokens) counts.set(token, (counts.get(token) || 0) + 1)
  return counts
}

function fieldText(chunk, field) {
  if (field === "title") return chunk.title || ""
  if (field === "tags") return Array.isArray(chunk.tags) ? chunk.tags.join(" ") : ""
  if (field === "path") return String(chunk.filePath || chunk.slug || "").replace(/\.md$/iu, "")
  if (field === "summary") return chunk.summary || ""
  return chunk.text || ""
}

function prepareNoteGraph(index) {
  const notes = new Map()
  for (const note of Array.isArray(index.notes) ? index.notes : []) {
    const id = String(note?.noteId || note?.id || note?.slug || "")
    if (!id) continue
    notes.set(id, {
      graphRank: Number(note.graphRank) || 0,
      outgoing: new Set(
        Array.isArray(note.outgoingNoteIds)
          ? note.outgoingNoteIds
          : Array.isArray(note.outgoing)
            ? note.outgoing
            : [],
      ),
      incoming: new Set(),
    })
  }

  for (const [source, note] of notes) {
    for (const target of note.outgoing) {
      if (!notes.has(target)) continue
      notes.get(target).incoming.add(source)
    }
  }

  return notes
}

function prepareHybridIndex(index) {
  if (index._hybridSearch) return index._hybridSearch

  const noteGraph = prepareNoteGraph(index)
  const df = new Map()
  const lengthTotals = Object.fromEntries(bm25Fields.map((field) => [field.name, 0]))
  const preparedChunks = []

  for (const chunk of index.chunks || []) {
    const fields = {}
    const uniqueTerms = new Set()

    for (const field of bm25Fields) {
      const tokens = tokenizeSearchText(fieldText(chunk, field.name))
      const frequencies = tokenFrequency(tokens)
      fields[field.name] = { frequencies, length: tokens.length }
      lengthTotals[field.name] += tokens.length
      for (const token of frequencies.keys()) uniqueTerms.add(token)
    }

    for (const token of uniqueTerms) df.set(token, (df.get(token) || 0) + 1)

    const note = noteGraph.get(chunk.noteId)
    preparedChunks.push({
      chunk,
      fields,
      graphRank: note?.graphRank || Number(chunk.graphRank) || 0,
    })
  }

  const totalChunks = preparedChunks.length || 1
  const avgLengths = Object.fromEntries(
    bm25Fields.map((field) => [field.name, Math.max(1, lengthTotals[field.name] / totalChunks)]),
  )

  index._hybridSearch = { chunks: preparedChunks, df, avgLengths, totalChunks, noteGraph }
  return index._hybridSearch
}

function queryTermsFromVariants(queryVariants) {
  const terms = new Set()
  for (const query of queryVariants) {
    for (const token of tokenizeSearchText(query)) terms.add(token)
  }
  return [...terms]
}

function bm25fScore(prepared, preparedChunk, queryTerms) {
  let score = 0

  for (const term of queryTerms) {
    const df = prepared.df.get(term) || 0
    if (df === 0) continue

    const idf = Math.log(1 + (prepared.totalChunks - df + 0.5) / (df + 0.5))
    let weightedTf = 0

    for (const field of bm25Fields) {
      const fieldStats = preparedChunk.fields[field.name]
      const tf = fieldStats?.frequencies.get(term) || 0
      if (tf === 0) continue

      const length = fieldStats.length || 0
      const avgLength = prepared.avgLengths[field.name] || 1
      const norm = 1 - field.b + field.b * (length / avgLength)
      weightedTf += field.weight * (tf / Math.max(norm, 0.2))
    }

    if (weightedTf > 0) {
      score += idf * ((weightedTf * (bm25K1 + 1)) / (weightedTf + bm25K1))
    }
  }

  return score
}

function candidateId(candidate) {
  return candidate.id || `${candidate.url || candidate.noteId}#chunk-${candidate.chunkIndex || 0}`
}

function mergeCandidate(existing, candidate) {
  const merged = { ...existing, ...candidate }
  for (const key of ["score", "denseScore", "bm25Score", "graphScore", "searchScore", "rrfScore"]) {
    const current = Number(existing?.[key])
    const next = Number(candidate?.[key])
    if (Number.isFinite(current) || Number.isFinite(next)) {
      merged[key] = Math.max(Number.isFinite(current) ? current : 0, Number.isFinite(next) ? next : 0)
    }
  }
  return merged
}

function recallEmbeddingChunks(index, prepared, queryEmbeddings) {
  return prepared.chunks
    .filter((preparedChunk) => Array.isArray(preparedChunk.chunk.embedding))
    .map((preparedChunk) => {
      const denseScore = Math.max(
        ...queryEmbeddings.map((embedding) =>
          cosineSimilarity(embedding, preparedChunk.chunk.embedding),
        ),
      )
      return {
        ...preparedChunk.chunk,
        score: denseScore,
        denseScore,
        graphRank: preparedChunk.graphRank,
      }
    })
    .sort((a, b) => b.denseScore - a.denseScore)
    .slice(0, embeddingRecallLimit)
}

function recallBm25Chunks(prepared, queryVariants) {
  const queryTerms = queryTermsFromVariants(queryVariants)
  if (queryTerms.length === 0) return []

  return prepared.chunks
    .map((preparedChunk) => {
      const bm25Score = bm25fScore(prepared, preparedChunk, queryTerms)
      return {
        ...preparedChunk.chunk,
        score: 0,
        bm25Score,
        graphRank: preparedChunk.graphRank,
      }
    })
    .filter((candidate) => candidate.bm25Score > 0)
    .sort((a, b) => b.bm25Score - a.bm25Score)
    .slice(0, bm25RecallLimit)
}

function graphScoreCandidates(prepared, candidates) {
  const unionNoteIds = new Set(candidates.map((candidate) => candidate.noteId).filter(Boolean))
  if (unionNoteIds.size === 0) return []

  return candidates
    .map((candidate) => {
      const note = prepared.noteGraph.get(candidate.noteId)
      let connected = 0
      if (note) {
        for (const target of note.outgoing) {
          if (target !== candidate.noteId && unionNoteIds.has(target)) connected += 1
        }
        for (const source of note.incoming) {
          if (source !== candidate.noteId && unionNoteIds.has(source)) connected += 1
        }
      }

      const localGraph = unionNoteIds.size > 1 ? connected / (unionNoteIds.size - 1) : 0
      const globalGraph = Number(candidate.graphRank) || 0
      return {
        ...candidate,
        graphScore: 0.7 * localGraph + 0.3 * globalGraph,
      }
    })
    .filter((candidate) => candidate.graphScore > 0)
    .sort((a, b) => b.graphScore - a.graphScore)
}

function uniqueCandidates(candidates) {
  const byId = new Map()
  for (const candidate of candidates) {
    const id = candidateId(candidate)
    byId.set(id, byId.has(id) ? mergeCandidate(byId.get(id), candidate) : candidate)
  }
  return [...byId.values()]
}

function fuseRankedLists(lists, limit = fusedRecallLimit) {
  const fused = new Map()

  for (const list of lists) {
    for (let index = 0; index < list.candidates.length; index += 1) {
      const candidate = list.candidates[index]
      const id = candidateId(candidate)
      const existing = fused.get(id) || { candidate, rrfScore: 0, ranks: {} }
      existing.candidate = mergeCandidate(existing.candidate, candidate)
      existing.rrfScore += list.weight / (rrfK + index + 1)
      existing.ranks[list.name] = index + 1
      fused.set(id, existing)
    }
  }

  return [...fused.values()]
    .map((entry) => ({
      ...entry.candidate,
      rrfScore: entry.rrfScore,
      searchScore: entry.rrfScore,
      ranks: entry.ranks,
    }))
    .sort((a, b) => b.rrfScore - a.rrfScore)
    .slice(0, limit)
}

function recallHybridChunks(index, queryEmbeddings, queryVariants) {
  const prepared = prepareHybridIndex(index)
  const dense = recallEmbeddingChunks(index, prepared, queryEmbeddings)
  const bm25 = recallBm25Chunks(prepared, queryVariants)
  const union = uniqueCandidates([...dense, ...bm25])
  const graph = graphScoreCandidates(prepared, union)

  return fuseRankedLists([
    { name: "dense", weight: 1, candidates: dense },
    { name: "bm25f", weight: 0.95, candidates: bm25 },
    { name: "graph", weight: 0.3, candidates: graph },
  ])
}

function rerankConfigured(env) {
  return (
    envValue(env, "AI_RERANK_BASE_URL") &&
    envValue(env, "AI_RERANK_API_KEY") &&
    envValue(env, "AI_RERANK_MODEL")
  )
}

function rerankDocument(candidate) {
  const text = [
    `标题：${candidate.title || ""}`,
    candidate.tags?.length ? `标签：${candidate.tags.join(" ")}` : "",
    candidate.summary ? `摘要：${candidate.summary}` : "",
    candidate.text ? `正文片段：${candidate.text}` : "",
  ]
    .filter(Boolean)
    .join("\n")
    .trim()

  return text.length > rerankDocumentMaxChars ? text.slice(0, rerankDocumentMaxChars) : text
}

async function maybeRerank(env, query, candidates) {
  if (!rerankConfigured(env) || candidates.length === 0) return candidates

  try {
    const body = {
      model: envValue(env, "AI_RERANK_MODEL"),
      query,
      documents: candidates.map(rerankDocument),
      return_documents: false,
      top_n: candidates.length,
    }
    const instruction = envValue(env, "AI_RERANK_INSTRUCTION")
    if (instruction) body.instruction = instruction

    const data = await fetchOpenAIJson({
      baseUrl: envValue(env, "AI_RERANK_BASE_URL"),
      apiKey: envValue(env, "AI_RERANK_API_KEY"),
      path: "/rerank",
      body,
    })

    const results = Array.isArray(data?.results) ? data.results : []
    if (results.length === 0) return candidates

    const seen = new Set()
    const reranked = results
      .map((result) => {
        const index = Number(result.index)
        const candidate = candidates[index]
        if (!candidate) return null
        seen.add(index)
        const rerankScore = Number(result.relevance_score ?? result.score ?? candidate.score)
        return {
          ...candidate,
          rerankScore: Number.isFinite(rerankScore) ? rerankScore : candidate.score,
        }
      })
      .filter(Boolean)
      .sort((a, b) => (b.rerankScore ?? b.score) - (a.rerankScore ?? a.score))

    const remaining = candidates.filter((_, index) => !seen.has(index))
    return [...reranked, ...remaining]
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
      denseScore: candidate.denseScore,
      bm25Score: candidate.bm25Score,
      graphScore: candidate.graphScore,
      searchScore: candidate.searchScore,
      rrfScore: candidate.rrfScore,
      rerankScore: candidate.rerankScore,
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
    score: Number((Number(candidate.score) || 0).toFixed(4)),
    ...(Number.isFinite(candidate.denseScore)
      ? { denseScore: Number(candidate.denseScore.toFixed(4)) }
      : {}),
    ...(Number.isFinite(candidate.bm25Score)
      ? { bm25Score: Number(candidate.bm25Score.toFixed(4)) }
      : {}),
    ...(Number.isFinite(candidate.graphScore)
      ? { graphScore: Number(candidate.graphScore.toFixed(4)) }
      : {}),
    ...(Number.isFinite(candidate.searchScore)
      ? { searchScore: Number(candidate.searchScore.toFixed(4)) }
      : {}),
    ...(Number.isFinite(candidate.rerankScore)
      ? { rerankScore: Number(candidate.rerankScore.toFixed(4)) }
      : {}),
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

function fallbackRelevantExcerpt(candidate) {
  const text = String(candidate.text || candidate.summary || "").replace(/\s+/gu, " ").trim()
  if (!text) return "命中片段信息较少，建议打开笔记查看上下文。"
  return text.length > 180 ? text.slice(0, 180) + "..." : text
}

function fallbackLocationHint(candidate) {
  const text = String(candidate.text || "").replace(/\s+/gu, " ").trim()
  if (!text) return ""

  const match = text.match(
    /(定义|定理|命题|引理|推论|例题|例|习题|问题|题)\s*([0-9一二三四五六七八九十百]+(?:[.．、-][0-9一二三四五六七八九十百]+)*)?[^。！？\n]{0,48}/u,
  )
  if (!match) return ""

  return match[0].replace(/[，,；;：:。！？\s]+$/u, "").slice(0, 80)
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
      locationHint: (
        String(item?.locationHint || "").trim() || fallbackLocationHint(candidate)
      ).slice(0, 100),
      relevantExcerpt: (
        String(item?.relevantExcerpt || "").trim() || fallbackRelevantExcerpt(candidate)
      ).slice(0, 260),
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
      locationHint: fallbackLocationHint(candidate),
      relevantExcerpt: fallbackRelevantExcerpt(candidate).slice(0, 260),
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

async function generateReport(env, query, queryVariants, candidates, weakMatch) {
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
          searchQueries: queryVariants,
          outputContract:
            "只输出 JSON：{ answer: string, items: [{ title: string, url: string, reason: string, locationHint: string, relevantExcerpt: string, level: '入门'|'核心'|'进阶'|'例题' }] }。answer 用 2-4 句话写成自然的学习建议；reason 要具体说明推荐原因；locationHint 只从候选 excerpt 里提取明确相关的定义、定理、命题、引理、推论、例题、习题、问题或题号，找不到就留空字符串；relevantExcerpt 用 1-2 句话概括候选 excerpt 里最相关的片段，不要编造小节名、页码、章节号或链接锚点。",
          candidates: candidates.map((candidate, index) => ({
            order: index + 1,
            title: candidate.title,
            url: candidate.url,
            levelHint: candidate.level,
            tags: candidate.tags,
            summary: candidate.summary,
            excerpt: String(candidate.text || "").slice(0, 700),
            scores: {
              dense: Number.isFinite(candidate.denseScore)
                ? Number(candidate.denseScore.toFixed(4))
                : undefined,
              bm25f: Number.isFinite(candidate.bm25Score)
                ? Number(candidate.bm25Score.toFixed(4))
                : undefined,
              graph: Number.isFinite(candidate.graphScore)
                ? Number(candidate.graphScore.toFixed(4))
                : undefined,
            },
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
  const queryVariants = await rewriteQueryVariants(env, query)
  const queryEmbeddings = await createEmbeddings(env, queryVariants)
  const recalled = recallHybridChunks(index, queryEmbeddings, queryVariants)
  const reranked = await maybeRerank(env, query, recalled)
  const candidates = uniqueNoteCandidates(reranked, finalLimit)
  const weakMatch = Math.max(candidates[0]?.score || 0, candidates[0]?.denseScore || 0) < 0.18
  const report = await generateReport(env, query, queryVariants, candidates, weakMatch)

  return json({
    answer: report.answer,
    items: report.items,
    sources: sourcesFromCandidates(candidates),
    queryVariants,
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
