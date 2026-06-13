// Rebuilds plugins-local/graph/dist/{index.js, components/index.js} from the
// readable runtime sources in src/. Run with node 22:  node build-runtime.cjs
//
// The graph runtime is hand-authored (not produced by the upstream tsup build).
// src/00..50 form the d3+pixi runtime; src/60 is the Chinese settings panel.
// Both are concatenated, JSON-stringified, and spliced into the two dist files
// in place of the original graph_inline_default / graph_settings_default values.
const fs = require("fs")
const path = require("path")

const dir = __dirname
const srcDir = path.join(dir, "src")

const runtime = [
  "00-loader.js",
  "10-helpers.js",
  "20-render.js",
  "30-scene.js",
  "40-loop.js",
  "50-orchestration.js",
].map((f) => fs.readFileSync(path.join(srcDir, f), "utf8")).join("\n")

const settings = fs.readFileSync(path.join(srcDir, "60-settings.js"), "utf8")

function embed(distPath) {
  let src = fs.readFileSync(distPath, "utf8")

  const inlineRe = /var graph_inline_default = (?:`[\s\S]*?`|"(?:[^"\\]|\\.)*");/
  if (!inlineRe.test(src)) throw new Error("graph_inline_default marker not found in " + distPath)
  src = src.replace(inlineRe, "var graph_inline_default = " + JSON.stringify(runtime) + ";")

  const settingsRe = /var graph_settings_default = (?:`[\s\S]*?`|"(?:[^"\\]|\\.)*");/
  if (!settingsRe.test(src)) throw new Error("graph_settings_default marker not found in " + distPath)
  src = src.replace(settingsRe, "var graph_settings_default = " + JSON.stringify(settings) + ";")

  fs.writeFileSync(distPath, src)
  console.log("updated", path.relative(dir, distPath))
}

embed(path.join(dir, "dist", "components", "index.js"))
embed(path.join(dir, "dist", "index.js"))
