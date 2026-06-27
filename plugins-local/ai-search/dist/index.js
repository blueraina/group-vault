import { h } from "preact"

const styles = `.ai-note-search {
  min-width: fit-content;
}

.ai-note-search-trigger {
  appearance: none;
  background-color: transparent;
  border: 1px var(--lightgray) solid;
  border-radius: 4px;
  color: var(--gray);
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.35rem;
  font: inherit;
  height: 2rem;
  padding: 0 0.55rem;
  white-space: nowrap;
}

.ai-note-search-trigger:hover,
.ai-note-search-trigger:focus-visible {
  border-color: var(--secondary);
  color: var(--dark);
  outline: none;
}

.ai-note-search-trigger svg {
  width: 18px;
  min-width: 18px;
  stroke: var(--darkgray);
  stroke-width: 1.7;
}

.ai-note-search-trigger span {
  font-weight: 600;
  letter-spacing: 0;
}

.ai-note-search-overlay {
  position: fixed;
  inset: 0;
  z-index: var(--search-z-index, 999);
  display: none;
  overflow-y: auto;
  background: color-mix(in srgb, var(--light) 78%, transparent);
  backdrop-filter: blur(4px);
}

.ai-note-search-overlay.active {
  display: block;
}

.ai-note-search-panel {
  box-sizing: border-box;
  width: min(92vw, 760px);
  margin: 12vh auto 8vh;
  border: 1px solid var(--lightgray);
  border-radius: 7px;
  background: var(--light);
  color: var(--dark);
  box-shadow:
    0 14px 50px rgba(27, 33, 48, 0.12),
    0 10px 30px rgba(27, 33, 48, 0.16);
}

.ai-note-search-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding: 0.85rem 1rem;
  border-bottom: 1px solid var(--lightgray);
}

.ai-note-search-header h2 {
  margin: 0;
  color: var(--dark);
  font-size: 1.05rem;
  letter-spacing: 0;
}

.ai-note-search-close {
  appearance: none;
  width: 2rem;
  height: 2rem;
  border: 1px solid transparent;
  border-radius: 4px;
  background: transparent;
  color: var(--darkgray);
  cursor: pointer;
  font: inherit;
  line-height: 1;
}

.ai-note-search-close:hover,
.ai-note-search-close:focus-visible {
  border-color: var(--lightgray);
  color: var(--dark);
  outline: none;
}

.ai-note-search-form {
  padding: 1rem;
}

.ai-note-search-input {
  box-sizing: border-box;
  width: 100%;
  min-height: 5.5rem;
  resize: vertical;
  border: 1px solid var(--lightgray);
  border-radius: 6px;
  background: var(--light);
  color: var(--dark);
  font: inherit;
  line-height: 1.45;
  padding: 0.65rem 0.75rem;
}

.ai-note-search-input:focus {
  border-color: var(--secondary);
  outline: none;
}

.ai-note-search-scope {
  margin-top: 0.75rem;
  border: 1px solid var(--lightgray);
  border-radius: 6px;
  padding: 0.6rem 0.7rem;
}

.ai-note-search-scope-summary {
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  color: var(--dark);
  font-weight: 700;
  list-style: none;
}

.ai-note-search-scope-summary::-webkit-details-marker {
  display: none;
}

.ai-note-search-scope-count {
  color: var(--gray);
  font-size: 0.86rem;
  font-weight: 500;
  white-space: nowrap;
}

.ai-note-search-scope-body {
  display: grid;
  gap: 0.55rem;
  margin-top: 0.65rem;
}

.ai-note-search-scope-all {
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  color: var(--dark);
  font-size: 0.92rem;
}

.ai-note-search-folder-tree {
  display: grid;
  gap: 0.28rem;
  max-height: 12rem;
  overflow: auto;
  border-top: 1px solid var(--lightgray);
  padding-top: 0.55rem;
}

.ai-note-search-folder-tree[hidden] {
  display: none;
}

.ai-note-search-folder-item {
  display: flex;
  align-items: center;
  gap: 0.45rem;
  min-width: 0;
  color: var(--darkgray);
  font-size: 0.9rem;
}

.ai-note-search-folder-name {
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.ai-note-search-folder-count {
  color: var(--gray);
  font-size: 0.78rem;
  margin-left: auto;
}

.ai-note-search-folder-empty {
  color: var(--gray);
  font-size: 0.9rem;
}

.ai-note-search-actions {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  margin-top: 0.75rem;
}

.ai-note-search-status {
  min-height: 1.4rem;
  color: var(--gray);
  font-size: 0.92rem;
}

.ai-note-search-status.error {
  color: var(--secondary);
}

.ai-note-search-submit {
  appearance: none;
  border: 1px solid var(--secondary);
  border-radius: 4px;
  background: var(--secondary);
  color: var(--light);
  cursor: pointer;
  font: inherit;
  min-height: 2.15rem;
  padding: 0.35rem 0.8rem;
  white-space: nowrap;
}

.ai-note-search-submit:disabled {
  cursor: wait;
  opacity: 0.7;
}

.ai-note-search-results {
  display: none;
  border-top: 1px solid var(--lightgray);
  padding: 1rem;
}

.ai-note-search-results.active {
  display: block;
}

.ai-note-search-answer {
  margin: 0 0 0.9rem;
  color: var(--dark);
  line-height: 1.55;
}

.ai-note-search-list {
  display: grid;
  gap: 0.65rem;
  margin: 0;
  padding: 0;
  list-style: none;
}

.ai-note-search-item {
  border: 1px solid var(--lightgray);
  border-radius: 6px;
  padding: 0.75rem;
}

.ai-note-search-item-head {
  display: flex;
  align-items: baseline;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.ai-note-search-level {
  border-radius: 4px;
  background: var(--highlight);
  color: var(--secondary);
  font-size: 0.78rem;
  font-weight: 700;
  line-height: 1.3;
  padding: 0.12rem 0.35rem;
}

.ai-note-search-link {
  color: var(--secondary);
  font-weight: 700;
  text-decoration: none;
}

.ai-note-search-link:hover {
  text-decoration: underline;
}

.ai-note-search-reason {
  margin: 0.45rem 0 0;
  color: var(--gray);
  font-size: 0.94rem;
  line-height: 1.45;
}

.ai-note-search-location {
  margin: 0.45rem 0 0;
  color: var(--dark);
  font-size: 0.92rem;
  line-height: 1.4;
}

.ai-note-search-excerpt {
  margin: 0.45rem 0 0;
  border-left: 2px solid var(--lightgray);
  color: var(--darkgray);
  font-size: 0.9rem;
  line-height: 1.45;
  padding-left: 0.65rem;
}

.ai-note-search-math-display {
  display: block;
  overflow-x: auto;
  overflow-y: hidden;
  padding: 0.2rem 0;
}

.ai-note-search-math-fallback {
  font-family: var(--codeFont);
  font-size: 0.92em;
  white-space: normal;
}

.ai-note-search-login {
  color: var(--secondary);
  font-weight: 700;
}

@media (max-width: 800px) {
  .ai-note-search-trigger {
    padding: 0 0.6rem;
  }

  .ai-note-search-trigger span {
    display: none;
  }

  .ai-note-search-panel {
    width: min(94vw, 760px);
    margin-top: 8vh;
  }

  .ai-note-search-actions {
    align-items: stretch;
    flex-direction: column;
  }

  .ai-note-search-submit {
    width: 100%;
  }
}`

const script = `(() => {
  const scriptVersion = "2026-06-27-ai-scope-search"
  const bootKey = "__groupVaultAiSearchBootVersion"
  const latestRequestKey = "__groupVaultAiSearchLatestRequest"

  if (window[bootKey] === scriptVersion) return
  window[bootKey] = scriptVersion

  const lastResultKey = "group-vault.ai-note-search.last-result"
  const scopeSelectionKey = "group-vault.ai-note-search.scope"
  const katexState = { promise: null }
  const scopeFolderState = { promise: null, folders: [] }

  function currentReturnTo() {
    return window.location.pathname + window.location.search + window.location.hash
  }

  function loginUrl() {
    return "/api/auth/github?returnTo=" + encodeURIComponent(currentReturnTo())
  }

  function readJson(response) {
    return response.text().then(function (text) {
      if (!text) return {}
      try {
        return JSON.parse(text)
      } catch {
        return {}
      }
    })
  }

  function clear(node) {
    while (node.firstChild) node.removeChild(node.firstChild)
  }

  function ensureKatex(src) {
    if (!src || window.katex) return Promise.resolve()
    if (katexState.promise) return katexState.promise
    katexState.promise = new Promise(function (resolve) {
      const existing = document.querySelector('script[data-ai-search-katex="true"]')
      if (existing) {
        existing.addEventListener("load", function () { resolve() }, { once: true })
        existing.addEventListener("error", function () { resolve() }, { once: true })
        return
      }
      const script = document.createElement("script")
      script.src = src
      script.defer = true
      script.dataset.aiSearchKatex = "true"
      script.onload = function () { resolve() }
      script.onerror = function () { resolve() }
      document.head.append(script)
    })
    return katexState.promise
  }

  function isEscaped(value, index) {
    let count = 0
    for (let i = index - 1; i >= 0 && value[i] === "\\\\"; i -= 1) count += 1
    return count % 2 === 1
  }

  function findDelimiter(value, delimiter, start) {
    let index = value.indexOf(delimiter, start)
    while (index !== -1) {
      if (!isEscaped(value, index)) return index
      index = value.indexOf(delimiter, index + delimiter.length)
    }
    return -1
  }

  function findNextMath(value, start) {
    const delimiters = [
      { open: "$$", close: "$$", display: true },
      { open: "\\\\[", close: "\\\\]", display: true },
      { open: "\\\\(", close: "\\\\)", display: false },
      { open: "$", close: "$", display: false },
    ]
    let best = null

    for (const delimiter of delimiters) {
      const openIndex = findDelimiter(value, delimiter.open, start)
      if (openIndex === -1) continue
      if (
        delimiter.open === "$" &&
        (value[openIndex - 1] === "$" || value[openIndex + 1] === "$")
      ) {
        continue
      }
      const contentStart = openIndex + delimiter.open.length
      const closeIndex = findDelimiter(value, delimiter.close, contentStart)
      if (closeIndex === -1) continue
      if (
        delimiter.close === "$" &&
        (value[closeIndex - 1] === "$" || value[closeIndex + 1] === "$")
      ) {
        continue
      }
      if (!best || openIndex < best.openIndex) {
        best = { ...delimiter, openIndex, contentStart, closeIndex }
      }
    }

    return best
  }

  function appendPlainTextWithBreaks(node, value) {
    const parts = String(value || "").split("\\n")
    for (let i = 0; i < parts.length; i += 1) {
      if (i > 0) node.appendChild(document.createElement("br"))
      if (parts[i]) node.appendChild(document.createTextNode(parts[i]))
    }
  }

  function appendMath(node, tex, displayMode) {
    const wrapper = document.createElement(displayMode ? "div" : "span")
    wrapper.className = displayMode
      ? "ai-note-search-math ai-note-search-math-display"
      : "ai-note-search-math"

    if (window.katex) {
      try {
        window.katex.render(String(tex || "").trim(), wrapper, {
          displayMode: Boolean(displayMode),
          throwOnError: false,
          strict: "ignore",
          output: "html",
        })
        node.appendChild(wrapper)
        return
      } catch {}
    }

    wrapper.classList.add("ai-note-search-math-fallback")
    wrapper.textContent = displayMode ? "$$" + tex + "$$" : "$" + tex + "$"
    node.appendChild(wrapper)
  }

  function appendMathText(node, value) {
    const text = String(value || "")
    let cursor = 0

    while (cursor < text.length) {
      const token = findNextMath(text, cursor)
      if (!token) break
      appendPlainTextWithBreaks(node, text.slice(cursor, token.openIndex))
      appendMath(node, text.slice(token.contentStart, token.closeIndex), token.display)
      cursor = token.closeIndex + token.close.length
    }

    appendPlainTextWithBreaks(node, text.slice(cursor))
  }

  function storedItems(items) {
    if (!Array.isArray(items)) return []
    return items.slice(0, 8).map(function (item) {
      return {
        title: String(item && item.title ? item.title : ""),
        url: String(item && item.url ? item.url : ""),
        reason: String(item && item.reason ? item.reason : ""),
        locationHint: String(item && item.locationHint ? item.locationHint : ""),
        relevantExcerpt: String(item && item.relevantExcerpt ? item.relevantExcerpt : ""),
        level: String(item && item.level ? item.level : ""),
      }
    })
  }

  function storedSources(sources) {
    if (!Array.isArray(sources)) return []
    return sources.slice(0, 30).map(function (source) {
      return {
        title: String(source && source.title ? source.title : ""),
        url: String(source && source.url ? source.url : ""),
        score: Number(source && source.score ? source.score : 0),
      }
    })
  }

  function saveLastResult(query, data) {
    try {
      const payload = {
        query: String(query || "").slice(0, 500),
        savedAt: Date.now(),
        data: {
          answer: String(data && data.answer ? data.answer : ""),
          items: storedItems(data && data.items),
          sources: storedSources(data && data.sources),
        },
      }
      window.sessionStorage.setItem(lastResultKey, JSON.stringify(payload))
    } catch {}
  }

  function readLastResult() {
    try {
      const raw = window.sessionStorage.getItem(lastResultKey)
      if (!raw) return null
      const payload = JSON.parse(raw)
      if (!payload || typeof payload !== "object" || !payload.data) return null
      return payload
    } catch {
      return null
    }
  }

  function normalizeScopePath(value) {
    let path = String(value || "").trim()
    try {
      path = decodeURIComponent(path)
    } catch {}
    path = path
      .split("\\\\")
      .join("/")
      .replace(/^\\/+/u, "")
      .replace(/\\/+/gu, "/")
      .replace(/\\.md$/iu, "")
      .replace(/\\.html$/iu, "")
      .replace(/\\/index$/iu, "")
      .replace(/\\/+$/u, "")
    return path === "index" ? "" : path
  }

  function notePath(note) {
    return normalizeScopePath(
      (note && (note.relativePath || note.noteId || note.slug || note.url)) || "",
    )
  }

  function folderPrefixesForNote(note) {
    const path = notePath(note)
    if (!path) return []
    const parts = path.split("/").filter(Boolean)
    if (parts.length <= 1) return []
    const folders = []
    for (let depth = 1; depth < parts.length && depth <= 3; depth += 1) {
      folders.push(parts.slice(0, depth).join("/"))
    }
    return folders
  }

  function loadScopeFolders() {
    if (scopeFolderState.promise) return scopeFolderState.promise
    scopeFolderState.promise = fetch("/static/ai-search-index.json", {
      headers: { Accept: "application/json" },
    })
      .then(function (response) {
        if (!response.ok) throw new Error("index unavailable")
        return response.json()
      })
      .then(function (index) {
        const folders = new Map()
        const notes = Array.isArray(index && index.notes) ? index.notes : []
        for (const note of notes) {
          for (const prefix of folderPrefixesForNote(note)) {
            if (!folders.has(prefix)) {
              const parts = prefix.split("/")
              folders.set(prefix, {
                path: prefix,
                name: parts[parts.length - 1],
                depth: parts.length,
                count: 0,
              })
            }
            folders.get(prefix).count += 1
          }
        }
        scopeFolderState.folders = Array.from(folders.values()).sort(function (a, b) {
          return a.path.localeCompare(b.path, "zh-Hans", { numeric: true })
        })
        return scopeFolderState.folders
      })
      .catch(function () {
        scopeFolderState.folders = []
        return []
      })
    return scopeFolderState.promise
  }

  function readScopeSelection() {
    try {
      const raw = window.localStorage.getItem(scopeSelectionKey)
      if (!raw) return { all: true, folders: [] }
      const parsed = JSON.parse(raw)
      if (!parsed || typeof parsed !== "object") return { all: true, folders: [] }
      const folders = Array.isArray(parsed && parsed.folders)
        ? parsed.folders.map(normalizeScopePath).filter(Boolean)
        : []
      return { all: parsed.all !== false, folders: reduceFolderPrefixes(folders) }
    } catch {
      return { all: true, folders: [] }
    }
  }

  function reduceFolderPrefixes(folders) {
    const unique = Array.from(new Set((folders || []).map(normalizeScopePath).filter(Boolean)))
    unique.sort(function (a, b) {
      return a.length - b.length || a.localeCompare(b, "zh-Hans", { numeric: true })
    })
    return unique.filter(function (prefix, index) {
      for (let i = 0; i < index; i += 1) {
        const parent = unique[i]
        if (prefix === parent || prefix.indexOf(parent + "/") === 0) return false
      }
      return true
    })
  }

  function saveScopeSelection(selection) {
    try {
      window.localStorage.setItem(scopeSelectionKey, JSON.stringify(selection))
    } catch {}
  }

  function selectedFolderPrefixes(root) {
    const all = root.querySelector(".ai-note-search-scope-all-input")
    if (!all || all.checked) return []
    const checked = Array.from(root.querySelectorAll(".ai-note-search-folder-input:checked"))
    return reduceFolderPrefixes(checked.map(function (input) {
      return input.dataset.folderPrefix
    }))
  }

  function updateScopeSummary(root) {
    const all = root.querySelector(".ai-note-search-scope-all-input")
    const tree = root.querySelector(".ai-note-search-folder-tree")
    const count = root.querySelector(".ai-note-search-scope-count")
    if (!all || !tree || !count) return

    const folders = selectedFolderPrefixes(root)
    tree.hidden = all.checked
    count.textContent = all.checked ? "全部笔记" : folders.length > 0 ? "已选 " + folders.length + " 个文件夹" : "未选择"
  }

  function storeScopeFromDom(root) {
    const all = root.querySelector(".ai-note-search-scope-all-input")
    const selection = {
      all: !all || all.checked,
      folders: selectedFolderPrefixes(root),
    }
    saveScopeSelection(selection)
    updateScopeSummary(root)
  }

  function renderFolderTree(root, folders) {
    const tree = root.querySelector(".ai-note-search-folder-tree")
    if (!tree) return
    const selection = readScopeSelection()
    const selected = new Set(selection.folders)
    clear(tree)

    if (folders.length === 0) {
      const empty = document.createElement("div")
      empty.className = "ai-note-search-folder-empty"
      empty.textContent = "暂时无法读取文件夹列表。"
      tree.appendChild(empty)
      updateScopeSummary(root)
      return
    }

    for (const folder of folders) {
      const label = document.createElement("label")
      label.className = "ai-note-search-folder-item"
      label.style.paddingLeft = String((folder.depth - 1) * 0.85) + "rem"

      const input = document.createElement("input")
      input.className = "ai-note-search-folder-input"
      input.type = "checkbox"
      input.dataset.folderPrefix = folder.path
      input.checked = selected.has(folder.path)
      input.addEventListener("change", function () {
        storeScopeFromDom(root)
      })

      const name = document.createElement("span")
      name.className = "ai-note-search-folder-name"
      name.textContent = folder.name
      name.title = folder.path

      const count = document.createElement("span")
      count.className = "ai-note-search-folder-count"
      count.textContent = String(folder.count)

      label.appendChild(input)
      label.appendChild(name)
      label.appendChild(count)
      tree.appendChild(label)
    }

    updateScopeSummary(root)
  }

  function setupScopeControls(root) {
    const all = root.querySelector(".ai-note-search-scope-all-input")
    const tree = root.querySelector(".ai-note-search-folder-tree")
    if (!all || !tree) return

    const selection = readScopeSelection()
    all.checked = selection.all
    tree.hidden = all.checked
    if (!tree.dataset.loaded) {
      tree.dataset.loaded = "true"
      tree.textContent = "正在读取文件夹..."
      loadScopeFolders().then(function (folders) {
        renderFolderTree(root, folders)
      })
    } else {
      renderFolderTree(root, scopeFolderState.folders)
    }

    all.addEventListener("change", function () {
      storeScopeFromDom(root)
    })
    updateScopeSummary(root)
  }

  function setStatus(root, message, type) {
    const status = root.querySelector(".ai-note-search-status")
    if (!status) return
    clear(status)
    status.classList.toggle("error", type === "error")
    status.textContent = message || ""
  }

  function showLogin(status) {
    clear(status)
    status.classList.add("error")
    status.appendChild(document.createTextNode("请先登录 GitHub。"))
    const link = document.createElement("a")
    link.className = "ai-note-search-login"
    link.href = loginUrl()
    link.textContent = "去登录"
    status.appendChild(link)
  }

  function errorMessage(response, data) {
    if (response.status === 401) return "请先登录 GitHub 后再使用 AI 找笔记。"
    if (data && data.code === "AI_SEARCH_DISABLED") return "AI 搜索未启用。"
    if (data && data.code === "MODEL_NOT_CONFIGURED") return "模型未配置，请检查 Cloudflare 环境变量。"
    if (data && data.code === "INDEX_NOT_FOUND") return "AI 搜索索引不存在，请先构建索引。"
    if (data && data.code === "INDEX_DISABLED") return "AI 搜索索引未启用或为空。"
    if (data && data.code === "SCOPE_EMPTY") return "选择的检索范围内没有可用笔记。"
    if (data && data.code === "RATE_LIMITED") return "请求太频繁，请稍后再试。"
    if (data && data.error) return String(data.error)
    return "网络失败或后端暂时不可用。"
  }

  function renderResults(root, data, options) {
    const results = root.querySelector(".ai-note-search-results")
    if (!results) return
    clear(results)
    results.classList.add("active")

    const answer = document.createElement("div")
    answer.className = "ai-note-search-answer"
    appendMathText(answer, data.answer || "没有找到合适笔记。")
    results.appendChild(answer)

    const items = Array.isArray(data.items) ? data.items : []
    if (items.length === 0) {
      setStatus(root, "没有找到合适笔记。", "error")
      return
    }

    const list = document.createElement("ol")
    list.className = "ai-note-search-list"

    for (const item of items) {
      const li = document.createElement("li")
      li.className = "ai-note-search-item"

      const head = document.createElement("div")
      head.className = "ai-note-search-item-head"

      const level = document.createElement("span")
      level.className = "ai-note-search-level"
      level.textContent = item.level || "推荐"
      head.appendChild(level)

      const link = document.createElement("a")
      link.className = "ai-note-search-link"
      link.href = item.url || "#"
      link.textContent = item.title || item.url || "未命名笔记"
      head.appendChild(link)

      const reason = document.createElement("div")
      reason.className = "ai-note-search-reason"
      appendMathText(reason, item.reason || "这篇笔记与当前学习目标较接近。")

      li.appendChild(head)
      if (item.locationHint) {
        const location = document.createElement("div")
        location.className = "ai-note-search-location"
        appendMathText(location, "相关内容：" + item.locationHint)
        li.appendChild(location)
      }
      li.appendChild(reason)
      if (item.relevantExcerpt) {
        const excerpt = document.createElement("div")
        excerpt.className = "ai-note-search-excerpt"
        appendMathText(excerpt, "相关片段：" + item.relevantExcerpt)
        li.appendChild(excerpt)
      }
      list.appendChild(li)
    }

    results.appendChild(list)

    if ((!options || !options.skipKatexRefresh) && !window.katex) {
      ensureKatex("/static/katex.min.js").then(function () {
        if (window.katex) renderResults(root, data, { skipKatexRefresh: true })
      })
    }
  }

  function restoreLastResult(root, input) {
    const payload = readLastResult()
    if (!payload) return

    if (!input.value && payload.query) input.value = String(payload.query)
    setStatus(root, "", "")
    renderResults(root, payload.data)
  }

  function setupRoot(root) {
    if (root.dataset.aiSearchManaged === scriptVersion) return

    const previousInput = root.querySelector(".ai-note-search-input")
    const previousQuery = previousInput ? previousInput.value : ""
    const wasOpen = root.querySelector(".ai-note-search-overlay")?.classList.contains("active")
    const freshRoot = root.cloneNode(true)
    root.replaceWith(freshRoot)
    root = freshRoot
    root.dataset.aiSearchBound = "true"
    root.dataset.aiSearchManaged = scriptVersion

    const trigger = root.querySelector(".ai-note-search-trigger")
    const overlay = root.querySelector(".ai-note-search-overlay")
    const close = root.querySelector(".ai-note-search-close")
    const form = root.querySelector(".ai-note-search-form")
    const input = root.querySelector(".ai-note-search-input")
    const submit = root.querySelector(".ai-note-search-submit")
    const status = root.querySelector(".ai-note-search-status")
    const results = root.querySelector(".ai-note-search-results")
    if (!trigger || !overlay || !close || !form || !input || !submit || !status || !results) return

    let inFlight = false
    let requestSeq = 0
    let activeController = null

    if (previousQuery) input.value = previousQuery
    setupScopeControls(root)
    restoreLastResult(root, input)
    if (wasOpen) {
      overlay.classList.add("active")
      trigger.setAttribute("aria-expanded", "true")
    }

    function open() {
      overlay.classList.add("active")
      trigger.setAttribute("aria-expanded", "true")
      window.setTimeout(function () {
        input.focus()
      }, 0)
    }

    function hide() {
      overlay.classList.remove("active")
      trigger.setAttribute("aria-expanded", "false")
      trigger.focus()
    }

    trigger.addEventListener("click", function () {
      open()
    })

    close.addEventListener("click", function () {
      hide()
    })

    overlay.addEventListener("click", function (event) {
      if (event.target === overlay) hide()
    })

    overlay.addEventListener("keydown", function (event) {
      if (event.key === "Escape") {
        event.preventDefault()
        hide()
      }
    })

    results.addEventListener("click", function (event) {
      const link = event.target.closest(".ai-note-search-link")
      if (link) hide()
    })

    input.addEventListener("input", function () {
      if (inFlight) return
      if (results.classList.contains("active")) {
        results.classList.remove("active")
        clear(results)
      }
      setStatus(root, "", "")
    })

    form.addEventListener("submit", async function (event) {
      event.preventDefault()
      if (inFlight) return

      const query = input.value.trim()
      if (query.length < 2) {
        setStatus(root, "请输入更具体的学习目标。", "error")
        input.focus()
        return
      }
      if (query.length > 500) {
        setStatus(root, "问题不能超过 500 个字符。", "error")
        input.focus()
        return
      }
      const allScope = root.querySelector(".ai-note-search-scope-all-input")
      const folderPrefixes = selectedFolderPrefixes(root)
      if (allScope && !allScope.checked && folderPrefixes.length === 0) {
        setStatus(root, "请选择至少一个文件夹，或勾选全部笔记。", "error")
        return
      }

      inFlight = true
      requestSeq += 1
      const requestId = requestSeq
      window[latestRequestKey] = (Number(window[latestRequestKey]) || 0) + 1
      const globalRequestId = window[latestRequestKey]
      activeController = new AbortController()
      submit.disabled = true
      results.classList.remove("active")
      clear(results)
      setStatus(root, "正在检索笔记...", "loading")

      try {
        const response = await fetch("/api/ai-search", {
          method: "POST",
          headers: { "content-type": "application/json" },
          credentials: "same-origin",
          signal: activeController.signal,
          body: JSON.stringify({ query: query, folderPrefixes: folderPrefixes }),
        })
        const data = await readJson(response)
        if (requestId !== requestSeq) return
        if (globalRequestId !== window[latestRequestKey]) return

        if (!response.ok) {
          if (response.status === 401) {
            showLogin(status)
          } else {
            setStatus(root, errorMessage(response, data), "error")
          }
          return
        }

        setStatus(root, "", "")
        renderResults(root, data)
        saveLastResult(query, data)
      } catch (error) {
        if (error && error.name === "AbortError") return
        if (requestId !== requestSeq) return
        if (globalRequestId !== window[latestRequestKey]) return
        setStatus(root, "网络失败或后端暂时不可用。", "error")
      } finally {
        if (requestId === requestSeq) {
          inFlight = false
          submit.disabled = false
          activeController = null
        }
      }
    })
  }

  function setup() {
    document.querySelectorAll(".ai-note-search").forEach(setupRoot)
  }

  document.addEventListener("nav", setup)
  document.addEventListener("render", setup)
})()`

const icon = h(
  "svg",
  {
    role: "img",
    xmlns: "http://www.w3.org/2000/svg",
    viewBox: "0 0 24 24",
    fill: "none",
    "aria-hidden": "true",
  },
  [
    h("path", {
      d: "M12 3l1.7 4.8L18.5 9.5l-4.8 1.7L12 16l-1.7-4.8L5.5 9.5l4.8-1.7L12 3z",
      "stroke-linejoin": "round",
    }),
    h("path", {
      d: "M19 14l.8 2.2L22 17l-2.2.8L19 20l-.8-2.2L16 17l2.2-.8L19 14z",
      "stroke-linejoin": "round",
    }),
  ],
)

const AISearchComponent = ({ displayClass }) =>
  h("div", { class: [displayClass, "ai-note-search"].filter(Boolean).join(" ") }, [
    h(
      "button",
      {
        class: "ai-note-search-trigger",
        type: "button",
        "aria-label": "AI 找笔记",
        "aria-haspopup": "dialog",
        "aria-expanded": "false",
        title: "AI 找笔记",
      },
      [icon, h("span", null, "AI")],
    ),
    h(
      "div",
      {
        class: "ai-note-search-overlay",
        role: "dialog",
        "aria-modal": "true",
        "aria-label": "AI 找笔记",
      },
      h("section", { class: "ai-note-search-panel" }, [
        h("header", { class: "ai-note-search-header" }, [
          h("h2", null, "AI 找笔记"),
          h(
            "button",
            {
              class: "ai-note-search-close",
              type: "button",
              "aria-label": "关闭",
              title: "关闭",
            },
            "×",
          ),
        ]),
        h("form", { class: "ai-note-search-form" }, [
          h("textarea", {
            class: "ai-note-search-input",
            name: "query",
            maxlength: "500",
            minlength: "2",
            placeholder: "例如：我想学习一下同时对角化的内容，我该看哪些笔记？",
            "aria-label": "学习目标",
          }),
          h("details", { class: "ai-note-search-scope" }, [
            h("summary", { class: "ai-note-search-scope-summary" }, [
              h("span", null, "检索范围"),
              h("span", { class: "ai-note-search-scope-count" }, "全部笔记"),
            ]),
            h("div", { class: "ai-note-search-scope-body" }, [
              h("label", { class: "ai-note-search-scope-all" }, [
                h("input", {
                  class: "ai-note-search-scope-all-input",
                  type: "checkbox",
                  checked: true,
                }),
                h("span", null, "全部笔记"),
              ]),
              h(
                "div",
                {
                  class: "ai-note-search-folder-tree",
                  "aria-label": "选择检索文件夹",
                  hidden: true,
                },
                "正在读取文件夹...",
              ),
            ]),
          ]),
          h("div", { class: "ai-note-search-actions" }, [
            h("div", { class: "ai-note-search-status", role: "status", "aria-live": "polite" }),
            h(
              "button",
              {
                class: "ai-note-search-submit",
                type: "submit",
              },
              "生成报告",
            ),
          ]),
        ]),
        h("div", { class: "ai-note-search-results", "aria-live": "polite" }),
      ]),
    ),
  ])

AISearchComponent.afterDOMLoaded = script
AISearchComponent.css = styles

export const AISearch = () => AISearchComponent

export default AISearch
