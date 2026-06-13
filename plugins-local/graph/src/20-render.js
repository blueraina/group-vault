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
  var linkOpacity = cfg.linkOpacity != null ? cfg.linkOpacity : 1
  var showArrows = !!cfg.showArrows
  var textOpacity = cfg.textOpacity != null ? cfg.textOpacity : 1
  var alwaysShowLabels = !!cfg.alwaysShowLabels
  var linkStrengthCfg = cfg.linkStrength || 1
  var centerCurrentNode = !!cfg.centerCurrentNode
  var hideOrphans = !!cfg.hideOrphans
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

  if (hideOrphans && depth < 0) {
    var connected = new Set()
    for (var ci = 0; ci < allLinks.length; ci++) {
      connected.add(allLinks[ci].source)
      connected.add(allLinks[ci].target)
    }
    present = new Set(Array.from(present).filter(function (id) { return connected.has(id) }))
    tagNodes = tagNodes.filter(function (id) { return connected.has(id) })
    allLinks = allLinks.filter(function (link) {
      return (present.has(link.source) || tagNodes.indexOf(link.source) !== -1) &&
        (present.has(link.target) || tagNodes.indexOf(link.target) !== -1)
    })
  }

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
      x: centerCurrentNode && id === slug ? 0 : (Math.cos(visibleIds.size + nodes.length) * width) / 4,
      y: centerCurrentNode && id === slug ? 0 : (Math.sin(visibleIds.size + nodes.length) * height) / 4,
    }
    if (centerCurrentNode && id === slug) {
      node.fx = 0
      node.fy = 0
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
  function baseRadiusOf(node) {
    return 2 + Math.sqrt(degree.get(node.id) || 0)
  }
  function radiusOf(node) {
    return baseRadiusOf(node) * nodeSizeFactor
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
    baseRadiusOf: baseRadiusOf,
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
      nodeSize: nodeSizeFactor,
      linkWidth: linkWidth,
      linkOpacity: linkOpacity,
      showArrows: showArrows,
      textOpacity: textOpacity,
      alwaysShowLabels: alwaysShowLabels,
      linkStrength: linkStrengthCfg,
      centerCurrentNode: centerCurrentNode,
      focusOnHover: focusOnHover,
    },
  })
}
