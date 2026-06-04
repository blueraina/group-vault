const observer = new IntersectionObserver((entries) => {
  for (const entry of entries) {
    const slug = entry.target.id;
    const tocEntryElements = document.querySelectorAll(`a[data-for="${slug}"]`);
    const windowHeight = entry.rootBounds?.height;
    if (windowHeight && tocEntryElements.length > 0) {
      if (entry.boundingClientRect.y < windowHeight) {
        tocEntryElements.forEach((tocEntryElement) => tocEntryElement.classList.add("in-view"));
      } else {
        tocEntryElements.forEach((tocEntryElement) => tocEntryElement.classList.remove("in-view"));
      }
    }
  }
});

function toggleToc(this: HTMLElement) {
  this.classList.toggle("collapsed");
  this.setAttribute(
    "aria-expanded",
    this.getAttribute("aria-expanded") === "true" ? "false" : "true",
  );
  const content = this.nextElementSibling as HTMLElement | undefined;
  if (!content) return;
  content.classList.toggle("collapsed");
}

function setupToc() {
  const tocElements = Array.from(document.getElementsByClassName("toc"));
  for (const toc of tocElements) {
    const button = toc.querySelector(".toc-header");
    const content = toc.querySelector(".toc-content");
    if (!button || !content) return;
    button.addEventListener("click", toggleToc);
    const cleanup = () => button.removeEventListener("click", toggleToc);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if ((window as any).addCleanup) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (window as any).addCleanup(cleanup);
    }
  }
}

function handleNavOrRender() {
  setupToc();

  // update toc entry highlighting
  observer.disconnect();
  const headers = document.querySelectorAll("h1[id], h2[id], h3[id], h4[id], h5[id], h6[id]");
  headers.forEach((header) => observer.observe(header));
}

document.addEventListener("nav", handleNavOrRender);
document.addEventListener("render", handleNavOrRender);
