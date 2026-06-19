#!/usr/bin/env node
import crypto from "node:crypto"
import fs from "node:fs/promises"
import path from "node:path"
import process from "node:process"
import { globby } from "globby"
import YAML from "yaml"
import { simplifySlug, slugifyFilePath } from "@quartz-community/utils"

const root = process.cwd()
const contentDir = path.join(root, "content")
const staticDir = path.join(root, "quartz", "static")
const indexPath = path.join(staticDir, "ai-search-index.json")
const shardDir = path.join(staticDir, "ai-search-index-shards")
const indexVersion = 1
const defaultCachePath = "/static/ai-search-index.json"
const publicShardBasePath = "/static/ai-search-index-shards"
const defaultMaxShardBytes = 18 * 1024 * 1024
const embeddingPrecision = 1_000_000

const requiredEmbeddingEnv = [
  "AI_EMBEDDING_BASE_URL",
  "AI_EMBEDDING_API_KEY",
  "AI_EMBEDDING_MODEL",
]

function envValue(name) {
  return String(process.env[name] || "").trim()
}

function envFlag(name) {
  return /^(1|true|yes|on)$/iu.test(envValue(name))
}

function sha256(value) {
  return crypto.createHash("sha256").update(value).digest("hex")
}

function hashObject(value) {
  return sha256(JSON.stringify(value))
}

function normalizeSlash(value) {
  return value.split(path.sep).join("/")
}

function makeUrlFromSlug(slug) {
  const simple = simplifySlug(slug)
  if (simple === "/" || simple === "") return "/"
  return "/" + String(simple).replace(/^\/+/u, "")
}

async function readJson(filePath) {
  try {
    return JSON.parse(await fs.readFile(filePath, "utf8"))
  } catch {
    return null
  }
}

async function writeJson(filePath, value) {
  await fs.mkdir(path.dirname(filePath), { recursive: true })
  await fs.writeFile(filePath, JSON.stringify(value, null, 2) + "\n", "utf8")
}

async function writeCompactJson(filePath, value) {
  await fs.mkdir(path.dirname(filePath), { recursive: true })
  await fs.writeFile(filePath, JSON.stringify(value) + "\n", "utf8")
}

async function writeDisabledIndex(reason) {
  await fs.rm(shardDir, { recursive: true, force: true })
  await writeJson(indexPath, {
    version: indexVersion,
    enabled: false,
    generatedAt: new Date().toISOString(),
    reason,
    chunks: [],
    shards: [],
    stats: {
      notes: 0,
      chunks: 0,
      reused: 0,
      embedded: 0,
      removed: 0,
    },
  })
  console.log(`[ai:index] skipped: ${reason}`)
}

function parseFrontmatter(raw) {
  if (!raw.startsWith("---")) return { frontmatter: {}, body: raw }

  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/u)
  if (!match) return { frontmatter: {}, body: raw }

  try {
    return {
      frontmatter: YAML.parse(match[1] || "") || {},
      body: raw.slice(match[0].length),
    }
  } catch {
    return {
      frontmatter: {},
      body: raw.slice(match[0].length),
    }
  }
}

function normalizeTags(value) {
  const tags = Array.isArray(value)
    ? value
    : typeof value === "string"
      ? value.split(/[,\s]+/u)
      : []

  return [
    ...new Set(
      tags
        .map((tag) => String(tag || "").trim().replace(/^#/u, ""))
        .filter(Boolean),
    ),
  ]
}

function isHidden(frontmatter) {
  return (
    frontmatter?.draft === true ||
    frontmatter?.draft === "true" ||
    frontmatter?.unlisted === true ||
    frontmatter?.unlisted === "true"
  )
}

function firstHeading(body) {
  const heading = body.match(/^#\s+(.+)$/mu)
  return heading?.[1]?.trim()
}

function titleForNote(frontmatter, body, relativePath) {
  const title = String(frontmatter?.title || "").trim()
  if (title) return title

  const heading = firstHeading(body)
  if (heading) return heading

  return path.basename(relativePath, ".md")
}

function cleanMarkdown(raw) {
  return raw
    .replace(/```[\s\S]*?```/gu, " ")
    .replace(/~~~[\s\S]*?~~~/gu, " ")
    .replace(/<!--[\s\S]*?-->/gu, " ")
    .replace(/!\[\[([^\]]+)\]\]/gu, " ")
    .replace(/\[\[([^\]|]+)\|([^\]]+)\]\]/gu, "$2")
    .replace(/\[\[([^\]]+)\]\]/gu, "$1")
    .replace(/!\[[^\]]*\]\([^)]+\)/gu, " ")
    .replace(/\[([^\]]+)\]\([^)]+\)/gu, "$1")
    .replace(/`([^`]+)`/gu, "$1")
    .replace(/<[^>]+>/gu, " ")
    .replace(/[#>*_~=\-]{2,}/gu, " ")
    .replace(/\s+/gu, " ")
    .trim()
}

function summarize(text) {
  return text.slice(0, 700)
}

function chunkText(text, maxChars = 1600, overlapChars = 180) {
  if (!text) return []
  const paragraphs = text
    .split(/(?<=。|！|？|\.|\?|!)\s+|\n{2,}/u)
    .map((part) => part.trim())
    .filter(Boolean)

  const chunks = []
  let current = ""

  for (const paragraph of paragraphs.length > 0 ? paragraphs : [text]) {
    if ((current + " " + paragraph).trim().length <= maxChars) {
      current = (current + " " + paragraph).trim()
      continue
    }

    if (current) chunks.push(current)

    if (paragraph.length <= maxChars) {
      current = paragraph
      continue
    }

    for (let start = 0; start < paragraph.length; start += maxChars - overlapChars) {
      chunks.push(paragraph.slice(start, start + maxChars).trim())
    }
    current = ""
  }

  if (current) chunks.push(current)
  return chunks
}

function joinApiUrl(baseUrl, pathname) {
  const base = baseUrl.replace(/\/+$/u, "")
  return base + pathname
}

async function readConfigBaseUrl() {
  try {
    const raw = await fs.readFile(path.join(root, "quartz.config.yaml"), "utf8")
    const parsed = YAML.parse(raw)
    const baseUrl = String(parsed?.configuration?.baseUrl || "").trim()
    if (!baseUrl) return ""
    return baseUrl.startsWith("http://") || baseUrl.startsWith("https://")
      ? baseUrl
      : "https://" + baseUrl
  } catch {
    return ""
  }
}

function shardPublicPath(index) {
  return `${publicShardBasePath}/chunks-${String(index).padStart(3, "0")}.json`
}

function shardFilePath(index) {
  return path.join(shardDir, `chunks-${String(index).padStart(3, "0")}.json`)
}

function localStaticPath(publicPath) {
  const clean = String(publicPath || "").replace(/^\/+/u, "")
  const relative = clean.startsWith("static/") ? clean.slice("static/".length) : clean
  return path.join(staticDir, relative)
}

async function hydrateIndexChunks(manifest, loadShard, label) {
  if (!manifest?.enabled) return null
  if (Array.isArray(manifest.chunks)) return manifest
  if (!Array.isArray(manifest.shards)) return null

  const chunks = []
  for (const shard of manifest.shards) {
    const shardPath = String(shard?.path || "")
    if (!shardPath) continue
    const shardData = await loadShard(shardPath)
    const shardChunks = Array.isArray(shardData?.chunks) ? shardData.chunks : []
    if (shardChunks.length === 0) {
      console.warn(`[ai:index] skipped empty previous index shard from ${label}: ${shardPath}`)
      continue
    }
    chunks.push(...shardChunks)
  }

  return chunks.length > 0 ? { ...manifest, chunks } : null
}

async function fetchJson(url) {
  const response = await fetch(url, {
    headers: { accept: "application/json" },
    signal: AbortSignal.timeout(20000),
  })
  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`)
  }
  return response.json()
}

async function fetchPreviousIndex() {
  const localManifest = await readJson(indexPath)
  const local = await hydrateIndexChunks(
    localManifest,
    (shardPath) => readJson(localStaticPath(shardPath)),
    "local cache",
  )
  if (local?.enabled && Array.isArray(local.chunks)) {
    console.log(`[ai:index] using local cache: ${normalizeSlash(path.relative(root, indexPath))}`)
    return local
  }

  const configuredUrl = envValue("AI_SEARCH_INDEX_CACHE_URL")
  const siteUrl = await readConfigBaseUrl()
  const cacheUrl = configuredUrl || (siteUrl ? siteUrl + defaultCachePath : "")
  if (!cacheUrl) return null

  try {
    const remoteManifest = await fetchJson(cacheUrl)
    const remote = await hydrateIndexChunks(
      remoteManifest,
      (shardPath) => fetchJson(new URL(shardPath, cacheUrl).toString()),
      cacheUrl,
    )
    if (remote?.enabled && Array.isArray(remote.chunks)) {
      console.log(`[ai:index] using remote cache: ${cacheUrl}`)
      return remote
    }
  } catch (error) {
    console.warn(
      `[ai:index] previous index fetch failed: ${error instanceof Error ? error.message : String(error)}`,
    )
  }

  return null
}

async function embedBatch(texts) {
  const response = await fetch(joinApiUrl(envValue("AI_EMBEDDING_BASE_URL"), "/embeddings"), {
    method: "POST",
    headers: {
      authorization: "Bearer " + envValue("AI_EMBEDDING_API_KEY"),
      "content-type": "application/json",
    },
    body: JSON.stringify({
      model: envValue("AI_EMBEDDING_MODEL"),
      input: texts,
    }),
    signal: AbortSignal.timeout(120000),
  })

  if (!response.ok) {
    const text = await response.text().catch(() => "")
    throw new Error(
      `Embedding API returned HTTP ${response.status}${text ? ": " + text.slice(0, 500) : ""}`,
    )
  }

  const data = await response.json()
  const embeddings = Array.isArray(data?.data)
    ? [...data.data].sort((a, b) => Number(a.index || 0) - Number(b.index || 0))
    : []

  if (embeddings.length !== texts.length) {
    throw new Error(`Embedding API returned ${embeddings.length} vectors for ${texts.length} inputs`)
  }

  return embeddings.map((entry) => {
    if (!Array.isArray(entry.embedding)) throw new Error("Embedding API response is missing a vector")
    return entry.embedding.map(Number)
  })
}

function compactEmbedding(embedding) {
  return (embedding || []).map((value) => {
    const number = Number(value) || 0
    return Math.round(number * embeddingPrecision) / embeddingPrecision
  })
}

function shardMaxBytes() {
  const configured = Number(envValue("AI_SEARCH_SHARD_MAX_BYTES")) || defaultMaxShardBytes
  return Math.max(1024 * 1024, Math.min(configured, 24 * 1024 * 1024))
}

async function writeShardedChunks(chunks) {
  await fs.rm(shardDir, { recursive: true, force: true })
  await fs.mkdir(shardDir, { recursive: true })

  const maxBytes = shardMaxBytes()
  const shards = []
  let shardIndex = 0
  let shardChunks = []

  async function flushShard() {
    if (shardChunks.length === 0) return

    const payload = { version: indexVersion, chunks: shardChunks }
    const text = JSON.stringify(payload)
    const bytes = Buffer.byteLength(text, "utf8")
    const publicPath = shardPublicPath(shardIndex)
    const filePath = shardFilePath(shardIndex)
    await writeCompactJson(filePath, payload)
    shards.push({ path: publicPath, chunks: shardChunks.length, bytes })
    shardIndex += 1
    shardChunks = []
  }

  for (const chunk of chunks) {
    const candidate = [...shardChunks, chunk]
    const bytes = Buffer.byteLength(JSON.stringify({ version: indexVersion, chunks: candidate }), "utf8")
    if (shardChunks.length > 0 && bytes > maxBytes) {
      await flushShard()
    }

    shardChunks.push(chunk)

    if (shardChunks.length === 1) {
      const singleBytes = Buffer.byteLength(
        JSON.stringify({ version: indexVersion, chunks: shardChunks }),
        "utf8",
      )
      if (singleBytes > maxBytes) {
        console.warn(
          `[ai:index] a single chunk is ${singleBytes} bytes, above shard target ${maxBytes} bytes`,
        )
      }
    }
  }

  await flushShard()
  return shards
}

async function embedChangedChunks(chunks) {
  const batchSize = Math.max(1, Math.min(Number(envValue("AI_EMBEDDING_BATCH_SIZE")) || 8, 64))

  async function embedAdaptiveBatch(batch, startNumber) {
    try {
      const embeddings = await embedBatch(batch.map((chunk) => chunk.embeddingText))
      for (let j = 0; j < batch.length; j += 1) {
        batch[j].embedding = embeddings[j]
      }
    } catch (error) {
      if (batch.length === 1) {
        const chunk = batch[0]
        const location = `${chunk.filePath}#chunk-${chunk.chunkIndex}`
        throw new Error(
          `Embedding failed for ${location}: ${error instanceof Error ? error.message : String(error)}`,
        )
      }

      const middle = Math.ceil(batch.length / 2)
      const endNumber = startNumber + batch.length - 1
      console.warn(
        `[ai:index] embedding ${startNumber}-${endNumber} failed; retrying as smaller batches`,
      )
      await embedAdaptiveBatch(batch.slice(0, middle), startNumber)
      await embedAdaptiveBatch(batch.slice(middle), startNumber + middle)
    }
  }

  for (let i = 0; i < chunks.length; i += batchSize) {
    const batch = chunks.slice(i, i + batchSize)
    console.log(`[ai:index] embedding ${i + 1}-${i + batch.length} of ${chunks.length}`)
    await embedAdaptiveBatch(batch, i + 1)
  }
}

async function collectChunks() {
  const files = await globby(["content/**/*.md"], {
    cwd: root,
    absolute: true,
    gitignore: true,
  })
  const notes = []
  const chunks = []

  for (const file of files.sort((a, b) => a.localeCompare(b))) {
    const raw = await fs.readFile(file, "utf8")
    const relativePath = normalizeSlash(path.relative(contentDir, file))
    const { frontmatter, body } = parseFrontmatter(raw)
    if (isHidden(frontmatter)) continue

    const slug = slugifyFilePath(relativePath)
    const url = makeUrlFromSlug(slug)
    const title = titleForNote(frontmatter, body, relativePath)
    const tags = normalizeTags(frontmatter?.tags)
    const cleaned = cleanMarkdown(body)
    const summary = summarize(cleaned)
    const noteChunks = chunkText(cleaned || title)
    notes.push({ title, slug, url, relativePath, tags, summary })

    for (let index = 0; index < noteChunks.length; index += 1) {
      const text = noteChunks[index]
      const hash = hashObject({ title, slug, url, tags, text })
      chunks.push({
        id: `${slug}#chunk-${index}`,
        noteId: slug,
        chunkIndex: index,
        title,
        slug,
        url,
        tags,
        filePath: relativePath,
        summary,
        text,
        hash,
        embeddingText: [title, tags.join(" "), summary, text].filter(Boolean).join("\n"),
      })
    }
  }

  return { notes, chunks }
}

async function main() {
  if (!envFlag("AI_SEARCH_ENABLED")) {
    await writeDisabledIndex("AI_SEARCH_ENABLED is not true")
    return
  }

  const missing = requiredEmbeddingEnv.filter((name) => !envValue(name))
  if (missing.length > 0) {
    throw new Error(
      `AI_SEARCH_ENABLED=true but embedding environment variables are missing: ${missing.join(", ")}`,
    )
  }

  const previous = await fetchPreviousIndex()
  const previousChunks = new Map()
  for (const chunk of previous?.chunks || []) {
    if (chunk?.id) previousChunks.set(chunk.id, chunk)
  }

  const { notes, chunks } = await collectChunks()
  const embeddingModel = envValue("AI_EMBEDDING_MODEL")
  const changed = []
  let reused = 0

  for (const chunk of chunks) {
    const cached = previousChunks.get(chunk.id)
    if (
      cached?.hash === chunk.hash &&
      cached?.embeddingModel === embeddingModel &&
      Array.isArray(cached.embedding)
    ) {
      chunk.embedding = cached.embedding
      reused += 1
    } else {
      changed.push(chunk)
    }
  }

  if (!previous && chunks.length > 0 && !envFlag("AI_SEARCH_ALLOW_FULL_REINDEX")) {
    throw new Error(
      "No previous AI search index cache was found. To avoid an accidental full embedding rebuild, set AI_SEARCH_ALLOW_FULL_REINDEX=true for this first or intentional full rebuild.",
    )
  }

  if (changed.length > 0) await embedChangedChunks(changed)

  const previousIds = new Set(previousChunks.keys())
  const currentIds = new Set(chunks.map((chunk) => chunk.id))
  const removed = [...previousIds].filter((id) => !currentIds.has(id)).length

  const outputChunks = chunks.map((chunk) => ({
    id: chunk.id,
    noteId: chunk.noteId,
    chunkIndex: chunk.chunkIndex,
    title: chunk.title,
    slug: chunk.slug,
    url: chunk.url,
    tags: chunk.tags,
    filePath: chunk.filePath,
    summary: chunk.summary,
    text: chunk.text,
    hash: chunk.hash,
    embeddingModel,
    embedding: compactEmbedding(chunk.embedding),
  }))

  const shards = await writeShardedChunks(outputChunks)
  const shardBytes = shards.reduce((total, shard) => total + shard.bytes, 0)

  await writeJson(indexPath, {
    version: indexVersion,
    enabled: true,
    generatedAt: new Date().toISOString(),
    embeddingModel,
    dimensions: outputChunks[0]?.embedding?.length || 0,
    notes,
    shards,
    stats: {
      notes: notes.length,
      chunks: chunks.length,
      shardFiles: shards.length,
      shardBytes,
      reused,
      embedded: changed.length,
      removed,
    },
  })

  console.log(
    `[ai:index] wrote ${normalizeSlash(path.relative(root, indexPath))}: ${notes.length} notes, ${chunks.length} chunks, ${shards.length} shard files, ${reused} reused, ${changed.length} embedded, ${removed} removed`,
  )
}

main().catch((error) => {
  console.error(`[ai:index] failed: ${error instanceof Error ? error.message : String(error)}`)
  process.exit(1)
})
