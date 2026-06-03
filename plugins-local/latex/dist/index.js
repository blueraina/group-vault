import remarkMath from "remark-math"
import rehypeKatex from "rehype-katex"

export const Latex = (opts = {}) => {
  const macros = opts.customMacros ?? {}

  return {
    name: "Latex",
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
