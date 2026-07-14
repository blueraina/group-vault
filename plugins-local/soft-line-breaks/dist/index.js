function replaceSoftLineBreaks(node) {
  if (!Array.isArray(node?.children)) return

  for (let index = 0; index < node.children.length; index += 1) {
    const child = node.children[index]

    if (child?.type === "text" && typeof child.value === "string" && child.value.includes("\n")) {
      const lines = child.value.split("\n")
      const replacement = []

      for (let lineIndex = 0; lineIndex < lines.length; lineIndex += 1) {
        const value = lines[lineIndex]
        if (value) replacement.push({ type: "text", value })
        if (lineIndex < lines.length - 1) replacement.push({ type: "break" })
      }

      node.children.splice(index, 1, ...replacement)
      index += replacement.length - 1
      continue
    }

    replaceSoftLineBreaks(child)
  }
}

function softLineBreaksPlugin() {
  return (tree) => replaceSoftLineBreaks(tree)
}

export const SoftLineBreaks = () => ({
  name: "SoftLineBreaks",
  markdownPlugins() {
    return [softLineBreaksPlugin]
  },
})
