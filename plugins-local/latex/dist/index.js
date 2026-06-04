import remarkMath from "remark-math"
import rehypeKatex from "rehype-katex"

const singleLineDisplayMath = /(^|\r?\n)([ \t]*)\$\$([^\r\n]*?)\$\$[ \t]*(?=\r?\n|$)/g

function normalizeSingleLineDisplayMath(src) {
  return src.replace(singleLineDisplayMath, (match, prefix, indent, value) => {
    const math = value.trim()
    if (!math) return match

    return `${prefix}${indent}$$\n${indent}${math}\n${indent}$$`
  })
}

export const Latex = (opts = {}) => {
  const macros = opts.customMacros ?? {}

  return {
    name: "Latex",
    textTransform(_ctx, src) {
      return normalizeSingleLineDisplayMath(src)
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
