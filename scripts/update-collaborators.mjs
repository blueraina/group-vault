import { execFileSync } from "node:child_process"
import fs from "node:fs/promises"
import path from "node:path"
import sharp from "sharp"
import YAML from "yaml"

const root = process.cwd()
const readmePath = path.join(root, "README.md")
const dataPath = path.join(root, "data", "collaborators.json")
const maintainersPath = path.join(root, "functions", "_lib", "maintainers.generated.js")
const contentDir = path.join(root, "content")
const pagePath = path.join(root, "content", "其他信息", "协作者.md")
const timelinePath = path.join(root, "content", "其他信息", "维护时间线.md")
const avatarDir = path.join(root, "content", "assets", "collaborators")
const apiVersion = "2022-11-28"
const timelineStart = "<!-- timeline:start -->"
const timelineEnd = "<!-- timeline:end -->"
const timezone = process.env.TIMELINE_TIMEZONE || "Asia/Shanghai"
const legacyAuthorAliases = new Map([
  ["管理员", "blueraina"],
  ["蓝语", "blueraina"],
])
const collaboratorDisplayNames = new Map([["blueraina", "蓝语"]])

function parseRepository() {
  if (process.env.GITHUB_REPOSITORY) {
    const [owner, repo] = process.env.GITHUB_REPOSITORY.split("/")
    if (owner && repo) return { owner, repo }
  }

  const remote = execFileSync("git", ["config", "--get", "remote.origin.url"], {
    encoding: "utf8",
  }).trim()
  const match = remote.match(/github\.com[:/](?<owner>[^/]+)\/(?<repo>[^/.]+)(?:\.git)?$/)
  if (!match?.groups) {
    throw new Error(`Cannot parse GitHub repository from remote.origin.url: ${remote}`)
  }
  return match.groups
}

function authHeaders() {
  const token = process.env.COLLABORATORS_TOKEN || process.env.GH_TOKEN || process.env.GITHUB_TOKEN
  return {
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": apiVersion,
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  }
}

async function githubJson(url) {
  const response = await fetch(url, { headers: authHeaders() })
  if (!response.ok) {
    const body = await response.text()
    throw new Error(
      `GitHub API request failed: ${response.status} ${response.statusText}\n${url}\n${body}`,
    )
  }
  return response.json()
}

async function listCollaborators(owner, repo) {
  const collaborators = []
  for (let page = 1; ; page += 1) {
    const url = `https://api.github.com/repos/${owner}/${repo}/collaborators?affiliation=all&per_page=100&page=${page}`
    const batch = await githubJson(url)
    collaborators.push(...batch)
    if (batch.length < 100) break
  }
  return collaborators
}

async function getUser(login) {
  try {
    return await githubJson(`https://api.github.com/users/${login}`)
  } catch {
    return {
      login,
      html_url: `https://github.com/${login}`,
      avatar_url: `https://github.com/${login}.png`,
    }
  }
}

function normalizeCollaborator(user) {
  return {
    login: user.login,
    displayName:
      collaboratorDisplayNames.get(user.login.toLowerCase()) ||
      user.displayName ||
      user.name ||
      user.login,
    htmlUrl: user.html_url || user.htmlUrl || `https://github.com/${user.login}`,
    avatarUrl: user.avatar_url || user.avatarUrl || `https://github.com/${user.login}.png`,
  }
}

function avatarFetchUrl(url) {
  return url.includes("?") ? `${url}&s=256` : `${url}?s=256`
}

async function writeIfChanged(filePath, content) {
  try {
    const current = await fs.readFile(filePath)
    const next = Buffer.isBuffer(content) ? content : Buffer.from(content)
    if (current.equals(next)) return false
  } catch {}

  await fs.mkdir(path.dirname(filePath), { recursive: true })
  await fs.writeFile(filePath, content)
  return true
}

async function readExistingCollaboratorLogins() {
  try {
    const data = JSON.parse(await fs.readFile(dataPath, "utf8"))
    return (data.collaborators || [])
      .map((user) => user.login)
      .filter(Boolean)
      .sort()
  } catch {
    return []
  }
}

async function readExistingCollaborators() {
  try {
    const data = JSON.parse(await fs.readFile(dataPath, "utf8"))
    return (data.collaborators || []).filter((user) => user.login)
  } catch {
    return []
  }
}

function sameLogins(previous, next) {
  if (previous.length !== next.length) return false
  return previous.every((login, index) => login === next[index])
}

function localDateParts(date) {
  const formatter = new Intl.DateTimeFormat("zh-CN", {
    timeZone: timezone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  })

  const parts = Object.fromEntries(
    formatter.formatToParts(date).map((part) => [part.type, part.value]),
  )
  return {
    date: `${parts.year}-${parts.month}-${parts.day}`,
    dateTime: `${parts.year}-${parts.month}-${parts.day} ${parts.hour}:${parts.minute}`,
  }
}

async function updateCollaboratorTimeline(collaborators) {
  let content
  try {
    content = await fs.readFile(timelinePath, "utf8")
  } catch {
    return false
  }

  if (!content.includes(timelineStart) || !content.includes(timelineEnd)) return false

  const { date, dateTime } = localDateParts(new Date())
  const logins = collaborators.map((user) => `@${user.login}`).join("、")
  const entry = `- ${dateTime} · GitHub Actions · 更新协作者 · [[其他信息/协作者|协作者]] · ${logins}`
  const startIndex = content.indexOf(timelineStart)
  const endIndex = content.indexOf(timelineEnd)
  const currentBlock = content.slice(startIndex + timelineStart.length, endIndex).trim()
  const currentEntries =
    currentBlock && !/^暂无记录[。.]$/.test(currentBlock)
      ? currentBlock
          .split(/\r?\n/)
          .map((line) => line.trim())
          .filter((line) => line && !/^暂无记录[。.]$/.test(line))
      : []

  const nextBody = [entry, ...currentEntries].join("\n")
  const nextContent = content
    .replace(/^updated:\s*\d{4}-\d{2}-\d{2}/m, `updated: ${date}`)
    .replace(
      new RegExp(`${timelineStart}[\\s\\S]*?${timelineEnd}`),
      `${timelineStart}\n${nextBody}\n${timelineEnd}`,
    )

  return writeIfChanged(timelinePath, nextContent)
}

async function writeCircularAvatar(collaborator) {
  const filename = `${collaborator.login.toLowerCase()}.png`
  const outputPath = path.join(avatarDir, filename)
  let response
  try {
    response = await fetch(avatarFetchUrl(collaborator.avatarUrl))
  } catch (error) {
    try {
      await fs.access(outputPath)
      console.warn(`Could not fetch avatar for ${collaborator.login}. Keeping existing avatar.`)
      return
    } catch {}
    throw error
  }

  if (!response.ok) {
    try {
      await fs.access(outputPath)
      console.warn(
        `Could not fetch avatar for ${collaborator.login}: ${response.status}. Keeping existing avatar.`,
      )
      return
    } catch {}
    throw new Error(`Failed to fetch avatar for ${collaborator.login}: ${response.status}`)
  }

  const source = Buffer.from(await response.arrayBuffer())
  const size = 128
  const mask = Buffer.from(
    `<svg width="${size}" height="${size}"><circle cx="${size / 2}" cy="${size / 2}" r="${size / 2}" fill="#fff"/></svg>`,
  )
  const output = await sharp(source)
    .resize(size, size, { fit: "cover" })
    .composite([{ input: mask, blend: "dest-in" }])
    .png()
    .toBuffer()

  await writeIfChanged(outputPath, output)
}

async function removeStaleAvatars(collaborators) {
  const expected = new Set(collaborators.map((user) => `${user.login.toLowerCase()}.png`))
  let files = []
  try {
    files = await fs.readdir(avatarDir)
  } catch {
    return
  }

  await Promise.all(
    files
      .filter((file) => file.endsWith(".png") && !expected.has(file))
      .map((file) => fs.unlink(path.join(avatarDir, file))),
  )
}

function noteFileName(relPath) {
  return path.basename(relPath, ".md")
}

function toPosixPath(filePath) {
  return filePath.split(path.sep).join("/")
}

async function collectMarkdownFiles(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true })
  const files = []

  for (const entry of entries) {
    const entryPath = path.join(dir, entry.name)
    if (entry.isDirectory()) {
      if (["assets", ".obsidian"].includes(entry.name)) continue
      files.push(...(await collectMarkdownFiles(entryPath)))
    } else if (entry.isFile() && entry.name.endsWith(".md")) {
      files.push(entryPath)
    }
  }

  return files
}

function parseFrontmatter(markdown) {
  const match = markdown.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?/)
  const body = match ? markdown.slice(match[0].length) : markdown
  if (!match) return { data: {}, body }

  try {
    return { data: YAML.parse(match[1]) || {}, body }
  } catch {
    return { data: {}, body }
  }
}

function firstHeading(body) {
  const match = body.match(/^#\s+(.+)$/m)
  return match?.[1]?.trim()
}

function valueList(value) {
  if (Array.isArray(value)) return value.flatMap(valueList)
  if (value == null) return []
  return String(value)
    .split(/[，,、]/)
    .map((item) => item.trim())
    .filter(Boolean)
}

function authorAliasMap(collaborators) {
  const aliases = new Map(legacyAuthorAliases)
  for (const user of collaborators) {
    const values = [user.login, `@${user.login}`, user.displayName]
    for (const value of values) {
      if (value) aliases.set(String(value).trim().toLowerCase(), user.login)
    }
  }
  return aliases
}

function canonicalAuthor(value, aliases) {
  const raw = String(value).trim()
  if (!raw) return undefined
  const normalized = raw.replace(/^@/, "")
  return aliases.get(raw.toLowerCase()) || aliases.get(normalized.toLowerCase())
}

function noteDate(data, stats) {
  const raw = data.updated || data.modified || data.created
  const parsed = raw instanceof Date ? raw : raw ? new Date(raw) : undefined
  return parsed && !Number.isNaN(parsed.getTime()) ? parsed : stats.mtime
}

function formatDate(date) {
  return localDateParts(date).date
}

function noteGroup(relPath) {
  const [firstPart] = relPath.split("/")
  return relPath.includes("/") ? firstPart : "根目录"
}

function wikiLink(relPath, title) {
  const target = relPath.replace(/\.md$/i, "")
  const safeTitle = title.replace(/\|/g, "｜")
  return `[[${target}|${safeTitle}]]`
}

async function collectNotesByCollaborator(collaborators) {
  const aliases = authorAliasMap(collaborators)
  const notesByLogin = new Map(collaborators.map((user) => [user.login.toLowerCase(), []]))
  const markdownFiles = await collectMarkdownFiles(contentDir)

  for (const filePath of markdownFiles) {
    const relPath = toPosixPath(path.relative(contentDir, filePath))
    if (relPath === "其他信息/协作者.md") continue

    const [markdown, stats] = await Promise.all([fs.readFile(filePath, "utf8"), fs.stat(filePath)])
    const { data, body } = parseFrontmatter(markdown)
    const authors = Array.from(
      new Set(
        valueList(data.authors)
          .map((author) => canonicalAuthor(author, aliases))
          .filter(Boolean),
      ),
    )

    if (authors.length === 0) continue

    const date = noteDate(data, stats)
    const note = {
      title: data.title || firstHeading(body) || noteFileName(relPath),
      relPath,
      group: noteGroup(relPath),
      date,
      dateText: formatDate(date),
    }

    for (const author of authors) {
      const key = author.toLowerCase()
      if (notesByLogin.has(key)) notesByLogin.get(key).push(note)
    }
  }

  for (const notes of notesByLogin.values()) {
    notes.sort(
      (a, b) => b.date.getTime() - a.date.getTime() || a.title.localeCompare(b.title, "zh-CN"),
    )
  }

  return notesByLogin
}

function renderNoteGroups(notes) {
  if (notes.length === 0) {
    return "暂无参与笔记。"
  }

  const groups = new Map()
  for (const note of notes) {
    if (!groups.has(note.group)) groups.set(note.group, [])
    groups.get(note.group).push(note)
  }

  return Array.from(groups.entries())
    .sort(([, aNotes], [, bNotes]) => bNotes[0].date.getTime() - aNotes[0].date.getTime())
    .map(([group, groupNotes]) => {
      const items = groupNotes
        .map((note) => `- ${wikiLink(note.relPath, note.title)} · ${note.dateText}`)
        .join("\n")
      return [`### ${group}`, "", items].join("\n")
    })
    .join("\n\n")
}

function renderReadmeSection(collaborators) {
  const cells = collaborators.map((user) => {
    const avatarPath = `content/assets/collaborators/${user.login.toLowerCase()}.png`
    return [
      '<td align="center">',
      `  <a href="${user.htmlUrl}">`,
      `    <img src="${avatarPath}" width="64" height="64" alt="@${user.login}" />`,
      "  </a>",
      "  <br />",
      `  <sub><b>@${user.login}</b></sub>`,
      "</td>",
    ].join("\n")
  })

  const rows = []
  for (let index = 0; index < cells.length; index += 6) {
    rows.push(`<tr>\n${cells.slice(index, index + 6).join("\n")}\n</tr>`)
  }

  return [
    "## Collaborators / 协作者",
    "",
    "<!-- collaborators:start -->",
    "",
    "这些 GitHub 账号拥有本仓库协作权限。",
    "",
    "<table>",
    rows.join("\n"),
    "</table>",
    "",
    "<!-- collaborators:end -->",
    "",
  ].join("\n")
}

async function updateReadme(collaborators) {
  const readme = await fs.readFile(readmePath, "utf8")
  const section = renderReadmeSection(collaborators)
  const markerPattern =
    /## Collaborators \/ 协作者\s+<!-- collaborators:start -->[\s\S]*?<!-- collaborators:end -->\s*/m

  if (markerPattern.test(readme)) {
    return writeIfChanged(readmePath, readme.replace(markerPattern, section))
  }

  const insertionPoint = "\n## 本地打开 Obsidian vault"
  if (readme.includes(insertionPoint)) {
    return writeIfChanged(
      readmePath,
      readme.replace(insertionPoint, `\n${section}${insertionPoint}`),
    )
  }

  return writeIfChanged(readmePath, `${readme.trimEnd()}\n\n${section}`)
}

function renderCollaboratorHeader(user, notes) {
  const avatarPath = `../assets/collaborators/${user.login.toLowerCase()}.png`
  const display =
    user.displayName && user.displayName !== user.login
      ? `${user.displayName}（@${user.login}）`
      : `@${user.login}`
  return [
    `## ${display}`,
    "",
    '<div class="collaborator-profile">',
    `  <a href="${user.htmlUrl}" target="_blank" rel="noopener noreferrer">`,
    `    <img class="collaborator-avatar" src="${avatarPath}" alt="@${user.login}" width="96" height="96" />`,
    "  </a>",
    '  <div class="collaborator-meta">',
    `    <a href="${user.htmlUrl}" target="_blank" rel="noopener noreferrer">@${user.login}</a>`,
    `    <span>参与 ${notes.length} 篇笔记</span>`,
    "  </div>",
    "</div>",
  ].join("\n")
}

function renderCollaboratorsPage(collaborators, notesByLogin) {
  const { date } = localDateParts(new Date())
  const sections = collaborators
    .map((user) => {
      const notes = notesByLogin.get(user.login.toLowerCase()) || []
      return [renderCollaboratorHeader(user, notes), "", renderNoteGroups(notes)].join("\n")
    })
    .join("\n\n---\n\n")

  return `---
title: 协作者
created: 2026-06-04
updated: ${date}
tags:
  - 协作
---

# 协作者

这些 GitHub 账号拥有本仓库协作权限。

每篇正式笔记的 \`authors\` 字段请填写 GitHub 用户名；中文名只作为页面展示名使用。多人共同完成的笔记可以在 \`authors\` 中写多个 GitHub 用户名，它会同时出现在每位作者名下。

${sections}
`
}

async function updateDataFile(repository, collaborators) {
  const data = {
    source: "github-collaborators",
    repository,
    collaborators,
  }
  return writeIfChanged(dataPath, `${JSON.stringify(data, null, 2)}\n`)
}

function renderMaintainersModule(repository, collaborators) {
  const logins = collaborators
    .map((user) =>
      String(user.login || "")
        .trim()
        .toLowerCase(),
    )
    .filter(Boolean)
    .sort()

  return [
    "// This file is generated by scripts/update-collaborators.mjs.",
    "// Do not edit by hand.",
    "",
    "// prettier-ignore",
    "export const generatedMaintainerLogins = [",
    ...logins.map((login) => `  ${JSON.stringify(login)},`),
    "]",
    "",
    "export const generatedMaintainerSource = {",
    '  source: "github-collaborators",',
    `  repository: ${JSON.stringify(repository)},`,
    "}",
    "",
  ].join("\n")
}

async function updateMaintainersModule(repository, collaborators) {
  return writeIfChanged(maintainersPath, renderMaintainersModule(repository, collaborators))
}

async function main() {
  const { owner, repo } = parseRepository()
  const repository = `${owner}/${repo}`
  const previousLogins = await readExistingCollaboratorLogins()
  let rawCollaborators

  try {
    rawCollaborators = await listCollaborators(owner, repo)
  } catch (error) {
    const hasToken = Boolean(
      process.env.COLLABORATORS_TOKEN || process.env.GH_TOKEN || process.env.GITHUB_TOKEN,
    )
    if (process.env.GITHUB_ACTIONS || hasToken) {
      throw error
    }

    const existingCollaborators = await readExistingCollaborators()
    if (existingCollaborators.length > 0) {
      console.warn(
        "Could not list collaborators without a token. Falling back to data/collaborators.json.",
      )
      rawCollaborators = existingCollaborators
    } else {
      console.warn(
        `Could not list collaborators without a token. Falling back to repository owner: ${owner}`,
      )
      rawCollaborators = [await getUser(owner)]
    }
  }

  const byLogin = new Map()
  for (const user of rawCollaborators) {
    if (user?.login) {
      const detailedUser =
        user.displayName || user.name ? user : { ...user, ...(await getUser(user.login)) }
      byLogin.set(user.login.toLowerCase(), normalizeCollaborator(detailedUser))
    }
  }

  if (!byLogin.has(owner.toLowerCase())) {
    byLogin.set(owner.toLowerCase(), normalizeCollaborator(await getUser(owner)))
  }

  const collaborators = Array.from(byLogin.values()).sort((a, b) => a.login.localeCompare(b.login))
  const nextLogins = collaborators.map((user) => user.login).sort()

  await fs.mkdir(avatarDir, { recursive: true })
  await Promise.all(collaborators.map(writeCircularAvatar))
  await removeStaleAvatars(collaborators)
  const notesByLogin = await collectNotesByCollaborator(collaborators)
  await updateDataFile(repository, collaborators)
  await updateMaintainersModule(repository, collaborators)
  await writeIfChanged(pagePath, renderCollaboratorsPage(collaborators, notesByLogin))
  await updateReadme(collaborators)
  if (!sameLogins(previousLogins, nextLogins)) {
    await updateCollaboratorTimeline(collaborators)
  }

  console.log(
    `Updated ${collaborators.length} collaborator(s): ${collaborators.map((u) => u.login).join(", ")}`,
  )
}

await main()
