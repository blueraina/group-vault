import remarkMath from "remark-math"
import rehypeKatex from "rehype-katex"

const TIKZJAX_SCRIPT_URL = "https://tikzjax.com/v1/tikzjax.js"
const TIKZJAX_FONTS_URL = "https://tikzjax.com/v1/fonts.css"

function collectText(node) {
  if (!node) return ""
  if (node.type === "text") return node.value ?? ""
  if (!Array.isArray(node.children)) return ""
  return node.children.map(collectText).join("")
}

function classList(node) {
  const className = node?.properties?.className ?? node?.properties?.class ?? []
  if (Array.isArray(className)) return className.map(String)
  return String(className).split(/\s+/).filter(Boolean)
}

function propertyLanguage(node) {
  const props = node?.properties ?? {}
  return String(
    props.dataLanguage ??
      props["data-language"] ??
      props.language ??
      props.lang ??
      "",
  ).toLowerCase()
}

function isTikzElement(node) {
  const language = propertyLanguage(node)
  if (language === "tikz" || language === "tikzpicture") return true

  return classList(node).some((name) => {
    const normalized = name.toLowerCase()
    return (
      normalized === "tikz" ||
      normalized === "tikzpicture" ||
      normalized === "language-tikz" ||
      normalized === "lang-tikz" ||
      normalized === "language-tikzpicture" ||
      normalized === "lang-tikzpicture"
    )
  })
}

function findCodeElement(node) {
  if (!node || !Array.isArray(node.children)) return undefined
  return node.children.find((child) => child?.type === "element" && child.tagName === "code")
}

function tikzNode(source) {
  const value = source.trim()
  return {
    type: "element",
    tagName: "div",
    properties: { className: ["tikzjax-container"] },
    children: [
      {
        type: "element",
        tagName: "script",
        properties: { type: "text/tikz" },
        children: [{ type: "text", value }],
      },
    ],
  }
}

function rehypeTikzJax() {
  return (tree) => {
    function walk(parent) {
      if (!Array.isArray(parent.children)) return

      for (let i = 0; i < parent.children.length; i++) {
        const child = parent.children[i]
        if (child?.type !== "element") continue

        if (child.tagName === "pre") {
          const code = findCodeElement(child)
          if (isTikzElement(child) || isTikzElement(code)) {
            const source = collectText(code ?? child)
            if (source.trim().length > 0) {
              parent.children[i] = tikzNode(source)
              continue
            }
          }
        }

        walk(child)
      }
    }

    walk(tree)
  }
}

const tikzJaxScript = String.raw`
(() => {
  const tikzJaxUrl = "${TIKZJAX_SCRIPT_URL}"
  let renderQueue = Promise.resolve()

  function hasTikzBlocks() {
    return document.querySelector('script[type="text/tikz"]') !== null
  }

  function loadTikzJax() {
    return new Promise((resolve, reject) => {
      const script = document.createElement("script")
      script.src = tikzJaxUrl
      script.async = true
      script.onload = resolve
      script.onerror = reject
      document.head.appendChild(script)
    })
  }

  async function renderTikzBlocks() {
    if (!hasTikzBlocks()) return

    const previousOnload = window.onload
    await loadTikzJax()
    const tikzOnload = window.onload

    if (typeof tikzOnload === "function" && tikzOnload !== previousOnload) {
      await Promise.resolve(tikzOnload.call(window))
      window.onload = previousOnload
    }
  }

  function scheduleRender() {
    renderQueue = renderQueue
      .catch(() => undefined)
      .then(() => renderTikzBlocks())
      .catch((error) => {
        console.error("TikZJax rendering failed", error)
      })
  }

  document.addEventListener("nav", scheduleRender)

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", scheduleRender, { once: true })
  } else {
    scheduleRender()
  }
})()
`

const tikzJaxStyles = String.raw`
.tikzjax-container {
  display: flex;
  justify-content: center;
  max-width: 100%;
  margin: 1.25rem 0;
  overflow-x: auto;
}

.tikzjax-container > script[type="text/tikz"] {
  display: block;
  min-height: 3rem;
  color: var(--gray);
  font-family: var(--codeFont);
  white-space: pre-wrap;
}

.tikzjax-container svg {
  max-width: 100%;
  height: auto;
}
`

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
      return [[rehypeKatex, { output: "html", macros, ...(opts.katexOptions ?? {}) }], rehypeTikzJax]
    },
    externalResources() {
      return {
        css: [
          { content: "https://cdn.jsdelivr.net/npm/katex@0.16.11/dist/katex.min.css" },
          { content: TIKZJAX_FONTS_URL },
          { content: tikzJaxStyles, inline: true },
        ],
        js: [
          {
            src: "https://cdn.jsdelivr.net/npm/katex@0.16.11/dist/contrib/copy-tex.min.js",
            loadTime: "afterDOMReady",
            contentType: "external",
          },
          {
            script: tikzJaxScript,
            loadTime: "afterDOMReady",
            contentType: "inline",
            spaPreserve: true,
          },
        ],
      }
    },
  }
}
