// === Obsidian-style graph runtime (d3 + pixi, self-hosted) ===
// Path helpers (mirror Quartz's slug normalization)
function trimSlash(s) {
  if (s.startsWith("/")) s = s.slice(1)
  if (s.endsWith("/")) s = s.slice(0, -1)
  return s
}
function simplifySlug(fp) {
  try {
    fp = decodeURIComponent(fp)
  } catch (e) {}
  fp = trimSlash(fp)
  if (fp.endsWith("/index")) fp = fp.slice(0, -"/index".length)
  if (fp === "index" || fp === "") return "/"
  return fp
}
function getBasepath() {
  return (document.body && document.body.dataset && document.body.dataset.basepath) || ""
}
function currentSlug() {
  var p = window.location.pathname
  try {
    p = decodeURIComponent(p)
  } catch (e) {}
  var bp = getBasepath()
  if (bp) {
    var bpTrim = trimSlash(bp)
    var pTrim = trimSlash(p)
    if (pTrim.startsWith(bpTrim)) pTrim = pTrim.slice(bpTrim.length)
    p = pTrim
  }
  p = trimSlash(p)
  return p === "" ? "/" : p
}
function urlForSlug(slug) {
  var bp = getBasepath()
  var path = slug.startsWith("/") ? slug : "/" + slug
  return (bp ? bp : "") + path
}
function clearChildren(el) {
  while (el.firstChild) el.removeChild(el.firstChild)
}

// localStorage visited set
var VISITED_KEY = "graph-visited"
function visitedSet() {
  try {
    return new Set(JSON.parse(localStorage.getItem(VISITED_KEY) || "[]"))
  } catch (e) {
    return new Set()
  }
}
function markVisited(slug) {
  var v = visitedSet()
  v.add(slug)
  try {
    localStorage.setItem(VISITED_KEY, JSON.stringify(Array.from(v)))
  } catch (e) {}
}

// Resolve a CSS color string to an rgb() value the renderer can parse.
function resolveColor(value, fallback) {
  if (!value) return fallback
  var probe = document.createElement("div")
  probe.style.color = value
  probe.style.position = "absolute"
  probe.style.visibility = "hidden"
  document.body.appendChild(probe)
  var c = getComputedStyle(probe).color
  probe.remove()
  return c || fallback
}

// Folder palette: stable hash -> hue, so each top-level folder gets its own color.
function folderOf(slug) {
  if (slug.startsWith("tags/")) return "__tag__"
  var i = slug.indexOf("/")
  return i > 0 ? slug.slice(0, i) : "__root__"
}
function hashHue(str) {
  var h = 0
  for (var i = 0; i < str.length; i++) {
    h = (h << 5) - h + str.charCodeAt(i)
    h |= 0
  }
  return ((h % 360) + 360) % 360
}
