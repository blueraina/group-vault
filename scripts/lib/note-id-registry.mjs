import crypto from "node:crypto"
import { execFile } from "node:child_process"
import fs from "node:fs/promises"
import path from "node:path"
import { promisify } from "node:util"
import { simplifySlug, slugifyFilePath } from "@quartz-community/utils"

const execFileAsync = promisify(execFile)

export const noteIdRegistryVersion = 1
export const noteIdMapPublicPath = "/static/note-id-map.json"

function sha256(value) {
  return crypto.createHash("sha256").update(value).digest("hex")
}

function normalizeSlash(value) {
  return String(value || "").split(path.sep).join("/")
}

function trimSlash(value) {
  return String(value || "").replace(/^\/+|\/+$/gu, "")
}

export function normalizeNoteSlug(value) {
  const simple = simplifySlug(String(value || ""))
  const trimmed = trimSlash(simple)
  if (!trimmed || trimmed === "index") return "index"
  return trimmed.replace(/\/index$/u, "") || "index"
}

export function slugForRelativePath(relativePath) {
  return normalizeNoteSlug(slugifyFilePath(relativePath))
}

export function makeUrlFromNoteSlug(slug) {
  const normalized = normalizeNoteSlug(slug)
  return normalized === "index" ? "/" : "/" + normalized
}

function uniqueList(values) {
  return [...new Set(values.map((value) => normalizeNoteSlug(value)).filter(Boolean))]
}

function hashRecordContent(record) {
  return sha256(
    JSON.stringify({
      title: record.title || "",
      tags: Array.isArray(record.tags) ? record.tags : [],
      body: String(record.body || "").replace(/\r\n?/gu, "\n").trim(),
    }),
  )
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

function stripContentPrefix(value) {
  return normalizeSlash(value).replace(/^content\//u, "")
}

async function loadLatestRenameIds(root) {
  try {
    const { stdout } = await execFileAsync(
      "git",
      [
        "-c",
        "core.quotepath=false",
        "log",
        "--name-status",
        "--diff-filter=R",
        "--find-renames=90%",
        "--format=",
        "--",
        "content",
      ],
      { cwd: root, maxBuffer: 80 * 1024 * 1024 },
    )

    const latest = new Map()
    for (const line of stdout.split(/\r?\n/u)) {
      if (!line.startsWith("R")) continue
      const parts = line.split("\t")
      if (parts.length < 3) continue
      const oldRelative = stripContentPrefix(parts[1])
      const newRelative = stripContentPrefix(parts[2])
      if (!oldRelative.endsWith(".md") || !newRelative.endsWith(".md")) continue
      const oldSlug = slugForRelativePath(oldRelative)
      const newSlug = slugForRelativePath(newRelative)
      if (!latest.has(newSlug)) latest.set(newSlug, oldSlug)
    }
    return latest
  } catch {
    return new Map()
  }
}

function buildPreviousLookups(previousEntries) {
  const byRelativePath = new Map()
  const bySlug = new Map()
  const byContentHash = new Map()

  for (const entry of previousEntries) {
    const id = normalizeNoteSlug(entry?.id)
    if (!id) continue
    const entrySlug = normalizeNoteSlug(entry?.slug)

    const relativePath = normalizeSlash(entry?.relativePath || "")
    if (relativePath) byRelativePath.set(relativePath, entry)

    for (const slug of uniqueList([entry?.slug, ...(entry?.aliases || [])]).filter(
      (alias) => alias !== "index" || entrySlug === "index" || id === "index",
    )) {
      if (slug) bySlug.set(slug, entry)
    }

    const contentHash = String(entry?.contentHash || "")
    if (contentHash) {
      const existing = byContentHash.get(contentHash)
      byContentHash.set(contentHash, existing ? null : entry)
    }
  }

  return { byRelativePath, bySlug, byContentHash }
}

function stableIdForRecord(record, previous, latestRenameIds, usedIds) {
  const frontmatterId =
    record.frontmatter?.note_id || record.frontmatter?.noteId || record.frontmatter?.id
  const candidates = [
    frontmatterId,
    previous.byRelativePath.get(record.relativePath)?.id,
    previous.bySlug.get(record.slug)?.id,
    previous.byContentHash.get(record.contentHash)?.id,
    latestRenameIds.get(record.slug),
    record.slug,
  ]

  let id = normalizeNoteSlug(candidates.find(Boolean) || record.slug)
  if (!id) id = record.slug

  if (usedIds.has(id)) {
    id = `${id}-${record.contentHash.slice(0, 8)}`
  }

  usedIds.add(id)
  return id
}

export async function updateNoteIdRegistry(records, options) {
  const root = options.root
  const staticDir = options.staticDir
  const registryPath = path.join(root, "data", "note-ids.json")
  const publicMapPath = path.join(staticDir, "note-id-map.json")
  const previousRegistry = await readJson(registryPath)
  const previousEntries = Array.isArray(previousRegistry?.notes) ? previousRegistry.notes : []
  const previous = buildPreviousLookups(previousEntries)
  const latestRenameIds = await loadLatestRenameIds(root)
  const usedIds = new Set()
  const entries = []
  const slugToId = {}
  const notes = {}

  for (const record of records) {
    record.slug = normalizeNoteSlug(record.slug)
    record.url = makeUrlFromNoteSlug(record.slug)
    record.contentHash = hashRecordContent(record)

    const matchedPrevious =
      previous.byRelativePath.get(record.relativePath) ||
      previous.bySlug.get(record.slug) ||
      previous.byContentHash.get(record.contentHash)
    const id = stableIdForRecord(record, previous, latestRenameIds, usedIds)
    const aliases = uniqueList([
      id,
      record.slug,
      latestRenameIds.get(record.slug),
      matchedPrevious?.slug,
      ...(matchedPrevious?.aliases || []),
    ]).filter((alias) => alias !== "index" || record.slug === "index" || id === "index")

    record.noteId = id
    record.noteAliases = aliases

    const entry = {
      id,
      slug: record.slug,
      url: record.url,
      relativePath: record.relativePath,
      title: record.title,
      contentHash: record.contentHash,
      aliases,
    }
    entries.push(entry)
    notes[id] = {
      slug: record.slug,
      url: record.url,
      title: record.title,
      aliases,
    }
    for (const alias of aliases) slugToId[alias] = id
  }

  entries.sort((a, b) => a.id.localeCompare(b.id))
  await writeJson(registryPath, {
    version: noteIdRegistryVersion,
    generatedAt: new Date().toISOString(),
    notes: entries,
  })
  await writeJson(publicMapPath, {
    version: noteIdRegistryVersion,
    generatedAt: new Date().toISOString(),
    notes,
    slugToId,
  })

  return { entries, slugToId, notes, registryPath, publicMapPath }
}
