// === orchestration: wire nav/render events, global modal, single render path ===
var currentRenderEpoch = 0

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
  function applyStoredSettings() {
    if (typeof window.__graphApplySettings === "function") {
      try { window.__graphApplySettings() } catch (e) { console.warn("[Graph] Settings sync failed:", e) }
    }
  }

  function renderLocal() {
    clearLocal()
    var epoch = ++currentRenderEpoch
    var slug = currentSlug()
    markVisited(simplifySlug(slug))
    applyStoredSettings()
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
    applyStoredSettings()
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
