import { execFileSync } from "node:child_process"
import { existsSync, readFileSync, writeFileSync } from "node:fs"

const timelinePath = "content/维护时间线.md"
const timelineStart = "<!-- timeline:start -->"
const timelineEnd = "<!-- timeline:end -->"
const timezone = process.env.TIMELINE_TIMEZONE || "Asia/Shanghai"
const maxEntries = Number(process.env.TIMELINE_MAX_ENTRIES || 300)
const args = new Set(process.argv.slice(2))

const runGit = (args) =>
  execFileSync("git", args, {
    encoding: "utf8",
    stdio: ["ignore", "pipe", "pipe"],
  }).trim()

const localDateParts = (date) => {
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

const today = () => localDateParts(new Date()).date

const createTimeline = () => `---
title: 维护时间线
created: ${today()}
updated: ${today()}
tags:
  - 维护
authors:
  - GitHub Actions
status: stable
owner: 管理员
---

# 维护时间线

本页由 GitHub Actions 自动更新，记录 \`content/\` 内笔记的新增、修改、删除和重命名。请不要手动编辑时间线正文。

${timelineStart}
暂无记录。
${timelineEnd}
`

const isZeroSha = (sha) => !sha || /^0+$/.test(sha)

const readPushRange = () => {
  if (process.env.TIMELINE_RANGE) return process.env.TIMELINE_RANGE

  const eventPath = process.env.GITHUB_EVENT_PATH
  if (!eventPath || !existsSync(eventPath)) return null

  const payload = JSON.parse(readFileSync(eventPath, "utf8"))
  if (!payload.after) return null
  if (isZeroSha(payload.before)) return payload.after
  return `${payload.before}..${payload.after}`
}

const commitsForRange = (range) => {
  if (!range) return [runGit(["rev-parse", "HEAD"])]
  if (!range.includes("..")) return [runGit(["rev-parse", range])]

  const output = runGit(["rev-list", "--reverse", range])
  return output ? output.split(/\r?\n/).filter(Boolean) : []
}

const markdownNote = (filePath) => filePath.startsWith("content/") && filePath.endsWith(".md") && filePath !== timelinePath

const noteStem = (filePath) => filePath.replace(/^content\//, "").replace(/\.md$/, "")

const noteTarget = (filePath) => `[[${noteStem(filePath)}]]`

const deletedTarget = (filePath) => `\`${noteStem(filePath)}\``

const actionLabels = {
  A: "新增",
  C: "复制",
  D: "删除",
  M: "修改",
  R: "重命名",
}

const parseChangeLine = (line) => {
  const [status, firstPath, secondPath] = line.split("\t")
  if (!status || !firstPath) return null

  const action = status[0]
  if (action === "R") {
    if (!markdownNote(firstPath) && !markdownNote(secondPath)) return null
    return {
      action,
      target: `${deletedTarget(firstPath)} -> ${noteTarget(secondPath)}`,
    }
  }

  if (!markdownNote(firstPath)) return null

  return {
    action,
    target: action === "D" ? deletedTarget(firstPath) : noteTarget(firstPath),
  }
}

const entriesForCommit = (sha) => {
  const [fullSha, author, isoDate, subject] = runGit(["show", "-s", "--format=%H%x1f%an%x1f%aI%x1f%s", sha]).split("\x1f")
  if (/^chore: update maintenance timeline$/i.test(subject || "")) return []

  const changes = runGit([
    "-c",
    "core.quotepath=false",
    "diff-tree",
    "--root",
    "--no-commit-id",
    "--name-status",
    "-r",
    "-M",
    fullSha,
    "--",
    "content",
  ])
  if (!changes) return []

  const time = localDateParts(new Date(isoDate)).dateTime
  const shortSha = fullSha.slice(0, 7)

  return changes
    .split(/\r?\n/)
    .map(parseChangeLine)
    .filter(Boolean)
    .map((change) => `- ${time} · ${author} · ${actionLabels[change.action] || change.action} · ${change.target} · \`${shortSha}\``)
}

const replaceTimelineBody = (content, entries) => {
  const startIndex = content.indexOf(timelineStart)
  const endIndex = content.indexOf(timelineEnd)
  const currentBlock =
    startIndex >= 0 && endIndex > startIndex
      ? content.slice(startIndex + timelineStart.length, endIndex).trim()
      : ""

  const currentEntries =
    currentBlock && currentBlock !== "暂无记录."
      ? currentBlock.split(/\r?\n/).map((line) => line.trim()).filter(Boolean)
      : []

  const known = new Set(currentEntries)
  const newEntries = entries.filter((entry) => !known.has(entry))
  if (newEntries.length === 0 && existsSync(timelinePath)) return null

  const nextEntries = [...newEntries, ...currentEntries].slice(0, maxEntries)
  const body = nextEntries.length > 0 ? nextEntries.join("\n") : "暂无记录."
  const updatedContent = content
    .replace(/^updated:\s*\d{4}-\d{2}-\d{2}/m, `updated: ${today()}`)
    .replace(
      new RegExp(`${timelineStart}[\\s\\S]*?${timelineEnd}`),
      `${timelineStart}\n${body}\n${timelineEnd}`,
    )

  return updatedContent
}

if (args.has("--init")) {
  if (!existsSync(timelinePath)) writeFileSync(timelinePath, createTimeline(), "utf8")
  process.exit(0)
}

const range = readPushRange()
const commits = commitsForRange(range)
const entries = commits.flatMap(entriesForCommit)

if (args.has("--dry-run")) {
  console.log(entries.length > 0 ? entries.join("\n") : "No timeline entries.")
  process.exit(0)
}

const currentContent = existsSync(timelinePath) ? readFileSync(timelinePath, "utf8") : createTimeline()
const nextContent = replaceTimelineBody(currentContent, entries)

if (nextContent) writeFileSync(timelinePath, nextContent, "utf8")
