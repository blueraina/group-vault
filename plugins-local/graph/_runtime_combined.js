// Obsidian-style graph renderer for Quartz.
// Self-hosts d3 + pixi from <basepath>/static/ instead of a CDN.
(function () {
  function basepath() {
    return (typeof document !== "undefined" && document.body && document.body.dataset && document.body.dataset.basepath) || ""
  }
  function staticUrl(file) {
    var bp = basepath()
    return (bp ? bp : "") + "/static/" + file
  }
  function loadScript(src) {
    var existing = document.querySelector('script[data-graphlib="' + src + '"]')
    if (existing) {
      if (existing.dataset.loaded === "1") return Promise.resolve()
      return new Promise(function (res, rej) {
        existing.addEventListener("load", res)
        existing.addEventListener("error", rej)
      })
    }
    return new Promise(function (res, rej) {
      var s = document.createElement("script")
      s.src = src
      s.dataset.graphlib = src
      s.onload = function () {
        s.dataset.loaded = "1"
        res()
      }
      s.onerror = rej
      document.head.appendChild(s)
    })
  }

  function showError() {
    var nodes = document.querySelectorAll(".graph-container")
    for (var i = 0; i < nodes.length; i++) {
      nodes[i].textContent = "图谱无法加载，请检查网络连接。"
      nodes[i].style.display = "flex"
      nodes[i].style.alignItems = "center"
      nodes[i].style.justifyContent = "center"
      nodes[i].style.color = "var(--gray)"
      nodes[i].style.fontSize = "0.9rem"
    }
  }

  loadScript(staticUrl("d3.min.js"))
    .then(function () {
      return loadScript(staticUrl("pixi.min.js"))
    })
    .then(function () {
      if (!window.d3 || !window.PIXI) {
        console.error("[Graph] Libraries not loaded")
        showError()
        return
      }
      window.__graphLibsReady = true
      document.dispatchEvent(new CustomEvent("graphlibsready"))
    })
    .catch(function (err) {
      console.error("[Graph] Failed to load libraries:", err)
      showError()
    })
})();
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
// === renderGraph(container, fullSlug, renderId) -> cleanup fn ===
async function renderGraph(container, fullSlug, renderId) {
  var d3 = window.d3
  var PIXI = window.PIXI
  var slug = simplifySlug(fullSlug)
  if (slug === "") slug = "/"
  var visited = visitedSet()

  clearChildren(container)
  if (renderId !== undefined && renderId !== currentRenderEpoch) {
    return function () {}
  }

  var cfg = JSON.parse(container.dataset.cfg || "{}")
  var enableDrag = cfg.drag !== false
  var enableZoom = cfg.zoom !== false
  var depth = cfg.depth
  var showNeighborLinks = cfg.showNeighborLinks !== false
  var neighborLinkDepth = cfg.neighborLinkDepth != null ? cfg.neighborLinkDepth : depth
  var baseScale = cfg.scale || 1
  var repelForce = cfg.repelForce != null ? cfg.repelForce : 0.5
  var centerForce = cfg.centerForce != null ? cfg.centerForce : 0.3
  var linkDistance = cfg.linkDistance || 30
  var fontSize = cfg.fontSize || 0.5
  var opacityScale = cfg.opacityScale || 1
  var nodeSizeFactor = cfg.nodeSize || 1
  var linkWidth = cfg.linkWidth || 1
  var showArrows = !!cfg.showArrows
  var textOpacity = cfg.textOpacity != null ? cfg.textOpacity : 1
  var linkStrengthCfg = cfg.linkStrength || 1
  var removeNodes = cfg.removeNodes || []
  var hiddenNodes = new Set(removeNodes.map(function (n) { return simplifySlug(String(n)) }))
  var removeTags = cfg.removeTags || []
  var showTags = cfg.showTags
  var focusOnHover = cfg.focusOnHover

  var data
  try {
    var raw = await fetchData
    data = new Map()
    for (var key in raw) data.set(simplifySlug(key), raw[key])
  } catch (e) {
    console.error("[Graph] Error loading data:", e)
    return function () {}
  }

  var width = container.offsetWidth
  var height = Math.max(container.offsetHeight, 250)

  // Build link list + tag pseudo-nodes
  var allLinks = []
  var tagNodes = []
  var present = new Set(
    Array.from(data.keys()).filter(function (k) { return !hiddenNodes.has(k) }),
  )
  data.forEach(function (entry, src) {
    if (hiddenNodes.has(src)) return
    var links = entry.links || []
    for (var i = 0; i < links.length; i++) {
      var dst = simplifySlug(links[i])
      if (present.has(dst)) allLinks.push({ source: src, target: dst })
    }
    if (showTags) {
      var tags = entry.tags || []
      for (var t = 0; t < tags.length; t++) {
        var tag = tags[t]
        if (removeTags.indexOf(tag) !== -1) continue
        var tagId = simplifySlug("tags/" + tag)
        if (tagNodes.indexOf(tagId) === -1) tagNodes.push(tagId)
        allLinks.push({ source: src, target: tagId })
      }
    }
  })

  // BFS to compute the visible node set + per-node depth
  var visibleIds = new Set()
  var nodeDepths = new Map([[slug, 0]])
  if (depth >= 0) {
    var frontier = [slug]
    var seen = new Set([slug])
    for (var d = 0; d <= depth && frontier.length > 0; d++) {
      var next = []
      for (var fi = 0; fi < frontier.length; fi++) {
        var cur = frontier[fi]
        visibleIds.add(cur)
        for (var li = 0; li < allLinks.length; li++) {
          var lk = allLinks[li]
          if (lk.source === cur && !seen.has(lk.target)) {
            seen.add(lk.target)
            nodeDepths.set(lk.target, d + 1)
            next.push(lk.target)
          }
          if (lk.target === cur && !seen.has(lk.source)) {
            seen.add(lk.source)
            nodeDepths.set(lk.source, d + 1)
            next.push(lk.source)
          }
        }
      }
      frontier = next
    }
  } else {
    present.forEach(function (id) {
      visibleIds.add(id)
      nodeDepths.set(id, 0)
    })
    for (var ti = 0; ti < tagNodes.length; ti++) {
      visibleIds.add(tagNodes[ti])
      nodeDepths.set(tagNodes[ti], 0)
    }
  }

  // Materialize nodes
  var nodes = []
  var nodeById = new Map()
  visibleIds.forEach(function (id) {
    var isTag = id.startsWith("tags/")
    var text = isTag ? "#" + id.substring(5) : (data.get(id) && data.get(id).title) || id
    var node = {
      id: id,
      text: text,
      isTag: isTag,
      folder: folderOf(id),
      x: (Math.cos(visibleIds.size + nodes.length) * width) / 4,
      y: (Math.sin(visibleIds.size + nodes.length) * height) / 4,
    }
    nodes.push(node)
    nodeById.set(id, node)
  })

  // Materialize links (respecting neighbor-link depth)
  var links = []
  for (var lj = 0; lj < allLinks.length; lj++) {
    var L = allLinks[lj]
    if (!visibleIds.has(L.source) || !visibleIds.has(L.target)) continue
    var isCenter = L.source === slug || L.target === slug
    var nd = Math.max(nodeDepths.get(L.source) || 0, nodeDepths.get(L.target) || 0)
    if (isCenter || (showNeighborLinks && (depth < 0 || nd <= neighborLinkDepth))) {
      var s = nodeById.get(L.source)
      var t = nodeById.get(L.target)
      if (s && t) links.push({ source: s, target: t })
    }
  }

  // Degree map for sizing + adjacency for hover focus
  var degree = new Map()
  var adjacency = new Map()
  function bump(a, b) {
    degree.set(a, (degree.get(a) || 0) + 1)
    if (!adjacency.has(a)) adjacency.set(a, new Set())
    adjacency.get(a).add(b)
  }
  for (var di = 0; di < links.length; di++) {
    bump(links[di].source.id, links[di].target.id)
    bump(links[di].target.id, links[di].source.id)
  }
  function radiusOf(node) {
    return (2 + Math.sqrt(degree.get(node.id) || 0)) * nodeSizeFactor
  }

  return setupPixiScene({
    PIXI: PIXI,
    d3: d3,
    container: container,
    nodes: nodes,
    links: links,
    slug: slug,
    visited: visited,
    width: width,
    height: height,
    radiusOf: radiusOf,
    adjacency: adjacency,
    opts: {
      enableDrag: enableDrag,
      enableZoom: enableZoom,
      baseScale: baseScale,
      repelForce: repelForce,
      centerForce: centerForce,
      linkDistance: linkDistance,
      fontSize: fontSize,
      opacityScale: opacityScale,
      linkWidth: linkWidth,
      showArrows: showArrows,
      textOpacity: textOpacity,
      linkStrength: linkStrengthCfg,
      focusOnHover: focusOnHover,
    },
  })
}
// === setupPixiScene(ctx) -> cleanup fn ===
// Owns the pixi Application, the d3 force simulation, and the per-frame
// animation that gives the graph its Obsidian-like smoothness.
async function setupPixiScene(ctx) {
  var PIXI = ctx.PIXI
  var d3 = ctx.d3
  var container = ctx.container
  var nodes = ctx.nodes
  var links = ctx.links
  var slug = ctx.slug
  var visited = ctx.visited
  var width = ctx.width
  var height = ctx.height
  var radiusOf = ctx.radiusOf
  var adjacency = ctx.adjacency
  var o = ctx.opts

  // --- theme colors ---
  var root = getComputedStyle(document.documentElement)
  var colorCurrent = resolveColor(root.getPropertyValue("--secondary").trim(), "#284b63")
  var colorVisited = resolveColor(root.getPropertyValue("--tertiary").trim(), "#84a59d")
  var colorDefault = resolveColor(root.getPropertyValue("--gray").trim(), "#b8b8b8")
  var colorLink = resolveColor(root.getPropertyValue("--lightgray").trim(), "#e5e5e5")
  var colorText = resolveColor(root.getPropertyValue("--darkgray").trim(), "#4e4e4e")
  var colorLight = resolveColor(root.getPropertyValue("--light").trim(), "#faf8f8")
  var fontFamily = root.getPropertyValue("--bodyFont").trim() || "sans-serif"

  function toHex(rgb) {
    var m = rgb.match(/\d+/g)
    if (!m || m.length < 3) return 0x888888
    return (parseInt(m[0]) << 16) | (parseInt(m[1]) << 8) | parseInt(m[2])
  }
  var hexCurrent = toHex(colorCurrent)
  var hexVisited = toHex(colorVisited)
  var hexDefault = toHex(colorDefault)
  var hexLink = toHex(colorLink)
  var hexText = toHex(colorText)
  var hexLight = toHex(colorLight)

  // Folder hue -> distinct node colors, blended toward the theme so they stay tasteful.
  function hslToHex(h, s, l) {
    s /= 100; l /= 100
    var k = function (n) { return (n + h / 30) % 12 }
    var a = s * Math.min(l, 1 - l)
    var f = function (n) {
      var c = l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)))
      return Math.round(255 * c)
    }
    return (f(0) << 16) | (f(8) << 8) | f(4)
  }
  var folderColors = new Map()
  function colorForNode(node) {
    if (node.id === slug) return hexCurrent
    if (node.isTag) return hexVisited
    var folder = node.folder
    if (folder === "__root__") return visited.has(node.id) ? hexVisited : hexDefault
    if (!folderColors.has(folder)) {
      folderColors.set(folder, hslToHex(hashHue(folder), 55, 60))
    }
    return folderColors.get(folder)
  }

  // --- pixi app ---
  var app = new PIXI.Application()
  await app.init({
    width: width,
    height: height,
    antialias: true,
    backgroundAlpha: 0,
    resolution: window.devicePixelRatio || 1,
    autoDensity: true,
    eventMode: "static",
  })
  if (currentRenderEpoch !== undefined && container.dataset.epoch && Number(container.dataset.epoch) !== currentRenderEpoch) {
    try { app.destroy(true) } catch (e) {}
    return function () {}
  }
  container.appendChild(app.canvas)

  var stage = new PIXI.Container()
  app.stage.addChild(stage)
  var linkLayer = new PIXI.Container()
  var nodeLayer = new PIXI.Container()
  var labelLayer = new PIXI.Container()
  stage.addChild(linkLayer)
  stage.addChild(nodeLayer)
  stage.addChild(labelLayer)

  // --- force simulation ---
  var sim = d3
    .forceSimulation(nodes)
    .force("charge", d3.forceManyBody().strength(-80 * o.repelForce))
    .force("center", d3.forceCenter(0, 0).strength(o.centerForce))
    .force("link", d3.forceLink(links).distance(o.linkDistance).strength(o.linkStrength))
    .force("collide", d3.forceCollide().radius(function (n) { return radiusOf(n) + 4 }).iterations(2))
    .velocityDecay(0.35)
    .alphaDecay(0.02)

  // visual records
  var nodeGfx = []
  var linkGfx = []
  var hovered = null
  var dragging = false
  var transform = d3.zoomIdentity
  var introT = 0 // 0..1 fade-in

  for (var ni = 0; ni < nodes.length; ni++) {
    var node = nodes[ni]
    var r = radiusOf(node)
    var fill = colorForNode(node)

    var label = new PIXI.Text({
      text: node.text,
      style: { fontSize: o.fontSize * 16, fill: hexText, fontFamily: fontFamily },
      resolution: (window.devicePixelRatio || 1) * 3,
    })
    label.anchor.set(0.5, 0)
    label.alpha = 0
    label.scale.set(1 / o.baseScale)
    labelLayer.addChild(label)

    var gfx = new PIXI.Graphics()
    gfx.circle(0, 0, r)
    gfx.fill({ color: fill })
    if (node.isTag) gfx.stroke({ width: 1.5, color: hexVisited })
    gfx.eventMode = "static"
    gfx.cursor = "pointer"
    gfx.__id = node.id
    nodeLayer.addChild(gfx)

    var rec = { node: node, gfx: gfx, label: label, radius: r, baseColor: fill, focus: 0, targetFocus: 1 }
    nodeGfx.push(rec)
    bindHover(rec)
  }

  function bindHover(rec) {
    rec.gfx.on("pointerover", function () {
      if (dragging) return
      setHover(rec.node.id)
    })
    rec.gfx.on("pointerout", function () {
      if (dragging) return
      setHover(null)
    })
  }

  for (var li = 0; li < links.length; li++) {
    var lg = new PIXI.Graphics()
    lg.eventMode = "none"
    linkLayer.addChild(lg)
    linkGfx.push({ link: links[li], gfx: lg, focus: 0 })
  }

  // hover state: compute focus targets; the per-frame loop tweens toward them.
  function setHover(id) {
    hovered = id
    if (id === null) {
      for (var i = 0; i < nodeGfx.length; i++) nodeGfx[i].targetFocus = 1
      for (var j = 0; j < linkGfx.length; j++) linkGfx[j].targetFocus = 0
      return
    }
    var neigh = adjacency.get(id) || new Set()
    for (var i2 = 0; i2 < nodeGfx.length; i2++) {
      var nid = nodeGfx[i2].node.id
      nodeGfx[i2].targetFocus = nid === id || neigh.has(nid) ? 1 : (o.focusOnHover ? 0.15 : 1)
    }
    for (var j2 = 0; j2 < linkGfx.length; j2++) {
      var lk = linkGfx[j2].link
      var active = lk.source.id === id || lk.target.id === id
      linkGfx[j2].targetFocus = active ? 1 : 0
    }
  }

  return wireInteractionsAndLoop({
    PIXI: PIXI, d3: d3, app: app, stage: stage, container: container,
    nodes: nodes, links: links, nodeGfx: nodeGfx, linkGfx: linkGfx,
    slug: slug, width: width, height: height, sim: sim, o: o,
    radiusOf: radiusOf,
    colors: { link: hexLink, text: hexText, light: hexLight },
    getHover: function () { return hovered },
    setHover: setHover,
    setDragging: function (v) { dragging = v },
    getTransform: function () { return transform },
    setTransform: function (t) { transform = t },
  })
}
// === wireInteractionsAndLoop(s) -> cleanup fn ===
function wireInteractionsAndLoop(s) {
  var PIXI = s.PIXI
  var d3 = s.d3
  var app = s.app
  var stage = s.stage
  var nodes = s.nodes
  var nodeGfx = s.nodeGfx
  var linkGfx = s.linkGfx
  var sim = s.sim
  var o = s.o
  var radiusOf = s.radiusOf
  var width = s.width
  var height = s.height
  var cx = width / 2
  var cy = height / 2

  var DRAG_THRESHOLD = 4 // px in screen space; below this a pointerup is a click, not a drag
  var stopped = false
  var introStart = null

  // --- drag (with click-vs-drag discrimination) ---
  if (o.enableDrag) {
    var pickNode = function (event) {
      var T = s.getTransform()
      var px = (event.x - T.x) / T.k - cx
      var py = (event.y - T.y) / T.k - cy
      var best = null
      var bestDist = Infinity
      for (var i = 0; i < nodes.length; i++) {
        var n = nodes[i]
        var dx = px - n.x
        var dy = py - n.y
        var dist = Math.sqrt(dx * dx + dy * dy)
        var rr = radiusOf(n) + 4
        if (dist < rr && dist < bestDist) { best = n; bestDist = dist }
      }
      return best
    }

    var dragBehavior = d3
      .drag()
      .container(app.canvas)
      .subject(pickNode)
      .on("start", function (event) {
        if (!event.subject) return
        s.setDragging(true)
        event.subject.__downX = event.x
        event.subject.__downY = event.y
        event.subject.__moved = false
        if (!event.active) sim.alphaTarget(0.3).restart()
        event.subject.fx = event.subject.x
        event.subject.fy = event.subject.y
        s.setHover(event.subject.id)
      })
      .on("drag", function (event) {
        if (!event.subject) return
        var dx = event.x - event.subject.__downX
        var dy = event.y - event.subject.__downY
        if (Math.sqrt(dx * dx + dy * dy) > DRAG_THRESHOLD) event.subject.__moved = true
        var T = s.getTransform()
        event.subject.fx = (event.x - T.x) / T.k - cx
        event.subject.fy = (event.y - T.y) / T.k - cy
      })
      .on("end", function (event) {
        if (!event.subject) return
        if (!event.active) sim.alphaTarget(0)
        event.subject.fx = null
        event.subject.fy = null
        s.setDragging(false)
        // Only navigate when the pointer barely moved — fixes accidental jumps.
        if (!event.subject.__moved) {
          window.location.href = urlForSlug(event.subject.id)
        } else {
          s.setHover(null)
        }
      })
    d3.select(app.canvas).call(dragBehavior)
  } else {
    for (var ci = 0; ci < nodeGfx.length; ci++) {
      ;(function (rec) {
        rec.gfx.on("click", function () {
          window.location.href = urlForSlug(rec.node.id)
        })
      })(nodeGfx[ci])
    }
  }

  // --- zoom ---
  if (o.enableZoom) {
    var zoomBehavior = d3
      .zoom()
      .extent([[0, 0], [width, height]])
      .scaleExtent([0.25, 4])
      .on("zoom", function (event) {
        s.setTransform(event.transform)
      })
    d3.select(app.canvas).call(zoomBehavior)
    d3.select(app.canvas).call(zoomBehavior.transform, d3.zoomIdentity.scale(o.baseScale))
  } else {
    s.setTransform(d3.zoomIdentity.scale(o.baseScale))
  }

  // --- per-frame render loop ---
  function lerp(a, b, t) { return a + (b - a) * t }

  function frame(now) {
    if (stopped) return
    if (introStart === null) introStart = now
    var intro = Math.min(1, (now - introStart) / 400)
    var T = s.getTransform()
    stage.scale.set(T.k, T.k)
    stage.position.set(T.x, T.y)

    var hover = s.getHover()
    var zoomLabelAlpha = Math.max(0, (T.k * o.opacityScale - 1) / 3.75)

    // nodes
    for (var i = 0; i < nodeGfx.length; i++) {
      var rec = nodeGfx[i]
      rec.focus = lerp(rec.focus, rec.targetFocus, 0.18)
      var n = rec.node
      if (n.x == null) continue
      rec.gfx.position.set(n.x + cx, n.y + cy)
      rec.gfx.scale.set(intro)
      rec.gfx.alpha = (o.focusOnHover && hover !== null ? rec.focus : 1) * intro

      // label: visible on hover (this node + neighbors) or when zoomed in
      rec.label.position.set(n.x + cx, n.y + cy + rec.radius + 1.5)
      rec.label.scale.set(1 / T.k)
      var hoveredLabel = hover !== null && rec.targetFocus >= 0.9
      var targetLabelAlpha = hoveredLabel ? o.textOpacity : zoomLabelAlpha * o.textOpacity
      rec.label.alpha = lerp(rec.label.alpha, Math.min(targetLabelAlpha, 1) * intro, 0.2)
    }

    // links
    for (var j = 0; j < linkGfx.length; j++) {
      var lr = linkGfx[j]
      lr.focus = lerp(lr.focus, lr.targetFocus, 0.18)
      var L = lr.link
      var sx = L.source.x, sy = L.source.y, tx = L.target.x, ty = L.target.y
      if (sx == null || tx == null) continue
      var g = lr.gfx
      g.clear()
      var baseAlpha = hover !== null ? 0.15 + 0.85 * lr.focus : 0.6
      g.moveTo(sx + cx, sy + cy)
      g.lineTo(tx + cx, ty + cy)
      if (o.showArrows) {
        var ang = Math.atan2(ty - sy, tx - sx)
        var size = 4 + o.linkWidth * 2
        var ex = tx + cx, ey = ty + cy
        g.moveTo(ex, ey)
        g.lineTo(ex - size * Math.cos(ang - Math.PI / 7), ey - size * Math.sin(ang - Math.PI / 7))
        g.moveTo(ex, ey)
        g.lineTo(ex - size * Math.cos(ang + Math.PI / 7), ey - size * Math.sin(ang + Math.PI / 7))
      }
      var color = lr.focus > 0.5 ? s.colors.text : s.colors.link
      g.stroke({ width: o.linkWidth, color: color, alpha: baseAlpha * intro })
    }

    requestAnimationFrame(frame)
  }

  sim.alpha(1).restart()
  requestAnimationFrame(frame)

  return function cleanup() {
    stopped = true
    try { sim.stop() } catch (e) {}
    try { app.destroy(true) } catch (e) {}
  }
}
// === orchestration: wire nav/render events, global modal, single render path ===
var currentRenderEpoch = 0
var fetchData = (typeof fetchData !== "undefined" && fetchData) || (window.fetchData)

function startGraphRuntime() {
  var localCleanups = []
  var globalCleanups = []

  function clearLocal() {
    for (var i = 0; i < localCleanups.length; i++) {
      try { localCleanups[i]() } catch (e) {}
    }
    localCleanups = []
  }
  function clearGlobal() {
    for (var i = 0; i < globalCleanups.length; i++) {
      try { globalCleanups[i]() } catch (e) {}
    }
    globalCleanups = []
  }

  function renderLocal() {
    clearLocal()
    var epoch = ++currentRenderEpoch
    var slug = currentSlug()
    markVisited(simplifySlug(slug))
    var containers = document.querySelectorAll(".graph-container")
    for (var i = 0; i < containers.length; i++) {
      ;(function (el) {
        el.dataset.epoch = String(epoch)
        renderGraph(el, slug, epoch)
          .then(function (cleanup) {
            if (epoch === currentRenderEpoch) localCleanups.push(cleanup)
            else cleanup()
          })
          .catch(function (err) { console.error("[Graph] Local render error:", err) })
      })(containers[i])
    }
  }

  // --- global graph modal ---
  var globalOuters = []
  var iconHandler = null
  var clickAwayHandler = null
  var keyHandler = null

  function isGlobalOpen() {
    for (var i = 0; i < globalOuters.length; i++) {
      if (globalOuters[i].classList.contains("active")) return true
    }
    return false
  }
  function closeGlobal() {
    clearGlobal()
    for (var i = 0; i < globalOuters.length; i++) {
      globalOuters[i].classList.remove("active")
      var sb = globalOuters[i].closest(".sidebar")
      if (sb) sb.style.zIndex = ""
    }
  }
  function openGlobal() {
    clearGlobal()
    var slug = currentSlug()
    for (var i = 0; i < globalOuters.length; i++) {
      var outer = globalOuters[i]
      outer.classList.add("active")
      var sb = outer.closest(".sidebar")
      if (sb) sb.style.zIndex = "1"
      var gc = outer.querySelector(".global-graph-container")
      if (gc) {
        ;(function (el) {
          renderGraph(el, slug, undefined)
            .then(function (cleanup) { globalCleanups.push(cleanup) })
            .catch(function (err) { console.error("[Graph] Global render error:", err) })
        })(gc)
      }
    }
  }
  function toggleGlobal() {
    isGlobalOpen() ? closeGlobal() : openGlobal()
  }

  function onNav(ev) {
    var slug = ev && ev.detail ? ev.detail.url : currentSlug()
    markVisited(simplifySlug(slug))
    renderLocal()

    globalOuters = Array.from(document.querySelectorAll(".global-graph-outer"))
    var icons = Array.from(document.querySelectorAll(".global-graph-icon"))
    if (iconHandler) {
      for (var i = 0; i < icons.length; i++) icons[i].removeEventListener("click", iconHandler)
    }
    iconHandler = function () { toggleGlobal() }
    for (var j = 0; j < icons.length; j++) icons[j].addEventListener("click", iconHandler)

    if (clickAwayHandler) document.removeEventListener("click", clickAwayHandler)
    clickAwayHandler = function (e) {
      if (!isGlobalOpen()) return
      if (
        !e.target.closest(".global-graph-container") &&
        !e.target.closest(".global-graph-icon") &&
        !e.target.closest(".graph-settings-panel")
      ) closeGlobal()
    }
    document.addEventListener("click", clickAwayHandler)

    if (keyHandler) document.removeEventListener("keydown", keyHandler)
    keyHandler = function (e) {
      if (e.key === "Escape" && isGlobalOpen()) { closeGlobal(); return }
      if (e.key === "g" && (e.ctrlKey || e.metaKey) && !e.shiftKey) {
        e.preventDefault()
        toggleGlobal()
      }
    }
    document.addEventListener("keydown", keyHandler)
  }

  // Re-render in place when settings or theme change (no nav).
  document.addEventListener("graphrefresh", function () {
    renderLocal()
    if (isGlobalOpen()) openGlobal()
  })
  document.addEventListener("themechange", function () {
    renderLocal()
    if (isGlobalOpen()) openGlobal()
  })

  document.addEventListener("prenav", function () {
    clearLocal()
    clearGlobal()
  })
  document.addEventListener("nav", onNav)

  // initial paint
  onNav({ detail: { url: currentSlug() } })
}

// Boot once the self-hosted libs are ready.
if (window.__graphLibsReady) {
  startGraphRuntime()
} else {
  document.addEventListener("graphlibsready", startGraphRuntime, { once: true })
}
