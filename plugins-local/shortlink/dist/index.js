import { h } from "preact"

const style = `.shortlink {
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  margin: 0.45rem 0.45rem 1.1rem 0;
  vertical-align: top;
  font-size: 0.92rem;
}

.shortlink-btn {
  appearance: none;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.35rem;
  min-height: 2rem;
  max-width: 100%;
  padding: 0.34rem 0.68rem;
  border: 1px solid var(--lightgray);
  border-radius: 6px;
  background: var(--light);
  color: var(--darkgray);
  font: inherit;
  line-height: 1;
  white-space: nowrap;
  cursor: pointer;
  transition:
    border-color 0.15s ease,
    background-color 0.15s ease,
    color 0.15s ease;
}

.shortlink-btn:hover {
  border-color: var(--secondary);
  color: var(--dark);
}

.shortlink-btn:focus-visible {
  outline: 2px solid var(--secondary);
  outline-offset: 2px;
}

.shortlink-btn[hidden] {
  display: none;
}

.shortlink-icon {
  width: 1em;
  flex: 0 0 1em;
  text-align: center;
}

@media (max-width: 600px) {
  .shortlink-btn {
    flex: 1 1 auto;
  }
}`

const script = `(() => {
  const noteIdMapPath = "/static/note-id-map.json"
  const globalStateKey = "__groupVaultShortlink"
  const noteMapState =
    (window.__groupVaultNoteIdMap ??= { loaded: false, loading: null, slugToId: {}, notes: {} })

  function normalizePageId(value) {
    return (
      String(value || "")
        .replace(/^\\/+|\\/+$/g, "")
        .replace(/\\.html$/u, "")
        .replace(/\\/index$/u, "") || "index"
    )
  }

  function pageIdFor(root) {
    const slug = root.dataset.shortlinkSlug
    if (slug) return normalizePageId(slug)

    let pathname = window.location.pathname
    try {
      pathname = decodeURIComponent(pathname)
    } catch {}

    const basepath = document.body?.dataset?.basepath ?? ""
    if (basepath && pathname.startsWith(basepath)) {
      pathname = pathname.slice(basepath.length)
    }

    return normalizePageId(pathname)
  }

  async function readJson(response) {
    const text = await response.text().catch(() => "")
    if (!text) return {}
    try {
      return JSON.parse(text)
    } catch {
      return {}
    }
  }

  async function loadNoteIdMap() {
    if (noteMapState.loaded) return noteMapState
    if (noteMapState.loading) return noteMapState.loading

    noteMapState.loading = (async () => {
      try {
        const response = await fetch(noteIdMapPath, { headers: { Accept: "application/json" } })
        const data = await readJson(response)
        if (response.ok && data && typeof data === "object") {
          noteMapState.slugToId = data.slugToId || {}
          noteMapState.notes = data.notes || {}
          noteMapState.shortIdToId = data.shortIdToId || {}
          noteMapState.shortIdToUrl = data.shortIdToUrl || {}
        }
      } catch {
        noteMapState.slugToId = noteMapState.slugToId || {}
        noteMapState.notes = noteMapState.notes || {}
      } finally {
        noteMapState.loaded = true
        noteMapState.loading = null
      }
      return noteMapState
    })()

    return noteMapState.loading
  }

  function shortIdForPageId(pageId) {
    const slug = normalizePageId(pageId)
    const noteId = normalizePageId(noteMapState.slugToId?.[slug] || slug)
    const note = noteMapState.notes?.[noteId] || {}
    return note.shortId ? String(note.shortId) : ""
  }

  function shortUrlFor(shortId) {
    return new URL("/n/" + encodeURIComponent(shortId), window.location.origin).toString()
  }

  async function copyText(text) {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text)
      return
    }

    const textarea = document.createElement("textarea")
    textarea.value = text
    textarea.setAttribute("readonly", "")
    textarea.style.position = "fixed"
    textarea.style.left = "-9999px"
    document.body.appendChild(textarea)
    textarea.select()
    document.execCommand("copy")
    textarea.remove()
  }

  function setButtonState(button, text, title) {
    const label = button.querySelector("[data-shortlink-label]")
    if (label) label.textContent = text
    button.title = title
    button.setAttribute("aria-label", title)
  }

  function setupRoot(root) {
    const button = root.querySelector("[data-shortlink-copy]")
    if (!button) return

    const shortId = shortIdForPageId(pageIdFor(root))
    if (!shortId) {
      button.hidden = true
      return
    }

    const url = shortUrlFor(shortId)
    root.dataset.shortlinkUrl = url
    button.hidden = false
    setButtonState(button, "复制短链接", "复制短链接：" + url)
  }

  async function handleClick(event) {
    const button = event.target?.closest?.("[data-shortlink-copy]")
    if (!button) return

    const root = button.closest("[data-shortlink]")
    const url = root?.dataset?.shortlinkUrl
    if (!url) return

    try {
      await copyText(url)
      setButtonState(button, "已复制", "已复制：" + url)
      window.setTimeout(() => setButtonState(button, "复制短链接", "复制短链接：" + url), 1600)
    } catch {
      setButtonState(button, "复制失败", "复制失败，请手动复制：" + url)
    }
  }

  async function setupShortlinks() {
    await loadNoteIdMap()
    document.querySelectorAll("[data-shortlink]").forEach(setupRoot)
  }

  function setupClickHandler() {
    const globalState = window[globalStateKey] ?? {}
    if (globalState.onClick) {
      document.removeEventListener("click", globalState.onClick)
    }

    globalState.onClick = handleClick
    window[globalStateKey] = globalState
    document.addEventListener("click", handleClick)
  }

  function setup() {
    setupClickHandler()
    setupShortlinks()
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", setup, { once: true })
  } else {
    setup()
  }

  document.addEventListener("nav", setup)
  document.addEventListener("render", setup)
})()`

function classNames(...classes) {
  return classes.filter(Boolean).join(" ")
}

function Shortlink() {
  function ShortlinkComponent({ displayClass, fileData }) {
    const slug = fileData?.slug ? String(fileData.slug) : ""

    return h(
      "div",
      {
        class: classNames(displayClass, "shortlink"),
        "data-shortlink": "",
        "data-shortlink-slug": slug,
      },
      h(
        "button",
        {
          class: "shortlink-btn",
          type: "button",
          hidden: true,
          "data-shortlink-copy": "",
          "aria-label": "复制短链接",
          title: "复制短链接",
        },
        [
          h("span", { class: "shortlink-icon", "aria-hidden": "true" }, "#"),
          h("span", { "data-shortlink-label": "" }, "复制短链接"),
        ],
      ),
    )
  }

  ShortlinkComponent.css = style
  ShortlinkComponent.afterDOMLoaded = script
  return ShortlinkComponent
}

export { Shortlink }
export default Shortlink
