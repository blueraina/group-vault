#!/usr/bin/env node
import fs from "node:fs/promises"
import path from "node:path"
import process from "node:process"
import { globby } from "globby"
import YAML from "yaml"
import { slugForRelativePath, updateNoteIdRegistry } from "./lib/note-id-registry.mjs"

const root = process.cwd()
const contentDir = path.join(root, "content")
const staticDir = path.join(root, "quartz", "static")
const checkOnly = process.argv.includes("--check")

function normalizeSlash(value) {
  return String(value || "").split(path.sep).join("/")
}

function parseFrontmatter(raw) {
  const bom = raw.startsWith("\uFEFF") ? "\uFEFF" : ""
  const text = bom ? raw.slice(1) : raw
  const eol = text.includes("\r\n") ? "\r\n" : "\n"
  const match = text.match(/^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/u)

  if (!match) {
    return {
      bom,
      eol,
      hasFrontmatter: false,
      frontmatterText: "",
      frontmatter: {},
      body: text,
    }
  }

  const frontmatterText = match[1] || ""
  let frontmatter = {}
  try {
    frontmatter = YAML.parse(frontmatterText) || {}
  } catch {
    frontmatter = {}
  }

  return {
    bom,
    eol,
    hasFrontmatter: true,
    frontmatterText,
    frontmatter,
    body: text.slice(match[0].length),
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

function isHidden(frontmatter) {
  return (
    frontmatter?.draft === true ||
    frontmatter?.draft === "true" ||
    frontmatter?.unlisted === true ||
    frontmatter?.unlisted === "true"
  )
}

function scalarLine(key, value) {
  if (key === "shortId") return `${key}: ${Number(value)}`
  return `${key}: ${JSON.stringify(String(value))}`
}

function replaceOrInsertYamlLine(yamlText, eol, key, value) {
  const line = scalarLine(key, value)
  const re = new RegExp(`(^|\\r?\\n)${key}\\s*:\\s*[^\\r\\n]*(?=\\r?\\n|$)`, "u")
  if (re.test(yamlText)) {
    return yamlText.replace(re, (match, prefix) => `${prefix}${line}`)
  }

  return { missing: line, yamlText }
}

function upsertFrontmatterIds(parsed, noteId, shortId) {
  const fields = [
    ["noteId", noteId],
    ["shortId", shortId],
  ]
  let yamlText = parsed.frontmatterText.trimEnd()
  const missing = []

  for (const [key, value] of fields) {
    const next = replaceOrInsertYamlLine(yamlText, parsed.eol, key, value)
    if (typeof next === "string") {
      yamlText = next
    } else {
      missing.push(next.missing)
      yamlText = next.yamlText
    }
  }

  if (missing.length > 0) {
    yamlText = [missing.join(parsed.eol), yamlText].filter(Boolean).join(parsed.eol)
  }

  return `${parsed.bom}---${parsed.eol}${yamlText}${parsed.eol}---${parsed.eol}${parsed.body}`
}

async function collectRecords() {
  const files = await globby(["content/**/*.md"], {
    cwd: root,
    absolute: true,
    gitignore: true,
  })

  const records = []
  for (const file of files.sort((a, b) => a.localeCompare(b))) {
    const raw = await fs.readFile(file, "utf8")
    const relativePath = normalizeSlash(path.relative(contentDir, file))
    const parsed = parseFrontmatter(raw)
    if (isHidden(parsed.frontmatter)) continue

    const title = titleForNote(parsed.frontmatter, parsed.body, relativePath)
    records.push({
      file,
      raw,
      parsed,
      title,
      slug: slugForRelativePath(relativePath),
      url: "",
      relativePath,
      frontmatter: parsed.frontmatter,
      tags: normalizeTags(parsed.frontmatter?.tags),
      body: parsed.body,
    })
  }

  return records
}

async function main() {
  const records = await collectRecords()
  await updateNoteIdRegistry(records, { root, staticDir, write: !checkOnly })

  let changed = 0
  const changedPaths = []
  for (const record of records) {
    const nextRaw = upsertFrontmatterIds(record.parsed, record.noteId, record.shortId)
    if (nextRaw === record.raw) continue

    changed += 1
    changedPaths.push(record.relativePath)
    if (!checkOnly) await fs.writeFile(record.file, nextRaw, "utf8")
  }

  if (checkOnly && changed > 0) {
    console.error(`[note:ids] ${changed} note(s) need hidden IDs. Run npm run note:ids.`)
    for (const relativePath of changedPaths.slice(0, 20)) {
      console.error(`  - ${relativePath}`)
    }
    if (changedPaths.length > 20) console.error(`  ... and ${changedPaths.length - 20} more`)
    process.exit(1)
  }

  console.log(
    `[note:ids] ${checkOnly ? "checked" : "updated"} ${records.length} notes, ${changed} changed`,
  )
}

main().catch((error) => {
  console.error(`[note:ids] failed: ${error instanceof Error ? error.message : String(error)}`)
  process.exit(1)
})
