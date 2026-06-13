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
  var baseRadiusOf = ctx.baseRadiusOf || function (node) {
    return ctx.radiusOf(node) / Math.max(o.nodeSize || 1, 0.01)
  }
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
  function currentRadiusOf(node) {
    return baseRadiusOf(node) * (o.nodeSize || 1)
  }
  function centerForceStrength() {
    return Math.max(0, Math.min(1, o.centerForce || 0))
  }
  function radialForceStrength() {
    return Math.max(0, o.centerForce || 0) * 0.08
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
    .force("center", d3.forceCenter(0, 0).strength(centerForceStrength()))
    .force("radial", d3.forceRadial(0, 0, 0).strength(radialForceStrength()))
    .force("link", d3.forceLink(links).distance(o.linkDistance).strength(o.linkStrength))
    .force("collide", d3.forceCollide().radius(function (n) { return currentRadiusOf(n) + 4 }).iterations(2))
    .velocityDecay(0.35)
    .alphaDecay(0.02)

  // visual records
  var nodeGfx = []
  var linkGfx = []
  var hovered = null
  var dragging = false
  var transform = d3.zoomIdentity
  var introT = 0 // 0..1 fade-in
  var settleTimer = null

  function drawNode(rec) {
    var r = currentRadiusOf(rec.node)
    rec.radius = r
    rec.gfx.clear()
    rec.gfx.circle(0, 0, r)
    rec.gfx.fill({ color: rec.baseColor })
    if (rec.node.isTag) rec.gfx.stroke({ width: 1.5, color: hexVisited })
  }

  function applyForces() {
    sim.force("charge").strength(-80 * o.repelForce)
    sim.force("center").strength(centerForceStrength())
    sim.force("radial").strength(radialForceStrength())
    sim.force("link").distance(o.linkDistance).strength(o.linkStrength)
    sim.force("collide").radius(function (n) { return currentRadiusOf(n) + 4 })
  }

  function reheatSimulation() {
    if (settleTimer) clearTimeout(settleTimer)
    sim.alphaTarget(0.24).restart()
    settleTimer = setTimeout(function () {
      sim.alphaTarget(0)
      settleTimer = null
    }, 260)
  }

  for (var ni = 0; ni < nodes.length; ni++) {
    var node = nodes[ni]
    var r = currentRadiusOf(node)
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
    gfx.eventMode = "static"
    gfx.cursor = "pointer"
    gfx.__id = node.id
    nodeLayer.addChild(gfx)

    var rec = { node: node, gfx: gfx, label: label, radius: r, baseColor: fill, focus: 0, targetFocus: 1 }
    drawNode(rec)
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

  function applyLiveSettings(values) {
    var forceChanged = false
    var sizeChanged = false
    var fontChanged = false
    var liveKeys = {
      showArrows: true,
      textOpacity: true,
      fontSize: true,
      nodeSize: true,
      linkWidth: true,
      centerForce: true,
      repelForce: true,
      linkStrength: true,
      linkDistance: true,
    }
    for (var key in liveKeys) {
      if (!Object.prototype.hasOwnProperty.call(values, key)) continue
      if (o[key] === values[key]) continue
      o[key] = values[key]
      if (key === "centerForce" || key === "repelForce" || key === "linkStrength" || key === "linkDistance") forceChanged = true
      if (key === "nodeSize") sizeChanged = true
      if (key === "fontSize") fontChanged = true
    }
    if (fontChanged) {
      for (var fi = 0; fi < nodeGfx.length; fi++) nodeGfx[fi].label.style.fontSize = o.fontSize * 16
    }
    if (sizeChanged) {
      for (var si = 0; si < nodeGfx.length; si++) drawNode(nodeGfx[si])
      forceChanged = true
    }
    if (forceChanged) {
      applyForces()
      reheatSimulation()
    }
  }

  function onGraphSettingsChange(event) {
    applyLiveSettings((event.detail && event.detail.values) || {})
  }
  container.addEventListener("graphsettingschange", onGraphSettingsChange)

  var cleanupLoop = wireInteractionsAndLoop({
    PIXI: PIXI, d3: d3, app: app, stage: stage, container: container,
    nodes: nodes, links: links, nodeGfx: nodeGfx, linkGfx: linkGfx,
    slug: slug, width: width, height: height, sim: sim, o: o,
    radiusOf: currentRadiusOf,
    colors: { link: hexLink, text: hexText, light: hexLight },
    getHover: function () { return hovered },
    setHover: setHover,
    setDragging: function (v) { dragging = v },
    getTransform: function () { return transform },
    setTransform: function (t) { transform = t },
  })

  return function cleanupScene() {
    container.removeEventListener("graphsettingschange", onGraphSettingsChange)
    if (settleTimer) clearTimeout(settleTimer)
    cleanupLoop()
  }
}
