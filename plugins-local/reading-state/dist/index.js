import { h } from "preact"

const style = `.reading-state {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.5rem;
  margin: 0.45rem 0 1.1rem;
  font-size: 0.92rem;
}

.reading-state-btn {
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

.reading-state-btn:hover {
  border-color: var(--secondary);
  color: var(--dark);
}

.reading-state-btn:focus-visible {
  outline: 2px solid var(--secondary);
  outline-offset: 2px;
}

.reading-state-btn.is-active {
  border-color: var(--secondary);
  background: var(--highlight);
  color: var(--secondary);
}

.reading-state-icon {
  width: 1em;
  flex: 0 0 1em;
  text-align: center;
}

.explorer-reading-state {
  display: inline-flex;
  align-items: baseline;
  gap: 0.18rem;
  margin-left: 0.35rem;
  color: var(--secondary);
  font-size: 0.86em;
  font-weight: 600;
  line-height: 1;
  white-space: nowrap;
}

.explorer-reading-state .favorite-marker {
  color: var(--tertiary);
}

@media (max-width: 600px) {
  .reading-state {
    gap: 0.4rem;
  }

  .reading-state-btn {
    flex: 1 1 auto;
  }
}`

const script = `(() => {
  const storagePrefix = "group-vault:reading-state:v1"
  const activeText = {
    read: { on: "✓", off: "○" },
    favorite: { on: "★", off: "☆" },
  }
  let explorerObserver = null
  let explorerUpdateQueued = false
  const explorerUpdateDelays = [0, 80, 250]

  function pageIdFor(root) {
    const slug = root.dataset.readingSlug
    if (slug) return slug.replace(/^\\/+|\\/+$/g, "").replace(/\\/index$/u, "") || "index"

    let pathname = window.location.pathname
    try {
      pathname = decodeURIComponent(pathname)
    } catch {}

    const basepath = document.body?.dataset?.basepath ?? ""
    if (basepath && pathname.startsWith(basepath)) {
      pathname = pathname.slice(basepath.length)
    }

    return pathname.replace(/^\\/+|\\/+$/g, "").replace(/\\/index$/u, "") || "index"
  }

  function pageIdForHref(href) {
    try {
      const url = new URL(href, window.location.href)
      let pathname = url.pathname
      try {
        pathname = decodeURIComponent(pathname)
      } catch {}

      const basepath = document.body?.dataset?.basepath ?? ""
      if (basepath && pathname.startsWith(basepath)) {
        pathname = pathname.slice(basepath.length)
      }

      return (
        pathname
          .replace(/^\\/+|\\/+$/g, "")
          .replace(/\\.html$/u, "")
          .replace(/\\/index$/u, "") || "index"
      )
    } catch {
      return ""
    }
  }

  function stateKey(action, pageId) {
    return \`\${storagePrefix}:\${action}:\${pageId}\`
  }

  function getState(action, pageId) {
    try {
      return localStorage.getItem(stateKey(action, pageId)) !== null
    } catch {
      return false
    }
  }

  function setState(action, pageId, isActive) {
    try {
      const key = stateKey(action, pageId)
      if (isActive) {
        localStorage.setItem(key, new Date().toISOString())
      } else {
        localStorage.removeItem(key)
      }
    } catch {}
  }

  function labelsFor(root, action, isActive) {
    if (action === "read") {
      return isActive ? root.dataset.readActiveLabel : root.dataset.readLabel
    }

    return isActive ? root.dataset.favoriteActiveLabel : root.dataset.favoriteLabel
  }

  function updateButton(root, button, pageId) {
    const action = button.dataset.readingAction
    if (!action) return

    const isActive = getState(action, pageId)
    const label = labelsFor(root, action, isActive) ?? ""
    const labelElement = button.querySelector("[data-reading-label]")
    const iconElement = button.querySelector(".reading-state-icon")

    button.classList.toggle("is-active", isActive)
    button.setAttribute("aria-pressed", String(isActive))
    button.title = label

    if (labelElement) labelElement.textContent = label
    if (iconElement) iconElement.textContent = activeText[action]?.[isActive ? "on" : "off"] ?? ""
  }

  function refreshRoot(root) {
    const pageId = pageIdFor(root)
    root.querySelectorAll("[data-reading-action]").forEach((button) => {
      updateButton(root, button, pageId)
    })
  }

  function directMarkerChild(link) {
    return Array.from(link.children).find((child) =>
      child.classList.contains("explorer-reading-state"),
    )
  }

  function updateExplorerMarkers() {
    document.querySelectorAll(".explorer-content a.nav-file-title").forEach((link) => {
      const pageId = pageIdForHref(link.href)
      if (!pageId) return

      const isRead = getState("read", pageId)
      const isFavorite = getState("favorite", pageId)
      let marker = directMarkerChild(link)

      if (!isRead && !isFavorite) {
        marker?.remove()
        link.removeAttribute("data-reading-read")
        link.removeAttribute("data-reading-favorite")
        return
      }

      if (!marker) {
        marker = document.createElement("span")
        marker.className = "explorer-reading-state"
        marker.setAttribute("aria-hidden", "true")
        link.appendChild(marker)
      }

      const readMarkup = isRead ? '<span class="read-marker">✓</span>' : ""
      const favoriteMarkup = isFavorite ? '<span class="favorite-marker">★</span>' : ""
      const nextHtml = \`\${readMarkup}\${favoriteMarkup}\`
      if (marker.innerHTML !== nextHtml) marker.innerHTML = nextHtml

      link.dataset.readingRead = String(isRead)
      link.dataset.readingFavorite = String(isFavorite)
    })
  }

  function runExplorerMarkerUpdate() {
    if (explorerUpdateQueued) return

    explorerUpdateQueued = true
    requestAnimationFrame(() => {
      explorerUpdateQueued = false
      updateExplorerMarkers()
    })
  }

  function scheduleExplorerMarkers() {
    explorerUpdateDelays.forEach((delay) => {
      if (delay === 0) {
        runExplorerMarkerUpdate()
      } else {
        window.setTimeout(runExplorerMarkerUpdate, delay)
      }
    })
  }

  function observeExplorerMarkers() {
    explorerObserver?.disconnect()

    const explorerLists = document.querySelectorAll(".explorer-ul")
    if (explorerLists.length === 0) return

    explorerObserver = new MutationObserver(scheduleExplorerMarkers)
    explorerLists.forEach((list) => {
      explorerObserver.observe(list, { childList: true, subtree: true })
    })
  }

  function setupExplorerMarkers() {
    scheduleExplorerMarkers()
    observeExplorerMarkers()
  }

  function setupRoot(root) {
    const pageId = pageIdFor(root)
    root.querySelectorAll("[data-reading-action]").forEach((button) => {
      if (button.dataset.readingBound === "true") {
        updateButton(root, button, pageId)
        return
      }

      const onClick = () => {
        const action = button.dataset.readingAction
        if (!action) return

        const currentRoot = button.closest("[data-reading-state]") ?? root
        const currentPageId = pageIdFor(currentRoot)
        const nextState = !getState(action, currentPageId)
        setState(action, currentPageId, nextState)
        refreshRoot(currentRoot)
        scheduleExplorerMarkers()
      }

      button.dataset.readingBound = "true"
      button.addEventListener("click", onClick)

      if (window.addCleanup) {
        window.addCleanup(() => {
          button.removeEventListener("click", onClick)
          delete button.dataset.readingBound
        })
      }

      updateButton(root, button, pageId)
    })
  }

  function setupReadingState() {
    document.querySelectorAll("[data-reading-state]").forEach(setupRoot)
    setupExplorerMarkers()
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", setupReadingState, { once: true })
  } else {
    setupReadingState()
  }

  document.addEventListener("nav", setupReadingState)
  document.addEventListener("render", setupReadingState)
})()`

const defaultOptions = {
  readLabel: "标记已读",
  readActiveLabel: "已读",
  favoriteLabel: "收藏",
  favoriteActiveLabel: "已收藏",
}

function classNames(...classes) {
  return classes.filter(Boolean).join(" ")
}

function ReadingState(opts = {}) {
  const options = { ...defaultOptions, ...opts }

  function ReadingStateComponent({ displayClass, fileData }) {
    const slug = fileData?.slug ? String(fileData.slug) : ""

    return h(
      "div",
      {
        class: classNames(displayClass, "reading-state"),
        "data-reading-state": "",
        "data-reading-slug": slug,
        "data-read-label": options.readLabel,
        "data-read-active-label": options.readActiveLabel,
        "data-favorite-label": options.favoriteLabel,
        "data-favorite-active-label": options.favoriteActiveLabel,
      },
      [
        h(
          "button",
          {
            key: "read",
            class: "reading-state-btn",
            type: "button",
            "data-reading-action": "read",
            "aria-pressed": "false",
          },
          [
            h("span", { class: "reading-state-icon", "aria-hidden": "true" }, "○"),
            h("span", { "data-reading-label": "read" }, options.readLabel),
          ],
        ),
        h(
          "button",
          {
            key: "favorite",
            class: "reading-state-btn",
            type: "button",
            "data-reading-action": "favorite",
            "aria-pressed": "false",
          },
          [
            h("span", { class: "reading-state-icon", "aria-hidden": "true" }, "☆"),
            h("span", { "data-reading-label": "favorite" }, options.favoriteLabel),
          ],
        ),
      ],
    )
  }

  ReadingStateComponent.css = style
  ReadingStateComponent.afterDOMLoaded = script
  return ReadingStateComponent
}

export { ReadingState }
