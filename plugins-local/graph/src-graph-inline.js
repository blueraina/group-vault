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
