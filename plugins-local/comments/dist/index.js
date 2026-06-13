import { h } from "preact"

const defaultOptions = {
  apiBase: "/api/comments",
  maxLength: 5000,
  katexScript: "/static/katex.min.js",
}

const cx = (...parts) => parts.filter(Boolean).join(" ")

const styles = `.note-comments {
  margin-top: 3rem;
  padding-top: 1.5rem;
  border-top: 1px solid var(--lightgray);
}

.note-comments-header {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 1rem;
  margin-bottom: 0.85rem;
}

.note-comments-title {
  margin: 0;
  font-size: 1.35rem;
}

.note-comments-subtitle {
  margin: 0;
  color: var(--gray);
  font-size: 0.92rem;
}

.note-comments-status {
  min-height: 1.35rem;
  margin: 0.4rem 0 0.8rem;
  color: var(--darkgray);
  font-size: 0.92rem;
}

.note-comments-list {
  display: grid;
  gap: 0.85rem;
  margin-bottom: 1.2rem;
}

.note-comment,
.note-comments-form {
  border: 1px solid var(--lightgray);
  border-radius: 8px;
  background: color-mix(in srgb, var(--light) 92%, transparent);
}

.note-comment {
  padding: 0.9rem 1rem;
}

.note-comment-header {
  display: flex;
  align-items: center;
  gap: 0.65rem;
  margin-bottom: 0.75rem;
}

.note-comment-avatar {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 2rem;
  height: 2rem;
  flex: 0 0 2rem;
  border-radius: 999px;
  background: hsl(var(--comment-avatar-hue, 200) 42% 48%);
  color: white;
  font-size: 0.92rem;
  font-weight: 700;
}

.note-comment-avatar-img,
.note-comments-auth-avatar {
  display: block;
  width: 2rem;
  height: 2rem;
  border-radius: 999px;
  object-fit: cover;
}

.note-comment-meta {
  display: grid;
  gap: 0.08rem;
  min-width: 0;
  flex: 1 1 auto;
}

.note-comment-author {
  color: var(--dark);
  font-weight: 700;
}

.note-comment-date {
  color: var(--gray);
  font-size: 0.85rem;
}

.note-comment-body {
  color: var(--dark);
  overflow-wrap: anywhere;
}

.note-comment-delete {
  appearance: none;
  border: 1px solid var(--lightgray);
  border-radius: 6px;
  background: transparent;
  color: var(--gray);
  cursor: pointer;
  font: inherit;
  font-size: 0.82rem;
  padding: 0.28rem 0.5rem;
}

.note-comment-delete:hover {
  border-color: #c2410c;
  color: #c2410c;
}

.note-comment-delete:disabled {
  cursor: not-allowed;
  opacity: 0.62;
}

.note-comment-body > :first-child,
.note-comments-preview > :first-child {
  margin-top: 0;
}

.note-comment-body > :last-child,
.note-comments-preview > :last-child {
  margin-bottom: 0;
}

.note-comment-body pre,
.note-comments-preview pre {
  overflow-x: auto;
  padding: 0.85rem;
  border-radius: 6px;
  background: color-mix(in srgb, var(--lightgray) 38%, transparent);
}

.note-comment-body blockquote,
.note-comments-preview blockquote {
  margin-left: 0;
  padding-left: 0.85rem;
  border-left: 3px solid var(--secondary);
  color: var(--darkgray);
}

.note-comment-body .katex-display,
.note-comments-preview .katex-display {
  overflow-x: auto;
  overflow-y: hidden;
  padding: 0.25rem 0;
}

.note-comments-empty {
  margin: 0;
  padding: 1rem;
  border: 1px dashed var(--lightgray);
  border-radius: 8px;
  color: var(--gray);
}

.note-comments-auth {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  margin-bottom: 0.85rem;
  padding: 0.75rem 0.85rem;
  border: 1px solid var(--lightgray);
  border-radius: 8px;
  background: color-mix(in srgb, var(--lightgray) 18%, transparent);
  color: var(--darkgray);
  font-size: 0.92rem;
}

.note-comments-auth-user,
.note-comments-auth-actions {
  display: inline-flex;
  align-items: center;
  gap: 0.55rem;
}

.note-comments-auth-user strong {
  color: var(--dark);
}

.note-comments-form {
  display: grid;
  gap: 0.75rem;
  padding: 1rem;
}

.note-comments-form.is-locked textarea {
  cursor: not-allowed;
}

.note-comments-field {
  display: grid;
  gap: 0.35rem;
  color: var(--darkgray);
  font-size: 0.92rem;
  font-weight: 700;
}

.note-comments-field input,
.note-comments-field textarea {
  width: 100%;
  box-sizing: border-box;
  border: 1px solid var(--lightgray);
  border-radius: 6px;
  background: var(--light);
  color: var(--dark);
  font: inherit;
}

.note-comments-field input {
  min-height: 2.3rem;
  padding: 0 0.65rem;
}

.note-comments-field textarea {
  min-height: 8rem;
  resize: vertical;
  padding: 0.65rem;
  line-height: 1.55;
}

.note-comments-field input:focus,
.note-comments-field textarea:focus {
  outline: 2px solid color-mix(in srgb, var(--secondary) 55%, transparent);
  outline-offset: 1px;
  border-color: var(--secondary);
}

.note-comments-toolbar {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
}

.note-comments-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.55rem;
}

.note-comments-preview-options {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  color: var(--gray);
  font-size: 0.86rem;
}

.note-comments-sync-preview {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  cursor: pointer;
  user-select: none;
}

.note-comments-sync-preview input {
  width: auto;
  accent-color: var(--secondary);
}

.note-comments-button {
  appearance: none;
  min-height: 2.2rem;
  border: 1px solid var(--lightgray);
  border-radius: 6px;
  background: var(--light);
  color: var(--dark);
  cursor: pointer;
  font: inherit;
  font-weight: 700;
  padding: 0.38rem 0.78rem;
}

a.note-comments-button {
  display: inline-flex;
  align-items: center;
  text-decoration: none;
}

.note-comments-button:hover {
  border-color: var(--secondary);
  color: var(--secondary);
}

.note-comments-button.primary {
  border-color: var(--secondary);
  background: var(--secondary);
  color: var(--light);
}

.note-comments-button.primary:hover {
  filter: brightness(1.05);
}

.note-comments-button:disabled {
  cursor: not-allowed;
  opacity: 0.62;
}

.note-comments-counter {
  color: var(--gray);
  font-size: 0.86rem;
}

.note-comments-preview {
  min-height: 4rem;
  padding: 0.85rem;
  border: 1px solid var(--lightgray);
  border-radius: 6px;
  background: color-mix(in srgb, var(--lightgray) 18%, transparent);
}

.note-comments-honeypot {
  position: absolute;
  left: -9999px;
  width: 1px;
  height: 1px;
  opacity: 0;
}

.note-comments-error {
  color: #c2410c;
}

@media (max-width: 700px) {
  .note-comments-header,
  .note-comments-toolbar {
    align-items: flex-start;
    flex-direction: column;
  }

  .note-comments-actions,
  .note-comments-button {
    width: 100%;
  }
}`

const script = String.raw`(() => {
  const katexState = { promise: null }
  const sessionState = { promise: null, user: null, authConfigured: null }
  const backtick = String.fromCharCode(96)

  function initComments() {
    document.querySelectorAll("[data-comments-root]").forEach((root) => {
      if (root.dataset.commentsReady === "true") return
      root.dataset.commentsReady = "true"
      wireRoot(root)
      refreshSession(root).finally(() => loadComments(root))
    })
  }

  function wireRoot(root) {
    const form = root.querySelector("[data-comments-form]")
    const textarea = root.querySelector("[data-comments-content]")
    const preview = root.querySelector("[data-comments-preview]")
    const syncPreview = root.querySelector("[data-comments-sync-preview]")
    const counter = root.querySelector("[data-comments-counter]")
    const list = root.querySelector("[data-comments-list]")
    const auth = root.querySelector("[data-comments-auth]")

    if (textarea && counter) {
      const updateCounter = () => {
        const max = Number(root.dataset.commentsMaxLength || "5000")
        counter.textContent = String(textarea.value.length) + " / " + String(max)
      }
      textarea.addEventListener("input", updateCounter)
      updateCounter()
    }

    async function updatePreview() {
      if (!preview || !textarea) return
      await ensureKatex(root.dataset.commentsKatex)
      preview.innerHTML = renderMarkdown(textarea.value.trim() || "还没有可预览的内容。")
      preview.removeAttribute("hidden")
    }

    if (syncPreview && preview && textarea) {
      syncPreview.addEventListener("change", async () => {
        if (syncPreview.checked) {
          await updatePreview()
        }
      })
      textarea.addEventListener("input", () => {
        if (syncPreview.checked) updatePreview()
      })
    }

    if (form) {
      form.addEventListener("submit", async (event) => {
        event.preventDefault()
        await submitComment(root, form)
      })
    }

    if (list) {
      list.addEventListener("click", async (event) => {
        const button = event.target?.closest?.("[data-comment-delete]")
        if (!button) return
        event.preventDefault()
        await deleteComment(root, button.dataset.commentDelete, button)
      })
    }

    if (auth) {
      auth.addEventListener("click", async (event) => {
        const button = event.target?.closest?.("[data-comments-logout]")
        if (!button) return
        event.preventDefault()
        button.setAttribute("disabled", "disabled")
        try {
          await fetch("/api/auth/logout", { method: "POST", headers: { Accept: "application/json" } })
        } finally {
          sessionState.user = null
          sessionState.promise = null
          applyAuth(root)
          await loadComments(root)
          document.dispatchEvent(new CustomEvent("authchange"))
          button.removeAttribute("disabled")
        }
      })
    }
  }

  function apiUrl(root) {
    return root.dataset.commentsApi || "/api/comments"
  }

  function commentPath(root) {
    return root.dataset.commentPath || "index"
  }

  function currentReturnTo() {
    return window.location.pathname + window.location.search + window.location.hash
  }

  function loginUrl() {
    return "/api/auth/github?returnTo=" + encodeURIComponent(currentReturnTo())
  }

  async function readResponse(response) {
    const text = await response.text().catch(() => "")
    if (!text) return {}
    try {
      return JSON.parse(text)
    } catch {
      return { error: text.trim() }
    }
  }

  function responseError(data, fallback, response) {
    const detail = data && data.error
      ? (typeof data.error === "string" ? data.error : JSON.stringify(data.error))
      : ""
    const prefix = response ? "HTTP " + String(response.status) : ""
    return [fallback, prefix, detail].filter(Boolean).join("：")
  }

  function friendlyError(message) {
    const value = String(message || "")
    if (value.includes("COMMENTS_DB")) return "评论数据库尚未完成部署配置，暂时不能加载或发布评论。"
    if (
      value.includes("GITHUB_CLIENT_ID") ||
      value.includes("GITHUB_CLIENT_SECRET") ||
      value.includes("SESSION_SECRET")
    ) {
      return "GitHub 登录尚未完成部署配置，暂时不能发表评论。"
    }
    return value
  }

  async function refreshSession(root) {
    if (!sessionState.promise) {
      sessionState.promise = fetch("/api/auth/session", { headers: { Accept: "application/json" } })
        .then(readResponse)
        .then((data) => {
          sessionState.authConfigured = data && data.authConfigured === false ? false : true
          sessionState.user = data && data.user ? data.user : null
          return sessionState.user
        })
        .catch(() => {
          sessionState.authConfigured = null
          sessionState.user = null
          return null
        })
    }

    await sessionState.promise
    applyAuth(root)
    return sessionState.user
  }

  function authAvatar(user) {
    if (user && user.avatarUrl) {
      return '<img class="note-comments-auth-avatar" src="' + escapeAttribute(user.avatarUrl) + '" alt="">'
    }
    const initial = (user && (user.name || user.login) ? (user.name || user.login) : "G").trim().slice(0, 1)
    return '<span class="note-comment-avatar">' + escapeHtml(initial) + "</span>"
  }

  function applyAuth(root) {
    const user = sessionState.user
    const auth = root.querySelector("[data-comments-auth]")
    const form = root.querySelector("[data-comments-form]")
    const textarea = root.querySelector("[data-comments-content]")
    const submitButton = form?.querySelector("[type='submit']")

    if (auth) {
      if (user) {
        auth.innerHTML =
          '<span class="note-comments-auth-user">' +
          authAvatar(user) +
          '<span>已用 GitHub 登录：<strong>' + escapeHtml(user.name || user.login) + "</strong></span>" +
          "</span>" +
          '<span class="note-comments-auth-actions">' +
          '<button class="note-comments-button" type="button" data-comments-logout>退出</button>' +
          "</span>"
      } else if (sessionState.authConfigured === false) {
        auth.innerHTML =
          '<span>GitHub 登录尚未完成部署配置，暂时不能发表评论。</span>' +
          '<span class="note-comments-auth-actions">' +
          '<button class="note-comments-button primary" type="button" disabled>GitHub 登录</button>' +
          "</span>"
      } else {
        auth.innerHTML =
          '<span>登录 GitHub 后可以发表评论，作者和管理员可以删除评论。</span>' +
          '<span class="note-comments-auth-actions">' +
          '<a class="note-comments-button primary" href="' + escapeAttribute(loginUrl()) + '">GitHub 登录</a>' +
          "</span>"
      }
    }

    form?.classList.toggle("is-locked", !user)
    if (textarea) textarea.disabled = !user
    if (submitButton) submitButton.disabled = !user
  }

  function setStatus(root, message, isError) {
    const status = root.querySelector("[data-comments-status]")
    if (!status) return
    status.textContent = message || ""
    status.classList.toggle("note-comments-error", Boolean(isError))
  }

  async function loadComments(root) {
    const list = root.querySelector("[data-comments-list]")
    if (!list) return

    setStatus(root, "正在加载评论...", false)
    try {
      await ensureKatex(root.dataset.commentsKatex)
      const url = apiUrl(root) + "?path=" + encodeURIComponent(commentPath(root))
      const response = await fetch(url, { headers: { Accept: "application/json" } })
      const data = await readResponse(response)

      if (!response.ok) {
        throw new Error(responseError(data, "评论加载失败", response))
      }

      if (Object.prototype.hasOwnProperty.call(data, "user")) {
        sessionState.user = data.user || null
        applyAuth(root)
      }
      renderCommentList(root, Array.isArray(data.comments) ? data.comments : [])
    } catch (error) {
      list.innerHTML = ""
      setStatus(root, friendlyError(error && error.message ? error.message : "评论加载失败"), true)
    }
  }

  function renderCommentList(root, comments) {
    const list = root.querySelector("[data-comments-list]")
    if (!list) return

    if (comments.length === 0) {
      list.innerHTML = '<p class="note-comments-empty">还没有评论，来写第一条吧。</p>'
      setStatus(root, "", false)
      return
    }

    list.innerHTML = ""
    comments.forEach((comment) => {
      const article = document.createElement("article")
      article.className = "note-comment"

      const hue = hashString(comment.author || "guest") % 360
      const initial = (comment.author || "匿").trim().slice(0, 1) || "匿"
      article.style.setProperty("--comment-avatar-hue", String(hue))

      const header = document.createElement("header")
      header.className = "note-comment-header"
      const avatar = document.createElement(comment.github_avatar_url ? "img" : "span")
      if (comment.github_avatar_url) {
        avatar.className = "note-comment-avatar-img"
        avatar.src = comment.github_avatar_url
        avatar.alt = ""
        avatar.loading = "lazy"
      } else {
        avatar.className = "note-comment-avatar"
        avatar.textContent = initial
      }

      const meta = document.createElement("span")
      meta.className = "note-comment-meta"
      meta.innerHTML =
        '<strong class="note-comment-author">' + escapeHtml(comment.author || "匿名") + '</strong>' +
        '<time class="note-comment-date" datetime="' + escapeAttribute(comment.created_at || "") + '">' +
        escapeHtml(formatDate(comment.created_at)) +
        "</time>"
      header.append(avatar, meta)

      if (comment.can_delete) {
        const deleteButton = document.createElement("button")
        deleteButton.className = "note-comment-delete"
        deleteButton.type = "button"
        deleteButton.dataset.commentDelete = comment.id || ""
        deleteButton.textContent = "删除"
        header.append(deleteButton)
      }

      const body = document.createElement("div")
      body.className = "note-comment-body"
      body.innerHTML = renderMarkdown(comment.content || "")

      article.append(header, body)
      list.append(article)
    })

    setStatus(root, String(comments.length) + " 条评论", false)
  }

  async function submitComment(root, form) {
    const submitButton = form.querySelector("[type='submit']")
    const content = (form.elements.content?.value || "").trim()
    const website = (form.elements.website?.value || "").trim()
    const max = Number(root.dataset.commentsMaxLength || "5000")

    if (form.dataset.commentsSubmitting === "true") return

    if (!sessionState.user) {
      await refreshSession(root)
    }
    if (sessionState.authConfigured === false) {
      setStatus(root, "GitHub 登录尚未完成部署配置，暂时不能发表评论。", true)
      return
    }
    if (!sessionState.user) {
      setStatus(root, "请先登录 GitHub 后再评论。", true)
      return
    }
    if (!content) {
      setStatus(root, "请先写评论内容。", true)
      return
    }
    if (content.length > max) {
      setStatus(root, "评论太长了，请控制在 " + String(max) + " 字以内。", true)
      return
    }

    form.dataset.commentsSubmitting = "true"
    submitButton?.setAttribute("disabled", "disabled")
    setStatus(root, "正在发布评论...", false)

    try {
      const idempotencyKey = crypto.randomUUID
        ? crypto.randomUUID()
        : String(Date.now()) + "-" + Math.random().toString(16).slice(2)
      const response = await fetch(apiUrl(root), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          path: commentPath(root),
          content,
          website,
          idempotencyKey,
        }),
      })
      const data = await readResponse(response)

      if (!response.ok) {
        throw new Error(responseError(data, "评论发布失败", response))
      }

      form.reset()
      const preview = root.querySelector("[data-comments-preview]")
      const syncPreview = root.querySelector("[data-comments-sync-preview]")
      if (preview) preview.innerHTML = ""
      preview?.setAttribute("hidden", "")
      if (syncPreview) syncPreview.checked = false
      await loadComments(root)
      setStatus(root, "评论已发布。", false)
    } catch (error) {
      setStatus(root, friendlyError(error && error.message ? error.message : "评论发布失败"), true)
    } finally {
      delete form.dataset.commentsSubmitting
      submitButton?.removeAttribute("disabled")
      if (!sessionState.user) submitButton?.setAttribute("disabled", "disabled")
      const counter = root.querySelector("[data-comments-counter]")
      if (counter) counter.textContent = "0 / " + String(max)
    }
  }

  async function deleteComment(root, id, button) {
    if (!id) return
    if (!window.confirm("确定删除这条评论吗？")) return

    button?.setAttribute("disabled", "disabled")
    setStatus(root, "正在删除评论...", false)
    try {
      const response = await fetch(apiUrl(root) + "?id=" + encodeURIComponent(id), {
        method: "DELETE",
        headers: { Accept: "application/json" },
      })
      const data = await readResponse(response)
      if (!response.ok) {
        throw new Error(responseError(data, "评论删除失败", response))
      }
      await loadComments(root)
      setStatus(root, "评论已删除。", false)
    } catch (error) {
      setStatus(root, friendlyError(error && error.message ? error.message : "评论删除失败"), true)
      button?.removeAttribute("disabled")
    }
  }

  function ensureKatex(src) {
    if (!src || window.katex) return Promise.resolve()
    if (katexState.promise) return katexState.promise
    katexState.promise = new Promise((resolve) => {
      const existing = document.querySelector('script[data-comments-katex="true"]')
      if (existing) {
        existing.addEventListener("load", () => resolve(), { once: true })
        existing.addEventListener("error", () => resolve(), { once: true })
        return
      }
      const script = document.createElement("script")
      script.src = src
      script.defer = true
      script.dataset.commentsKatex = "true"
      script.onload = () => resolve()
      script.onerror = () => resolve()
      document.head.append(script)
    })
    return katexState.promise
  }

  function renderMarkdown(markdown) {
    const lines = String(markdown || "").replace(/\r\n?/g, "\n").split("\n")
    const out = []
    let i = 0

    while (i < lines.length) {
      const line = lines[i]
      const trimmed = line.trim()

      if (!trimmed) {
        i += 1
        continue
      }

      if (trimmed.slice(0, 3) === backtick.repeat(3)) {
        const code = []
        i += 1
        while (i < lines.length && lines[i].trim().slice(0, 3) !== backtick.repeat(3)) {
          code.push(lines[i])
          i += 1
        }
        if (i < lines.length) i += 1
        out.push("<pre><code>" + escapeHtml(code.join("\n")) + "</code></pre>")
        continue
      }

      if (trimmed === "$$") {
        const math = []
        i += 1
        while (i < lines.length && lines[i].trim() !== "$$") {
          math.push(lines[i])
          i += 1
        }
        if (i < lines.length) i += 1
        out.push('<div class="comments-math-display">' + renderMath(math.join("\n"), true) + "</div>")
        continue
      }

      const heading = line.match(/^(#{1,6})\s+(.+)$/)
      if (heading) {
        const level = Math.min(6, Math.max(4, heading[1].length + 3))
        out.push("<h" + level + ">" + renderInline(heading[2]) + "</h" + level + ">")
        i += 1
        continue
      }

      if (/^\s*>\s?/.test(line)) {
        const quoted = []
        while (i < lines.length && /^\s*>\s?/.test(lines[i])) {
          quoted.push(lines[i].replace(/^\s*>\s?/, ""))
          i += 1
        }
        out.push("<blockquote>" + renderMarkdown(quoted.join("\n")) + "</blockquote>")
        continue
      }

      if (/^\s*[-*+]\s+/.test(line)) {
        const items = []
        while (i < lines.length && /^\s*[-*+]\s+/.test(lines[i])) {
          items.push("<li>" + renderInline(lines[i].replace(/^\s*[-*+]\s+/, "")) + "</li>")
          i += 1
        }
        out.push("<ul>" + items.join("") + "</ul>")
        continue
      }

      if (/^\s*\d+[.)]\s+/.test(line)) {
        const items = []
        while (i < lines.length && /^\s*\d+[.)]\s+/.test(lines[i])) {
          items.push("<li>" + renderInline(lines[i].replace(/^\s*\d+[.)]\s+/, "")) + "</li>")
          i += 1
        }
        out.push("<ol>" + items.join("") + "</ol>")
        continue
      }

      const paragraph = [line]
      i += 1
      while (
        i < lines.length &&
        lines[i].trim() &&
        lines[i].trim().slice(0, 3) !== backtick.repeat(3) &&
        lines[i].trim() !== "$$" &&
        !/^(#{1,6})\s+/.test(lines[i]) &&
        !/^\s*>\s?/.test(lines[i]) &&
        !/^\s*[-*+]\s+/.test(lines[i]) &&
        !/^\s*\d+[.)]\s+/.test(lines[i])
      ) {
        paragraph.push(lines[i])
        i += 1
      }
      out.push("<p>" + renderInline(paragraph.join("\n")) + "</p>")
    }

    return out.join("")
  }

  function renderInline(text) {
    const tokens = []
    const put = (html) => {
      const id = tokens.length
      tokens.push(html)
      return "\u0000" + String(id) + "\u0000"
    }
    const restore = (html) => html.replace(/\u0000(\d+)\u0000/g, (_, id) => tokens[Number(id)] || "")

    let value = String(text || "")
    const inlineCode = new RegExp(backtick + "([^" + backtick + "\\n]+)" + backtick, "g")
    value = value.replace(inlineCode, (_, code) => put("<code>" + escapeHtml(code) + "</code>"))
    value = value.replace(/(^|[^\\])\$([^$\n]+?)\$/g, (_, prefix, math) => prefix + put(renderMath(math, false)))
    value = value.replace(/!?\[([^\]]+)\]\(([^)\s]+)\)/g, (match, label, url) => {
      if (match.startsWith("!")) return match
      const safe = safeUrl(url)
      if (!safe) return label
      return put('<a href="' + escapeAttribute(safe) + '" target="_blank" rel="noopener noreferrer">' + escapeHtml(label) + "</a>")
    })

    value = escapeHtml(value)
      .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
      .replace(/__([^_]+)__/g, "<strong>$1</strong>")
      .replace(/\*([^*\n]+)\*/g, "<em>$1</em>")
      .replace(/_([^_\n]+)_/g, "<em>$1</em>")
      .replace(/\n/g, "<br>")

    return restore(value)
  }

  function renderMath(tex, displayMode) {
    const value = String(tex || "").trim()
    if (window.katex) {
      try {
        return window.katex.renderToString(value, {
          displayMode: Boolean(displayMode),
          throwOnError: false,
          strict: "ignore",
          output: "html",
        })
      } catch {}
    }
    const wrapper = displayMode ? "$$" : "$"
    return '<code class="comments-math-fallback">' + escapeHtml(wrapper + value + wrapper) + "</code>"
  }

  function safeUrl(url) {
    try {
      const parsed = new URL(url, window.location.href)
      if (["http:", "https:", "mailto:"].includes(parsed.protocol)) return parsed.href
      if (parsed.origin === window.location.origin) return parsed.href
    } catch {}
    return ""
  }

  function formatDate(value) {
    const date = value ? new Date(value) : null
    if (!date || Number.isNaN(date.getTime())) return ""
    return new Intl.DateTimeFormat("zh-CN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date)
  }

  function hashString(value) {
    let hash = 0
    String(value || "").split("").forEach((char) => {
      hash = (hash * 31 + char.charCodeAt(0)) >>> 0
    })
    return hash
  }

  function escapeHtml(value) {
    return String(value || "").replace(/[&<>"']/g, (char) => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;",
    })[char])
  }

  function escapeAttribute(value) {
    return escapeHtml(value).replace(new RegExp(backtick, "g"), "&#96;")
  }

  document.addEventListener("nav", initComments)
  document.addEventListener("render", initComments)
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initComments, { once: true })
  } else {
    initComments()
  }
})()`

const Comments = (opts = {}) => {
  const options = { ...defaultOptions, ...opts }

  function CommentsComponent({ fileData, displayClass }) {
    const rawSlug = String(fileData?.slug ?? "").replace(/^\/+|\/+$/g, "")
    const slug = rawSlug || "index"

    return h(
      "section",
      {
        class: cx(displayClass, "note-comments"),
        "data-comments-root": "",
        "data-comment-path": slug,
        "data-comments-api": options.apiBase,
        "data-comments-max-length": String(options.maxLength),
        "data-comments-katex": options.katexScript,
      },
      [
        h("div", { class: "note-comments-header" }, [
          h("h2", { class: "note-comments-title" }, "评论"),
          h("p", { class: "note-comments-subtitle" }, "支持 Markdown 和 LaTeX 数学公式。"),
        ]),
        h(
          "div",
          {
            class: "note-comments-status",
            role: "status",
            "aria-live": "polite",
            "data-comments-status": "",
          },
          "正在加载评论...",
        ),
        h("div", { class: "note-comments-auth", "data-comments-auth": "" }, "正在检查 GitHub 登录状态..."),
        h("div", { class: "note-comments-list", "data-comments-list": "" }),
        h(
          "form",
          {
            class: "note-comments-form",
            "data-comments-form": "",
          },
          [
            h("label", { class: "note-comments-field" }, [
              h("span", null, "评论内容"),
              h("textarea", {
                name: "content",
                maxlength: options.maxLength,
                placeholder: "支持 Markdown、$行内公式$ 和 $$独立公式$$。",
                required: true,
                disabled: true,
                "data-comments-content": "",
              }),
            ]),
            h("input", {
              class: "note-comments-honeypot",
              name: "website",
              type: "text",
              tabindex: "-1",
              autocomplete: "off",
              "aria-hidden": "true",
            }),
            h("div", {
              class: "note-comments-preview",
              hidden: true,
              "data-comments-preview": "",
            }),
            h("div", { class: "note-comments-toolbar" }, [
              h("span", { class: "note-comments-counter", "data-comments-counter": "" }, "0 / " + options.maxLength),
              h("span", { class: "note-comments-actions" }, [
                h("label", { class: "note-comments-sync-preview" }, [
                  h("input", {
                    type: "checkbox",
                    "data-comments-sync-preview": "",
                  }),
                  h("span", null, "同步预览"),
                ]),
                h("button", { class: "note-comments-button primary", type: "submit", disabled: true }, "发布评论"),
              ]),
            ]),
          ],
        ),
      ],
    )
  }

  CommentsComponent.css = styles
  CommentsComponent.afterDOMLoaded = script
  return CommentsComponent
}

export { Comments }
