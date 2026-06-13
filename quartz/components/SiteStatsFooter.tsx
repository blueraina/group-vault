import type { JSX } from "preact"

const script = `(() => {
  if (window.__groupVaultSiteStatsFooterReady) return
  window.__groupVaultSiteStatsFooterReady = true

  const state = {
    promise: null,
    value: null,
  }

  function ensureTarget() {
    const paragraph = document.querySelector("footer p")
    if (!paragraph) return null

    let target = paragraph.querySelector("[data-site-stats-registered-users]")
    if (target) return target

    target = document.createElement("span")
    target.dataset.siteStatsRegisteredUsers = ""
    target.className = "site-stats-registered-users"
    target.hidden = true
    paragraph.prepend(document.createTextNode(" "))
    paragraph.prepend(target)
    return target
  }

  function render(value) {
    const target = ensureTarget()
    if (!target || typeof value !== "number" || !Number.isFinite(value)) return
    target.textContent = "已登录用户 " + String(value) + " 人 ·"
    target.hidden = false
  }

  async function load() {
    if (typeof state.value === "number") {
      render(state.value)
      return
    }

    if (!state.promise) {
      state.promise = fetch("/api/site-stats", { headers: { Accept: "application/json" } })
        .then((response) => response.ok ? response.json() : null)
        .then((data) => {
          const count = Number(data && data.registeredUsers)
          if (Number.isFinite(count)) state.value = count
          return state.value
        })
        .catch(() => null)
    }

    const value = await state.promise
    if (typeof value === "number") render(value)
  }

  document.addEventListener("nav", load)
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", load, { once: true })
  } else {
    load()
  }
})()`

export default function SiteStatsFooter(): JSX.Element {
  return <script data-site-stats-footer dangerouslySetInnerHTML={{ __html: script }} />
}
