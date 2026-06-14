// === Graph settings panel (Chinese UI). Builds local + global control panels,
// persists to localStorage, and asks the graph runtime to re-render only when a
// setting actually changes.
;(function () {
  var storageKeys = { local: "graph-settings-local", global: "graph-settings" }
  var globalPanelStateKey = "graph-settings-global-panel-open"
  var fallback = {
    depth: 1,
    showNeighborLinks: true,
    neighborLinkDepth: 1,
    showArrows: false,
    textOpacity: 1,
    fontSize: 0.75,
    nodeSize: 1,
    linkWidth: 1,
    linkOpacity: 1,
    centerForce: 0.3,
    repelForce: 0.5,
    linkStrength: 1,
    linkDistance: 30,
    hideOrphans: false,
    hiddenTags: [],
  }
  var liveKeys = {
    showArrows: true,
    textOpacity: true,
    fontSize: true,
    nodeSize: true,
    linkWidth: true,
    linkOpacity: true,
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
        { key: "showNeighborLinks", label: "其他节点间连接", type: "checkbox", scopes: ["local"] },
        {
          key: "neighborLinkDepth",
          label: "其他节点链接深度",
          min: 0,
          max: 4,
          step: 1,
          scopes: ["local"],
        },
        { key: "hideOrphans", label: "隐藏孤立文件", type: "checkbox", scopes: ["global"] },
      ],
    },
    {
      title: "过滤",
      controls: [{ key: "hiddenTags", label: "隐藏标签", type: "tag-list", scopes: ["global"] }],
    },
    {
      title: "外观",
      controls: [
        { key: "showArrows", label: "箭头", type: "checkbox" },
        { key: "textOpacity", label: "文本透明度", min: 0, max: 1.4, step: 0.05 },
        { key: "fontSize", label: "字体大小", min: 0.6, max: 1.5, step: 0.05 },
        { key: "nodeSize", label: "节点大小", min: 0.6, max: 2.2, step: 0.1 },
        { key: "linkWidth", label: "连线粗细", min: 0.5, max: 4, step: 0.25 },
        { key: "linkOpacity", label: "连线透明度", min: 0.2, max: 1.5, step: 0.05 },
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
  var tagState = { promise: null, tags: [] }

  function readJson(v) {
    try {
      return JSON.parse(v || "{}")
    } catch (e) {
      return {}
    }
  }
  function selectorFor(scope) {
    return scope === "local" ? ".graph-container" : ".global-graph-container"
  }
  function normalizeTag(tag) {
    return String(tag || "")
      .trim()
      .replace(/^#+/, "")
  }
  function uniqueTagList(value) {
    if (!Array.isArray(value)) return []
    var seen = new Set()
    var tags = []
    for (var i = 0; i < value.length; i++) {
      var tag = normalizeTag(value[i])
      if (!tag || seen.has(tag)) continue
      seen.add(tag)
      tags.push(tag)
    }
    return tags
  }
  function collectAvailableTags() {
    if (tagState.promise) return tagState.promise
    if (typeof fetchData === "undefined") {
      tagState.promise = Promise.resolve([])
      return tagState.promise
    }
    tagState.promise = Promise.resolve(fetchData)
      .then(function (raw) {
        var seen = new Set()
        var tags = []
        for (var key in raw) {
          var entryTags = (raw[key] && raw[key].tags) || []
          for (var i = 0; i < entryTags.length; i++) {
            var tag = normalizeTag(entryTags[i])
            if (!tag || seen.has(tag)) continue
            seen.add(tag)
            tags.push(tag)
          }
        }
        tags.sort(function (a, b) {
          return a.localeCompare(b, "zh-Hans")
        })
        tagState.tags = tags
        return tags
      })
      .catch(function (e) {
        console.warn("[Graph] Unable to collect tags:", e)
        tagState.tags = []
        return []
      })
    return tagState.promise
  }
  function clampValue(def, value) {
    if (def.type === "checkbox") return !!value
    if (def.type === "tag-list") return uniqueTagList(value)
    var num = Number(value)
    if (!Number.isFinite(num)) num = fallback[def.key]
    if (def.min != null) num = Math.max(def.min, num)
    if (def.max != null) num = Math.min(def.max, num)
    return num
  }
  function controlVisible(scope, def) {
    return !def.scopes || def.scopes.indexOf(scope) !== -1
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
    return normalizeValues(
      scope,
      Object.assign({}, fallback, readJson(el && (el.dataset.baseCfg || el.dataset.cfg))),
    )
  }
  function stored(scope) {
    return readJson(localStorage.getItem(storageKeys[scope]))
  }
  function settings(scope) {
    return normalizeValues(scope, Object.assign({}, baseCfg(scope), stored(scope)))
  }
  function displayValue(def, value) {
    if (def.type === "checkbox") return value ? "开" : "关"
    if (def.type === "tag-list") return uniqueTagList(value).length + " 个"
    return Number(value)
      .toFixed(def.step < 1 ? 2 : 0)
      .replace(/\.00$/g, "")
  }
  function syncControls(scope, values) {
    sections.forEach(function (section) {
      section.controls.forEach(function (def) {
        if (!controlVisible(scope, def)) return
        var selectedTags = def.type === "tag-list" ? new Set(uniqueTagList(values[def.key])) : null
        document
          .querySelectorAll(
            '[data-graph-scope="' + scope + '"] [data-graph-setting="' + def.key + '"]',
          )
          .forEach(function (input) {
            if (def.type === "checkbox") input.checked = !!values[def.key]
            else if (def.type === "tag-list")
              input.checked = selectedTags.has(normalizeTag(input.dataset.graphTag))
            else input.value = values[def.key]
          })
        document
          .querySelectorAll(
            '[data-graph-scope="' + scope + '"] [data-graph-setting-value="' + def.key + '"]',
          )
          .forEach(function (out) {
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
  function requestRender() {
    document.dispatchEvent(new CustomEvent("graphrefresh"))
  }
  function requestLiveUpdate(scope, values) {
    document.querySelectorAll(selectorFor(scope)).forEach(function (el) {
      el.dispatchEvent(new CustomEvent("graphsettingschange", { detail: { values: values } }))
    })
  }
  function saveValue(scope, key, value) {
    var next = stored(scope)
    next[key] = value
    localStorage.setItem(storageKeys[scope], JSON.stringify(next))
    return applySettings(scope)
  }
  function saveSetting(scope, def, input) {
    var value = def.type === "checkbox" ? input.checked : Number(input.value)
    var values = saveValue(scope, def.key, value)
    if (liveKeys[def.key]) requestLiveUpdate(scope, values)
    else requestRender()
  }
  function saveTagSelection(scope, def, list) {
    var next = []
    list.querySelectorAll('[data-graph-setting="' + def.key + '"]').forEach(function (input) {
      if (input.checked) next.push(normalizeTag(input.dataset.graphTag))
    })
    saveValue(scope, def.key, uniqueTagList(next))
    requestRender()
  }
  function makeControl(scope, def, values) {
    if (def.type === "tag-list") return makeTagControl(scope, def, values)
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
      input.addEventListener("change", function () {
        saveSetting(scope, def, input)
      })
    } else {
      input.type = "range"
      input.min = String(def.min)
      input.max = String(def.max)
      input.step = String(def.step)
      input.value = String(values[def.key])
      input.addEventListener("input", function () {
        saveSetting(scope, def, input)
      })
    }
    row.appendChild(input)
    return row
  }
  function makeTagControl(scope, def, values) {
    var row = document.createElement("div")
    row.className = "graph-setting-row graph-tag-filter"
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

    var list = document.createElement("div")
    list.className = "graph-tag-filter-list"
    list.style.display = "grid"
    list.style.gap = "0.35rem"
    list.style.maxHeight = "11rem"
    list.style.overflowY = "auto"
    list.style.padding = "0.35rem 0.1rem 0.1rem"
    list.style.marginTop = "0.2rem"
    var loading = document.createElement("span")
    loading.className = "graph-tag-filter-empty"
    loading.textContent = "正在读取标签..."
    list.appendChild(loading)
    row.appendChild(list)

    collectAvailableTags().then(function () {
      renderTagList(row, scope, def)
    })
    return row
  }
  function renderTagList(row, scope, def) {
    var list = row.querySelector(".graph-tag-filter-list")
    if (!list) return
    list.textContent = ""
    var values = settings(scope)
    var selected = new Set(uniqueTagList(values[def.key]))
    if (tagState.tags.length === 0) {
      var empty = document.createElement("span")
      empty.className = "graph-tag-filter-empty"
      empty.textContent = "没有可隐藏的标签"
      list.appendChild(empty)
      syncControls(scope, values)
      return
    }
    tagState.tags.forEach(function (tag) {
      var label = document.createElement("label")
      label.className = "graph-tag-filter-item"
      label.style.display = "flex"
      label.style.alignItems = "center"
      label.style.gap = "0.45rem"
      label.style.minWidth = "0"

      var input = document.createElement("input")
      input.type = "checkbox"
      input.dataset.graphSetting = def.key
      input.dataset.graphTag = tag
      input.checked = selected.has(tag)
      input.addEventListener("change", function () {
        saveTagSelection(scope, def, list)
      })

      var text = document.createElement("span")
      text.textContent = "#" + tag
      text.style.overflow = "hidden"
      text.style.textOverflow = "ellipsis"
      text.style.whiteSpace = "nowrap"

      label.appendChild(input)
      label.appendChild(text)
      list.appendChild(label)
    })
    syncControls(scope, values)
  }
  function appendControls(panel, scope, values) {
    sections.forEach(function (section) {
      var visibleControls = section.controls.filter(function (def) {
        return controlVisible(scope, def)
      })
      if (visibleControls.length === 0) return
      var details = document.createElement("details")
      details.className = "graph-settings-section"
      details.open = true
      var summary = document.createElement("summary")
      summary.textContent = section.title
      details.appendChild(summary)
      visibleControls.forEach(function (def) {
        details.appendChild(makeControl(scope, def, values))
      })
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
  function globalPanelOpen() {
    try {
      return localStorage.getItem(globalPanelStateKey) === "true"
    } catch (e) {
      return false
    }
  }
  function setGlobalPanelOpen(outer, open) {
    try {
      localStorage.setItem(globalPanelStateKey, open ? "true" : "false")
    } catch (e) {}
    syncGlobalPanelVisibility(outer, open)
  }
  function syncGlobalPanelVisibility(outer, open) {
    var panel = outer.querySelector(".graph-settings-panel-global")
    var toggle = outer.querySelector(".graph-settings-toggle")
    if (panel) {
      panel.hidden = !open
      panel.setAttribute("aria-hidden", open ? "false" : "true")
    }
    if (toggle) {
      toggle.setAttribute("aria-expanded", open ? "true" : "false")
      toggle.textContent = open ? "收起设置" : "图谱设置"
    }
  }
  function makeGlobalToggle(outer) {
    var toggle = document.createElement("button")
    toggle.type = "button"
    toggle.className = "graph-settings-toggle"
    toggle.setAttribute("aria-controls", "graph-settings-panel-global")
    toggle.style.position = "fixed"
    toggle.style.top = "max(1rem, 3vh)"
    toggle.style.right = "max(1rem, 3vw)"
    toggle.style.zIndex = "10001"
    toggle.style.padding = "0.45rem 0.7rem"
    toggle.style.border = "1px solid var(--lightgray)"
    toggle.style.borderRadius = "8px"
    toggle.style.background = "var(--light)"
    toggle.style.color = "var(--dark)"
    toggle.style.boxShadow = "0 12px 30px rgba(0, 0, 0, 0.16)"
    toggle.style.cursor = "pointer"
    toggle.addEventListener("click", function (e) {
      e.preventDefault()
      e.stopPropagation()
      setGlobalPanelOpen(outer, !globalPanelOpen())
    })
    return toggle
  }
  function buildGlobalPanels() {
    var values = settings("global")
    document.querySelectorAll(".global-graph-outer").forEach(function (outer) {
      if (!outer.querySelector(".graph-settings-toggle")) outer.appendChild(makeGlobalToggle(outer))
      if (!outer.querySelector(".graph-settings-panel-global")) {
        var panel = document.createElement("aside")
        panel.id = "graph-settings-panel-global"
        panel.className = "graph-settings-panel graph-settings-panel-global"
        panel.dataset.graphScope = "global"
        panel.setAttribute("aria-label", "全局图谱设置")
        panel.addEventListener("click", function (e) {
          e.stopPropagation()
        })

        var header = document.createElement("div")
        header.className = "graph-settings-header"
        header.style.display = "flex"
        header.style.alignItems = "center"
        header.style.justifyContent = "space-between"
        header.style.gap = "0.75rem"
        var title = document.createElement("div")
        title.className = "graph-settings-title"
        title.textContent = "图谱设置"
        var close = document.createElement("button")
        close.type = "button"
        close.className = "graph-settings-close"
        close.setAttribute("aria-label", "收起图谱设置")
        close.textContent = "×"
        close.style.border = "0"
        close.style.background = "transparent"
        close.style.color = "inherit"
        close.style.cursor = "pointer"
        close.style.fontSize = "1.2rem"
        close.style.lineHeight = "1"
        close.addEventListener("click", function (e) {
          e.preventDefault()
          e.stopPropagation()
          setGlobalPanelOpen(outer, false)
        })
        header.appendChild(title)
        header.appendChild(close)
        panel.appendChild(header)
        appendControls(panel, "global", values)
        outer.appendChild(panel)
      }
      syncGlobalPanelVisibility(outer, globalPanelOpen())
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
  function init() {
    buildGlobalPanels()
    buildLocalPanels()
    applySettings("global")
    applySettings("local")
  }
  window.__graphApplySettings = init
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init)
  } else {
    init()
  }
  document.addEventListener("nav", init)
})()
