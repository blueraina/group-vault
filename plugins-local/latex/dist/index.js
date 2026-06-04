import remarkMath from "remark-math"
import rehypeKatex from "rehype-katex"

function splitLinePrefix(line) {
  const quoteMatch = line.match(/^(\s*(?:>\s?)*)/)
  const quotePrefix = quoteMatch?.[1] ?? ""
  if (quotePrefix.includes(">")) {
    return { prefix: quotePrefix, text: line.slice(quotePrefix.length) }
  }

  const indent = line.match(/^\s*/)?.[0] ?? ""
  return { prefix: indent, text: line.slice(indent.length) }
}

function mathContinuationPrefix(prefix, text) {
  const listMatch = text.match(/^(\s*(?:[-+*]|\d+[.)])\s+)/)
  if (listMatch) return `${prefix}${" ".repeat(listMatch[1].length)}`

  const indent = text.match(/^\s*/)?.[0] ?? ""
  return `${prefix}${indent}`
}

function normalizeObsidianDisplayMath(src) {
  const lines = src.split(/\r?\n/)
  const out = []
  let inFence = false
  let fenceChar = null
  let inMath = false
  let mathPrefix = ""

  for (const line of lines) {
    const { prefix, text } = splitLinePrefix(line)
    const fenceMatch = text.match(/^\s*(```+|~~~+)/)

    if (!inMath && fenceMatch) {
      const marker = fenceMatch[1]
      out.push(line)

      if (!inFence) {
        inFence = true
        fenceChar = marker[0]
      } else if (marker[0] === fenceChar) {
        inFence = false
        fenceChar = null
      }

      continue
    }

    if (inFence || !line.includes("$$")) {
      out.push(inMath ? `${mathPrefix}${text}` : line)
      continue
    }

    let rest = text
    let textPrefix = prefix
    let continuationPrefix = mathContinuationPrefix(prefix, text)
    let emitted = false

    while (true) {
      const delimiterIndex = rest.indexOf("$$")

      if (delimiterIndex === -1) {
        if (rest.length > 0 || !emitted) {
          out.push(`${inMath ? mathPrefix : textPrefix}${rest}`)
        }
        break
      }

      if (inMath) {
        const beforeClose = rest.slice(0, delimiterIndex)
        if (beforeClose.length > 0) out.push(`${mathPrefix}${beforeClose.trimEnd()}`)
        out.push(`${mathPrefix}$$`)
        inMath = false
        emitted = true

        rest = rest.slice(delimiterIndex + 2).trimStart()
        if (rest.length === 0) break

        textPrefix = mathPrefix
        continuationPrefix = mathPrefix
        continue
      }

      const beforeOpen = rest.slice(0, delimiterIndex)
      if (beforeOpen.length > 0) {
        out.push(`${textPrefix}${beforeOpen.trimEnd()}`)
        emitted = true
      }

      out.push(`${continuationPrefix}$$`)
      inMath = true
      mathPrefix = continuationPrefix
      emitted = true
      rest = rest.slice(delimiterIndex + 2)
      if (rest.length === 0) break
    }
  }

  return out.join("\n")
}

export const Latex = (opts = {}) => {
  const macros = opts.customMacros ?? {}

  return {
    name: "Latex",
    textTransform(_ctx, src) {
      return normalizeObsidianDisplayMath(src)
    },
    markdownPlugins() {
      return [remarkMath]
    },
    htmlPlugins() {
      return [[rehypeKatex, { output: "html", macros, ...(opts.katexOptions ?? {}) }]]
    },
    externalResources() {
      return {
        css: [{ content: "https://cdn.jsdelivr.net/npm/katex@0.16.11/dist/katex.min.css" }],
        js: [
          {
            src: "https://cdn.jsdelivr.net/npm/katex@0.16.11/dist/contrib/copy-tex.min.js",
            loadTime: "afterDOMReady",
            contentType: "external",
          },
        ],
      }
    },
  }
}
