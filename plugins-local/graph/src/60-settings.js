// === Graph settings panel (Chinese UI). Builds local + global control panels,
// persists to localStorage, and asks the graph runtime to re-render ONLY when a
// setting actually changes (the runtime owns render-on-nav, avoiding double paints).
(function () {
  var storageKeys = { local: "graph-settings-local", global: "graph-settings" }
  var fallback = {
    depth: 1, showNeighborLinks: true, neighborLinkDepth: 1, showArrows: false,
    textOpacity: 1, fontSize: 0.75, nodeSize: 1, linkWidth: 1,
    centerForce: 0.3, repelForce: 0.5, linkStrength: 1, linkDistance: 30,
  }
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
  var sections = [
    {
      title: "范围",
      controls: [
        { key: "depth", label: "局部深度", min: 0, max: 4, step: 1, scopes: ["local"] },
        { key: "showNeighborLinks", label: "其他节点间链接", type: "checkbox", scopes: ["local"] },
        { key: "neighborLinkDepth", label: "其他节点链接深度", min: 0, max: 4, step: 1, scopes: ["local"] },
      ],
    },
    {
      title: "外观",
      controls: [
        { key: "showArrows", label: "箭头", type: "checkbox" },
        { key: "textOpacity", label: "文本透明度", min: 0, max: 1, step: 0.05 },
        { key: "fontSize", label: "字体大小", min: 0.6, max: 1.2, step: 0.05 },
        { key: "nodeSize", label: "节点大小", min: 0.6, max: 2.2, step: 0.1 },
        { key: "linkWidth", label: "连线粗细", min: 0.5, max: 4, step: 0.25 },
      ],
    },
    {
      title: "力度",
      controls: [
        { key: "centerForce", label: "图谱向心力", min: 0, max: 2, step: 0.05 },
        { key: "repelForce", label: "节点间的排斥力", min: 0.1, max: 2, step: 0.05 },
        { key: "linkStrength", label: "相连节点的吸引力", min: 0.05, max: 2, step: 0.05 },
        { key: "linkDistance", label: "连线长度", min: 10, max: 120, step: 5 },
      ],
    },
  ]
  function readJson(v) { try { return JSON.parse(v || "{}") } catch (e) { return {} } }
  function selectorFor(scope) { return scope === "local" ? ".graph-container" : ".global-graph-container" }
  function clampValue(def, value) {
    if (def.type === "checkbox") return !!value
    var num = Number(value)
    if (!Number.isFinite(num)) num = fallback[def.key]
    if (def.min != null) num = Math.max(def.min, num)
    if (def.max != null) num = Math.min(def.max, num)
    return num
  }
  function normalizeValues(scope, values) {
    sections.forEach(function (section) {
      section.controls.forEach(function (def) {
        if (!controlVisible(scope, def)) return
        if (values[def.key] != null) values[def.key] = clampValue(def, values[def.key])
      })
    })
    return values
  }
  function baseCfg(scope) {
    var el = document.querySelector(selectorFor(scope))
    return normalizeValues(scope, Object.assign({}, fallback, readJson(el && (el.dataset.baseCfg || el.dataset.cfg))))
  }
  function stored(scope) { return readJson(localStorage.getItem(storageKeys[scope])) }
  function settings(scope) { return normalizeValues(scope, Object.assign({}, baseCfg(scope), stored(scope))) }
  function displayValue(def, value) {
    if (def.type === "checkbox") return value ? "开" : "关"
    return Number(value).toFixed(def.step < 1 ? 2 : 0).replace(/\.00$/g, "")
  }
  function controlVisible(scope, def) { return !def.scopes || def.scopes.indexOf(scope) !== -1 }
  function syncControls(scope, values) {
    sections.forEach(function (section) {
      section.controls.forEach(function (def) {
        if (!controlVisible(scope, def)) return
        document.querySelectorAll('[data-graph-scope="' + scope + '"] [data-graph-setting="' + def.key + '"]').forEach(function (input) {
          if (def.type === "checkbox") input.checked = !!values[def.key]
          else input.value = values[def.key]
        })
        document.querySelectorAll('[data-graph-scope="' + scope + '"] [data-graph-setting-value="' + def.key + '"]').forEach(function (out) {
          out.textContent = displayValue(def, values[def.key])
        })
      })
    })
  }
  function applySettings(scope) {
    var values = settings(scope)
    document.querySelectorAll(selectorFor(scope)).forEach(function (el) {
      var base = readJson(el.dataset.baseCfg || el.dataset.cfg)
      if (!el.dataset.baseCfg) el.dataset.baseCfg = JSON.stringify(base)
      el.dataset.cfg = JSON.stringify(Object.assign({}, base, values))
    })
    syncControls(scope, values)
    return values
  }
  function requestRender() { document.dispatchEvent(new CustomEvent("graphrefresh")) }
  function requestLiveUpdate(scope, values) {
    document.querySelectorAll(selectorFor(scope)).forEach(function (el) {
      el.dispatchEvent(new CustomEvent("graphsettingschange", { detail: { values: values } }))
    })
  }
  function saveSetting(scope, def, input) {
    var next = stored(scope)
    next[def.key] = def.type === "checkbox" ? input.checked : Number(input.value)
    localStorage.setItem(storageKeys[scope], JSON.stringify(next))
    var values = applySettings(scope)
    if (liveKeys[def.key]) requestLiveUpdate(scope, values)
    else requestRender()
  }
  function makeControl(scope, def, values) {
    var row = document.createElement("label")
    row.className = "graph-setting-row"
    var top = document.createElement("span")
    top.className = "graph-setting-label"
    var name = document.createElement("span")
    name.textContent = def.label
    var value = document.createElement("span")
    value.className = "graph-setting-value"
    value.dataset.graphSettingValue = def.key
    top.appendChild(name)
    top.appendChild(value)
    row.appendChild(top)
    var input = document.createElement("input")
    input.dataset.graphSetting = def.key
    if (def.type === "checkbox") {
      input.type = "checkbox"
      input.checked = !!values[def.key]
      input.addEventListener("change", function () { saveSetting(scope, def, input) })
    } else {
      input.type = "range"
      input.min = String(def.min)
      input.max = String(def.max)
      input.step = String(def.step)
      input.value = String(values[def.key])
      input.addEventListener("input", function () { saveSetting(scope, def, input) })
    }
    row.appendChild(input)
    return row
  }
  function appendControls(panel, scope, values) {
    sections.forEach(function (section) {
      var visibleControls = section.controls.filter(function (def) { return controlVisible(scope, def) })
      if (visibleControls.length === 0) return
      var details = document.createElement("details")
      details.className = "graph-settings-section"
      details.open = true
      var summary = document.createElement("summary")
      summary.textContent = section.title
      details.appendChild(summary)
      visibleControls.forEach(function (def) { details.appendChild(makeControl(scope, def, values)) })
      panel.appendChild(details)
    })
    var reset = document.createElement("button")
    reset.type = "button"
    reset.className = "graph-settings-reset"
    reset.textContent = "重置设置"
    reset.addEventListener("click", function () {
      localStorage.removeItem(storageKeys[scope])
      applySettings(scope)
      requestRender()
    })
    panel.appendChild(reset)
  }
  function buildGlobalPanels() {
    var values = settings("global")
    document.querySelectorAll(".global-graph-outer").forEach(function (outer) {
      if (outer.querySelector(".graph-settings-panel-global")) return
      var panel = document.createElement("aside")
      panel.className = "graph-settings-panel graph-settings-panel-global"
      panel.dataset.graphScope = "global"
      panel.setAttribute("aria-label", "全局图谱设置")
      panel.addEventListener("click", function (e) { e.stopPropagation() })
      var title = document.createElement("div")
      title.className = "graph-settings-title"
      title.textContent = "图谱设置"
      panel.appendChild(title)
      appendControls(panel, "global", values)
      outer.appendChild(panel)
    })
    syncControls("global", values)
  }
  function buildLocalPanels() {
    var values = settings("local")
    document.querySelectorAll(".graph > .graph-outer").forEach(function (outer) {
      var host = outer.parentElement
      if (!host || host.querySelector(".graph-settings-panel-local")) return
      var panel = document.createElement("details")
      panel.className = "graph-settings-panel graph-settings-panel-local"
      panel.dataset.graphScope = "local"
      panel.setAttribute("aria-label", "局部图谱设置")
      var summary = document.createElement("summary")
      summary.className = "graph-settings-title"
      summary.textContent = "局部图谱设置"
      panel.appendChild(summary)
      appendControls(panel, "local", values)
      outer.insertAdjacentElement("afterend", panel)
    })
    syncControls("local", values)
  }
  // Build panels and seed each container's cfg. Never triggers a render itself —
  // the graph runtime renders on nav; user edits call requestRender().
  function init() {
    buildGlobalPanels()
    buildLocalPanels()
    applySettings("global")
    applySettings("local")
  }
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init)
  } else {
    init()
  }
  document.addEventListener("nav", function () { setTimeout(init, 0) })
})();
