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
  white-space: pre-line;
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
  const lastResultKey = "group-vault.ai-note-search.last-result"

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

  function storedItems(items) {
    if (!Array.isArray(items)) return []
    return items.slice(0, 8).map(function (item) {
      return {
        title: String(item && item.title ? item.title : ""),
        url: String(item && item.url ? item.url : ""),
        reason: String(item && item.reason ? item.reason : ""),
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
    if (data && data.code === "RATE_LIMITED") return "请求太频繁，请稍后再试。"
    if (data && data.error) return String(data.error)
    return "网络失败或后端暂时不可用。"
  }

  function renderResults(root, data) {
    const results = root.querySelector(".ai-note-search-results")
    if (!results) return
    clear(results)
    results.classList.add("active")

    const answer = document.createElement("p")
    answer.className = "ai-note-search-answer"
    answer.textContent = data.answer || "没有找到合适笔记。"
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

      const reason = document.createElement("p")
      reason.className = "ai-note-search-reason"
      reason.textContent = item.reason || "这篇笔记与当前学习目标较接近。"

      li.appendChild(head)
      li.appendChild(reason)
      list.appendChild(li)
    }

    results.appendChild(list)
  }

  function restoreLastResult(root, input) {
    const payload = readLastResult()
    if (!payload) return

    if (!input.value && payload.query) input.value = String(payload.query)
    setStatus(root, "", "")
    renderResults(root, payload.data)
  }

  function setupRoot(root) {
    if (root.dataset.aiSearchBound === "true") return
    root.dataset.aiSearchBound = "true"

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

    restoreLastResult(root, input)

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

      inFlight = true
      submit.disabled = true
      results.classList.remove("active")
      clear(results)
      setStatus(root, "正在检索笔记...", "loading")

      try {
        const response = await fetch("/api/ai-search", {
          method: "POST",
          headers: { "content-type": "application/json" },
          credentials: "same-origin",
          body: JSON.stringify({ query: query }),
        })
        const data = await readJson(response)

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
      } catch {
        setStatus(root, "网络失败或后端暂时不可用。", "error")
      } finally {
        inFlight = false
        submit.disabled = false
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
