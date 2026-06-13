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
