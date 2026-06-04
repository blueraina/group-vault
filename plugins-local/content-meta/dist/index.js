import { h } from "preact"
import { formatDate } from "@quartz-community/utils/date"
import { getDate } from "@quartz-community/utils/sort"

const style = `.content-meta {
  margin-top: 0;
  color: var(--darkgray);
}
.content-meta[show-comma=true] > *:not(:last-child) {
  margin-right: 8px;
}
.content-meta[show-comma=true] > *:not(:last-child)::after {
  content: ",";
}`

const defaultOptions = {
  showReadingTime: true,
  showWordCount: true,
  showComma: true,
  wordsPerMinute: 200,
}

const cjkPattern = /[\p{Script=Han}\p{Script=Hiragana}\p{Script=Katakana}\p{Script=Hangul}]/gu
const wordPattern = /[A-Za-z0-9]+(?:[.'_-][A-Za-z0-9]+)*/g

function classNames(...classes) {
  return classes.filter(Boolean).join(" ")
}

function stripMarkdown(text) {
  return text
    .replace(/^---\s*[\s\S]*?\n---\s*/u, " ")
    .replace(/```[\s\S]*?```/gu, " ")
    .replace(/~~~[\s\S]*?~~~/gu, " ")
    .replace(/\$\$[\s\S]*?\$\$/gu, " ")
    .replace(/\\\[[\s\S]*?\\\]/gu, " ")
    .replace(/\\\([\s\S]*?\\\)/gu, " ")
    .replace(/\$[^$\n]*\$/gu, " ")
    .replace(/!\[[^\]]*?\]\([^)]*?\)/gu, " ")
    .replace(/\[([^\]]+?)\]\([^)]*?\)/gu, "$1")
    .replace(/!\[\[[^\]]*?\]\]/gu, " ")
    .replace(/\[\[([^\]|]+?)\|([^\]]+?)\]\]/gu, "$2")
    .replace(/\[\[([^\]]+?)\]\]/gu, "$1")
    .replace(/<[^>]+>/gu, " ")
    .replace(/^>\s*\[![^\]]+\]\s*/gmu, "")
    .replace(/^>\s?/gmu, "")
    .replace(/^#{1,6}\s+/gmu, "")
    .replace(/^[\s>*-]*[-+*]\s+/gmu, "")
    .replace(/^[\s>*-]*\d+[.)]\s+/gmu, "")
    .replace(/[`*_~|#>[\]{}()\\]/gu, " ")
}

function countWords(text) {
  const plainText = stripMarkdown(text)
  const cjkMatches = plainText.match(cjkPattern) ?? []
  const withoutCjk = plainText.replace(cjkPattern, " ")
  const wordMatches = withoutCjk.match(wordPattern) ?? []
  return cjkMatches.length + wordMatches.length
}

function readingMinutes(wordCount, wordsPerMinute) {
  if (wordCount === 0) return 0
  return Math.max(1, Math.ceil(wordCount / wordsPerMinute))
}

function formatWordCount(wordCount) {
  return `约 ${wordCount.toLocaleString("zh-CN")} 字`
}

function formatReadingTime(minutes) {
  return `${minutes}分钟阅读`
}

function DateComponent({ date, locale }) {
  return h("time", { datetime: date.toISOString() }, formatDate(date, locale))
}

const ContentMeta = (opts = {}) => {
  const options = { ...defaultOptions, ...opts }

  function ContentMetadata({ cfg, fileData, displayClass }) {
    const text = fileData.text
    if (!text) return null

    const segments = []

    if (fileData.dates) {
      const locale = cfg.locale || "en-US"
      const defaultDateType = fileData.defaultDateType ?? cfg.defaultDateType
      if (defaultDateType) {
        const date = getDate({ ...fileData, defaultDateType })
        if (date) segments.push(h(DateComponent, { date, locale }))
      }
    }

    const wordCount = countWords(text)

    if (options.showReadingTime && wordCount > 0) {
      segments.push(h("span", null, formatReadingTime(readingMinutes(wordCount, options.wordsPerMinute))))
    }

    if (options.showWordCount) {
      segments.push(h("span", null, formatWordCount(wordCount)))
    }

    return h("p", { "show-comma": options.showComma, class: classNames(displayClass, "content-meta") }, segments)
  }

  ContentMetadata.css = style
  return ContentMetadata
}

export { ContentMeta }
