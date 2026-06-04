import { h } from "preact"

const themes = [
  { id: "light", label: "浅色", swatch: "#faf8f8" },
  { id: "dark", label: "深色", swatch: "#161618" },
  { id: "night", label: "夜蓝", swatch: "#0b1220" },
  { id: "academic", label: "学术", swatch: "#f7f9fc" },
  { id: "notion", label: "Notion", swatch: "#fbfaf8" },
  { id: "paper", label: "暖纸", swatch: "#f5ead6" },
]

const cx = (...parts) => parts.filter(Boolean).join(" ")

const beforeDOMLoaded = `
const themeOptions = ["light", "dark", "night", "academic", "notion", "paper"];
const themeLabels = {
  light: "浅色",
  dark: "深色",
  night: "夜蓝",
  academic: "学术",
  notion: "Notion",
  paper: "暖纸",
};
const systemTheme = () => window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
const normalizeTheme = (theme) => themeOptions.includes(theme) ? theme : systemTheme();
const savedTheme = localStorage.getItem("theme");
let currentTheme = normalizeTheme(savedTheme);
document.documentElement.setAttribute("saved-theme", currentTheme);

const syncBodyThemeClass = (theme) => {
  document.body?.classList.remove(...themeOptions.map((name) => "theme-" + name));
  document.body?.classList.add("theme-" + theme);
};

const emitThemeChangeEvent = (theme) => {
  document.dispatchEvent(new CustomEvent("themechange", { detail: { theme } }));
};

const updateThemeControls = (theme) => {
  for (const switcher of document.getElementsByClassName("theme-switcher")) {
    const label = themeLabels[theme] ?? themeLabels.light;
    const trigger = switcher.querySelector(".theme-switcher-trigger");
    if (trigger) {
      trigger.setAttribute("aria-label", "选择主题，当前：" + label);
      trigger.setAttribute("title", "选择主题，当前：" + label);
    }

    for (const option of switcher.querySelectorAll("[data-theme-option]")) {
      const active = option.getAttribute("data-theme-option") === theme;
      option.classList.toggle("active", active);
      option.setAttribute("aria-checked", active ? "true" : "false");
    }
  }
};

const closeThemeMenus = (except) => {
  for (const switcher of document.getElementsByClassName("theme-switcher")) {
    if (switcher !== except) switcher.classList.remove("open");
  }
};

const setTheme = (theme, persist = true) => {
  const nextTheme = normalizeTheme(theme);
  document.documentElement.setAttribute("saved-theme", nextTheme);
  if (persist) localStorage.setItem("theme", nextTheme);
  currentTheme = nextTheme;
  syncBodyThemeClass(nextTheme);
  updateThemeControls(nextTheme);
  emitThemeChangeEvent(nextTheme);
};

const setupThemeSwitcher = () => {
  const activeTheme = normalizeTheme(document.documentElement.getAttribute("saved-theme"));
  syncBodyThemeClass(activeTheme);
  updateThemeControls(activeTheme);

  for (const switcher of document.getElementsByClassName("theme-switcher")) {
    if (switcher.dataset.themeBound === "true") continue;
    switcher.dataset.themeBound = "true";

    const trigger = switcher.querySelector(".theme-switcher-trigger");
    const menu = switcher.querySelector(".theme-switcher-menu");
    if (!trigger || !menu) continue;

    const toggleMenu = (event) => {
      event.stopPropagation();
      const shouldOpen = !switcher.classList.contains("open");
      closeThemeMenus(switcher);
      switcher.classList.toggle("open", shouldOpen);
      trigger.setAttribute("aria-expanded", shouldOpen ? "true" : "false");
    };

    const chooseTheme = (event) => {
      const option = event.currentTarget;
      const theme = option.getAttribute("data-theme-option");
      if (!theme) return;
      setTheme(theme);
      switcher.classList.remove("open");
      trigger.setAttribute("aria-expanded", "false");
    };

    const closeOnOutsideClick = (event) => {
      if (!switcher.contains(event.target)) {
        switcher.classList.remove("open");
        trigger.setAttribute("aria-expanded", "false");
      }
    };

    const closeOnEscape = (event) => {
      if (event.key === "Escape") {
        switcher.classList.remove("open");
        trigger.setAttribute("aria-expanded", "false");
      }
    };

    trigger.addEventListener("click", toggleMenu);
    document.addEventListener("click", closeOnOutsideClick);
    document.addEventListener("keydown", closeOnEscape);
    window.addCleanup(() => {
      trigger.removeEventListener("click", toggleMenu);
      document.removeEventListener("click", closeOnOutsideClick);
      document.removeEventListener("keydown", closeOnEscape);
    });

    for (const option of menu.querySelectorAll("[data-theme-option]")) {
      option.addEventListener("click", chooseTheme);
      window.addCleanup(() => option.removeEventListener("click", chooseTheme));
    }
  }
};

const colorSchemeMediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
const handleSystemThemeChange = () => {
  if (!localStorage.getItem("theme")) setTheme(systemTheme(), false);
};
colorSchemeMediaQuery.addEventListener("change", handleSystemThemeChange);
window.addCleanup?.(() => colorSchemeMediaQuery.removeEventListener("change", handleSystemThemeChange));

document.addEventListener("nav", setupThemeSwitcher);
document.addEventListener("render", setupThemeSwitcher);
`

const styles = `
.theme-switcher {
  position: relative;
  flex-shrink: 0;
  width: 32px;
  height: 32px;
}

.theme-switcher-trigger {
  align-items: center;
  background: color-mix(in srgb, var(--light) 86%, transparent);
  border: 1px solid var(--lightgray);
  border-radius: 6px;
  color: var(--darkgray);
  cursor: pointer;
  display: inline-flex;
  height: 32px;
  justify-content: center;
  margin: 0;
  padding: 0;
  transition: background-color 0.15s ease, border-color 0.15s ease, color 0.15s ease;
  width: 32px;
}

.theme-switcher-trigger:hover,
.theme-switcher.open .theme-switcher-trigger {
  background: var(--highlight);
  border-color: var(--secondary);
  color: var(--secondary);
}

.theme-switcher-trigger svg {
  height: 18px;
  width: 18px;
}

.theme-switcher-menu {
  background: var(--light);
  border: 1px solid var(--lightgray);
  border-radius: 8px;
  box-shadow: 0 18px 42px rgba(15, 23, 42, 0.16);
  display: none;
  left: 0;
  min-width: 156px;
  padding: 0.35rem;
  position: absolute;
  top: calc(100% + 0.45rem);
  z-index: 20;
}

.theme-switcher.open .theme-switcher-menu {
  display: grid;
  gap: 0.15rem;
}

.theme-switcher-option {
  align-items: center;
  background: transparent;
  border: 0;
  border-radius: 6px;
  color: var(--darkgray);
  cursor: pointer;
  display: grid;
  font: inherit;
  gap: 0.55rem;
  grid-template-columns: 16px 1fr;
  min-height: 32px;
  padding: 0.25rem 0.45rem;
  text-align: left;
  width: 100%;
}

.theme-switcher-option:hover,
.theme-switcher-option.active {
  background: var(--highlight);
  color: var(--secondary);
}

.theme-switcher-swatch {
  border: 1px solid color-mix(in srgb, var(--darkgray) 24%, transparent);
  border-radius: 50%;
  display: inline-block;
  height: 14px;
  width: 14px;
}

:root[saved-theme="dark"],
:root[saved-theme="night"] {
  color-scheme: dark;
}

:root:not([saved-theme="dark"]):not([saved-theme="night"]),
:root[saved-theme="light"],
:root[saved-theme="academic"],
:root[saved-theme="notion"],
:root[saved-theme="paper"] {
  color-scheme: light;
}

:root[saved-theme="night"] {
  --light: #0b1220;
  --lightgray: #18243a;
  --gray: #8294ad;
  --darkgray: #c7d2e5;
  --dark: #eef5ff;
  --secondary: #7db7ff;
  --tertiary: #8fb8d8;
  --highlight: rgba(125, 183, 255, 0.16);
  --textHighlight: rgba(96, 165, 250, 0.28);
  --accent-h: 212;
  --accent-s: 92%;
  --accent-l: 72%;
}

:root[saved-theme="academic"] {
  --light: #f7f9fc;
  --lightgray: #e5ebf3;
  --gray: #8592a3;
  --darkgray: #334155;
  --dark: #111827;
  --secondary: #2563eb;
  --tertiary: #0f766e;
  --highlight: rgba(37, 99, 235, 0.12);
  --textHighlight: #fff3a3aa;
  --accent-h: 221;
  --accent-s: 83%;
  --accent-l: 53%;
}

:root[saved-theme="notion"] {
  --light: #fbfaf8;
  --lightgray: #ebe7df;
  --gray: #8f877c;
  --darkgray: #45413a;
  --dark: #1f1d1a;
  --secondary: #4e6f75;
  --tertiary: #8a6a3f;
  --highlight: rgba(78, 111, 117, 0.13);
  --textHighlight: #f7df8faa;
  --accent-h: 189;
  --accent-s: 20%;
  --accent-l: 38%;
}

:root[saved-theme="paper"] {
  --light: #f5ead6;
  --lightgray: #e7d8bd;
  --gray: #9a876b;
  --darkgray: #4f4435;
  --dark: #2d2419;
  --secondary: #8a5a2b;
  --tertiary: #526f58;
  --highlight: rgba(138, 90, 43, 0.14);
  --textHighlight: #ffe8a6aa;
  --accent-h: 30;
  --accent-s: 52%;
  --accent-l: 35%;
}
`

const icon = h(
  "svg",
  {
    xmlns: "http://www.w3.org/2000/svg",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    "stroke-width": "2",
    "stroke-linecap": "round",
    "stroke-linejoin": "round",
    "aria-hidden": "true",
  },
  [
    h("circle", { cx: "13.5", cy: "6.5", r: "2.5" }),
    h("circle", { cx: "17.5", cy: "12.5", r: "2.5" }),
    h("circle", { cx: "10.5", cy: "17.5", r: "2.5" }),
    h("path", { d: "M7 9.5A7.5 7.5 0 1 0 18.8 18" }),
  ],
)

const ThemeSwitcher = ({ displayClass }) =>
  h("div", { class: cx(displayClass, "theme-switcher") }, [
    h(
      "button",
      {
        class: "theme-switcher-trigger",
        type: "button",
        "aria-label": "选择主题",
        "aria-haspopup": "menu",
        "aria-expanded": "false",
        title: "选择主题",
      },
      icon,
    ),
    h(
      "div",
      {
        class: "theme-switcher-menu",
        role: "menu",
        "aria-label": "主题",
      },
      themes.map((theme) =>
        h(
          "button",
          {
            class: "theme-switcher-option",
            type: "button",
            role: "menuitemradio",
            "aria-checked": "false",
            "data-theme-option": theme.id,
          },
          [
            h("span", {
              class: "theme-switcher-swatch",
              style: { background: theme.swatch },
              "aria-hidden": "true",
            }),
            h("span", null, theme.label),
          ],
        ),
      ),
    ),
  ])

ThemeSwitcher.beforeDOMLoaded = beforeDOMLoaded
ThemeSwitcher.css = styles

export const Darkmode = () => ThemeSwitcher

export default Darkmode
