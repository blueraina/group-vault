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

// Reading-state marks share note IDs with the reading-state plugin.
var READING_STATE_LEGACY_PREFIX = "group-vault:reading-state:v1"
var READING_STATE_PREFIX = "group-vault:reading-state:v2"
var GRAPH_NOTE_ID_MAP_PATH = "/static/note-id-map.json"
var GRAPH_PROGRESS_COLORS = {
  read: "#2a9d8f",
  favorite: "#e9b44c",
  both: "#e84a5f",
}
var graphNoteMapState = window.__groupVaultNoteIdMap || {
  loaded: false,
  loading: null,
  slugToId: {},
  notes: {},
}
window.__groupVaultNoteIdMap = graphNoteMapState

function loadGraphNoteIdMap() {
  if (graphNoteMapState.loaded) return Promise.resolve(graphNoteMapState)
  if (graphNoteMapState.loading) return graphNoteMapState.loading

  graphNoteMapState.loading = fetch(GRAPH_NOTE_ID_MAP_PATH, { headers: { Accept: "application/json" } })
    .then(function (response) {
      return response
        .text()
        .then(function (text) {
          if (!text) return {}
          try {
            return JSON.parse(text)
          } catch (e) {
            return {}
          }
        })
        .then(function (data) {
          if (response.ok && data && typeof data === "object") {
            graphNoteMapState.slugToId = data.slugToId || {}
            graphNoteMapState.notes = data.notes || {}
          }
          return graphNoteMapState
        })
    })
    .catch(function () {
      graphNoteMapState.slugToId = graphNoteMapState.slugToId || {}
      graphNoteMapState.notes = graphNoteMapState.notes || {}
      return graphNoteMapState
    })
    .then(function (state) {
      graphNoteMapState.loaded = true
      graphNoteMapState.loading = null
      return state
    })

  return graphNoteMapState.loading
}

function readingStateId(slug) {
  var id = simplifySlug(String(slug || ""))
  if (id.endsWith(".html")) id = simplifySlug(id.slice(0, -".html".length))
  if (id === "/" || id === "") return "index"
  return trimSlash(id).replace(/\/index$/u, "") || "index"
}
function noteIdentityForSlug(slug) {
  var id = readingStateId(slug)
  var mappedId = graphNoteMapState.slugToId && graphNoteMapState.slugToId[id]
  var noteId = readingStateId(mappedId || id)
  var note = (graphNoteMapState.notes && graphNoteMapState.notes[noteId]) || {}
  var rawAliases = [id, noteId, note.slug]
  if (Array.isArray(note.aliases)) rawAliases = rawAliases.concat(note.aliases)

  var seen = {}
  var aliases = []
  for (var i = 0; i < rawAliases.length; i++) {
    var alias = readingStateId(rawAliases[i])
    if (!alias || seen[alias]) continue
    seen[alias] = true
    aliases.push(alias)
  }

  return { slug: id, noteId: noteId, aliases: aliases }
}
function readingStateKey(action, noteId) {
  return READING_STATE_PREFIX + ":" + action + ":" + noteId
}
function legacyReadingStateKey(action, slug) {
  return READING_STATE_LEGACY_PREFIX + ":" + action + ":" + slug
}
function hasReadingState(action, slug) {
  try {
    var identity = noteIdentityForSlug(slug)
    if (localStorage.getItem(readingStateKey(action, identity.noteId)) !== null) return true

    for (var i = 0; i < identity.aliases.length; i++) {
      var legacyValue = localStorage.getItem(legacyReadingStateKey(action, identity.aliases[i]))
      if (legacyValue !== null) {
        localStorage.setItem(readingStateKey(action, identity.noteId), legacyValue || new Date().toISOString())
        return true
      }
    }

    return false
  } catch (e) {
    return false
  }
}
function readingStateForSlug(slug) {
  var isRead = hasReadingState("read", slug)
  var isFavorite = hasReadingState("favorite", slug)
  if (isRead && isFavorite) return "both"
  if (isFavorite) return "favorite"
  if (isRead) return "read"
  return ""
}

function normalizeGraphTag(tag) {
  return String(tag || "")
    .trim()
    .replace(/^#+/, "")
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
