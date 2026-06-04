import { execFileSync } from "node:child_process"
import fs from "node:fs/promises"
import path from "node:path"
import sharp from "sharp"

const root = process.cwd()
const readmePath = path.join(root, "README.md")
const dataPath = path.join(root, "data", "collaborators.json")
const pagePath = path.join(root, "content", "其他信息", "协作者.md")
const timelinePath = path.join(root, "content", "其他信息", "维护时间线.md")
const avatarDir = path.join(root, "content", "assets", "collaborators")
const apiVersion = "2022-11-28"
const timelineStart = "<!-- timeline:start -->"
const timelineEnd = "<!-- timeline:end -->"
const timezone = process.env.TIMELINE_TIMEZONE || "Asia/Shanghai"

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
    throw new Error(`GitHub API request failed: ${response.status} ${response.statusText}\n${url}\n${body}`)
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
    htmlUrl: user.html_url || `https://github.com/${user.login}`,
    avatarUrl: user.avatar_url || `https://github.com/${user.login}.png`,
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
    return (data.collaborators || []).map((user) => user.login).filter(Boolean).sort()
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

  const parts = Object.fromEntries(formatter.formatToParts(date).map((part) => [part.type, part.value]))
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
      ? currentBlock.split(/\r?\n/).map((line) => line.trim()).filter((line) => line && !/^暂无记录[。.]$/.test(line))
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
  const response = await fetch(avatarFetchUrl(collaborator.avatarUrl))
  if (!response.ok) {
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

  const filename = `${collaborator.login.toLowerCase()}.png`
  await writeIfChanged(path.join(avatarDir, filename), output)
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
    return writeIfChanged(readmePath, readme.replace(insertionPoint, `\n${section}${insertionPoint}`))
  }

  return writeIfChanged(readmePath, `${readme.trimEnd()}\n\n${section}`)
}

function renderCollaboratorsPage(collaborators) {
  const cards = collaborators
    .map((user) => {
      const avatarPath = `../assets/collaborators/${user.login.toLowerCase()}.png`
      return [
        `<a href="${user.htmlUrl}" target="_blank" rel="noopener noreferrer" style="display:flex;min-height:150px;align-items:center;justify-content:center;flex-direction:column;gap:0.65rem;padding:1rem;border:1px solid var(--lightgray);border-radius:8px;background:color-mix(in srgb, var(--light) 92%, var(--secondary));text-decoration:none;">`,
        `  <img src="${avatarPath}" alt="@${user.login}" width="96" height="96" style="display:block;border-radius:50%;box-shadow:0 0 0 3px color-mix(in srgb, var(--secondary) 25%, transparent);" />`,
        `  <span style="color:var(--dark);font-weight:700;">@${user.login}</span>`,
        "</a>",
      ].join("\n")
    })
    .join("\n")

  return `---
title: 协作者
created: 2026-06-04
updated: 2026-06-04
tags:
  - 协作
---

# 协作者

这些 GitHub 账号拥有本仓库协作权限。

<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(128px,1fr));gap:1rem;margin:1.25rem 0;">
${cards}
</div>
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

    console.warn(`Could not list collaborators without a token. Falling back to repository owner: ${owner}`)
    rawCollaborators = [await getUser(owner)]
  }

  const byLogin = new Map()
  for (const user of rawCollaborators) {
    if (user?.login) byLogin.set(user.login.toLowerCase(), normalizeCollaborator(user))
  }

  if (!byLogin.has(owner.toLowerCase())) {
    byLogin.set(owner.toLowerCase(), normalizeCollaborator(await getUser(owner)))
  }

  const collaborators = Array.from(byLogin.values()).sort((a, b) => a.login.localeCompare(b.login))
  const nextLogins = collaborators.map((user) => user.login).sort()

  await fs.mkdir(avatarDir, { recursive: true })
  await Promise.all(collaborators.map(writeCircularAvatar))
  await removeStaleAvatars(collaborators)
  await updateDataFile(repository, collaborators)
  await writeIfChanged(pagePath, renderCollaboratorsPage(collaborators))
  await updateReadme(collaborators)
  if (!sameLogins(previousLogins, nextLogins)) {
    await updateCollaboratorTimeline(collaborators)
  }

  console.log(`Updated ${collaborators.length} collaborator(s): ${collaborators.map((u) => u.login).join(", ")}`)
}

await main()
