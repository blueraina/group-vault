import type {
  QuartzComponent,
  QuartzComponentProps,
  QuartzComponentConstructor,
} from "@quartz-community/types";
import katex from "katex";
import type { ComponentChild } from "preact";
import { classNames } from "../util/lang";
import { i18n } from "../i18n";
import legacyStyle from "./styles/legacyToc.scss";
import modernStyle from "./styles/toc.scss";
// @ts-expect-error - inline script imported as string by esbuild loader
import script from "./scripts/toc.inline.ts";
import OverflowListFactory from "./OverflowList";
import { concatenateResources } from "../util/resources";

interface Options {
  layout: "modern" | "legacy";
}

const defaultOptions: Options = {
  layout: "modern",
};

const explicitMathPattern = /(\$\$[\s\S]+?\$\$|\$[^$\n]+?\$|\\\([\s\S]+?\\\)|\\\[[\s\S]+?\\\])/g;
const groupedImplicitMathPattern =
  /(?:[A-Za-z][A-Za-z0-9]*(?:\^\{[^}]+\})?)?\([^()\n]*\\[A-Za-z][^()\n]*\)(?:\s*\\[A-Za-z]+\s*(?:[A-Za-z][A-Za-z0-9]*(?:\^\{[^}]+\})?)?\([^()\n]*\\[A-Za-z][^()\n]*\))*/g;
const commandImplicitMathPattern =
  /\\[A-Za-z]+(?:\s*(?:[_^=+*/<>#{}\\A-Za-z0-9]|[()[\],.]))*/g;

function stripMathDelimiters(text: string): string {
  if (text.startsWith("$$") && text.endsWith("$$")) return text.slice(2, -2);
  if (text.startsWith("$") && text.endsWith("$")) return text.slice(1, -1);
  if (text.startsWith("\\(") && text.endsWith("\\)")) return text.slice(2, -2);
  if (text.startsWith("\\[") && text.endsWith("\\]")) return text.slice(2, -2);
  return text;
}

function renderMath(math: string, key: string): ComponentChild {
  try {
    return (
      <span
        key={key}
        class="toc-math"
        dangerouslySetInnerHTML={{
          __html: katex.renderToString(math.trim(), {
            displayMode: false,
            throwOnError: true,
            strict: "ignore",
          }),
        }}
      />
    );
  } catch {
    return math;
  }
}

function collectImplicitMathRanges(text: string): Array<[number, number]> {
  const ranges: Array<[number, number]> = [];

  for (const pattern of [groupedImplicitMathPattern, commandImplicitMathPattern]) {
    pattern.lastIndex = 0;
    for (const match of text.matchAll(pattern)) {
      if (match.index === undefined) continue;
      ranges.push([match.index, match.index + match[0].length]);
    }
  }

  return ranges
    .sort((a, b) => a[0] - b[0] || b[1] - a[1])
    .reduce<Array<[number, number]>>((merged, range) => {
      const previous = merged[merged.length - 1];
      if (!previous || range[0] >= previous[1]) {
        merged.push(range);
      }

      return merged;
    }, []);
}

function renderImplicitMath(text: string, prefix: string): ComponentChild[] {
  const ranges = collectImplicitMathRanges(text);
  if (ranges.length === 0) return [text];

  const parts: ComponentChild[] = [];
  let cursor = 0;

  ranges.forEach(([start, end], index) => {
    if (start > cursor) parts.push(text.slice(cursor, start));
    parts.push(renderMath(text.slice(start, end), `${prefix}-implicit-${index}`));
    cursor = end;
  });

  if (cursor < text.length) parts.push(text.slice(cursor));
  return parts;
}

function renderTocText(text: string): ComponentChild[] {
  const parts: ComponentChild[] = [];
  let cursor = 0;
  let explicitIndex = 0;

  explicitMathPattern.lastIndex = 0;
  for (const match of text.matchAll(explicitMathPattern)) {
    if (match.index === undefined) continue;
    if (match.index > cursor) {
      parts.push(...renderImplicitMath(text.slice(cursor, match.index), `toc-${explicitIndex}`));
    }

    parts.push(
      renderMath(stripMathDelimiters(match[0]), `toc-explicit-${explicitIndex}`),
    );
    cursor = match.index + match[0].length;
    explicitIndex++;
  }

  if (cursor < text.length) {
    parts.push(...renderImplicitMath(text.slice(cursor), `toc-tail-${explicitIndex}`));
  }

  return parts;
}

let numTocs = 0;
export default ((opts?: Partial<Options>) => {
  const layout = opts?.layout ?? defaultOptions.layout;
  const { OverflowList, overflowListAfterDOMLoaded } = OverflowListFactory();
  const TableOfContents: QuartzComponent = (props: QuartzComponentProps) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { fileData, cfg } = props as any;
    if (!fileData?.toc) {
      return null;
    }

    const id = `toc-${numTocs++}`;
    return (
      <div class={classNames("toc")}>
        <button
          type="button"
          class={fileData.collapseToc ? "collapsed toc-header" : "toc-header"}
          aria-controls={id}
          aria-expanded={!fileData.collapseToc}
        >
          <h3>{i18n(cfg.locale).components.tableOfContents.title}</h3>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            class="fold"
          >
            <polyline points="6 9 12 15 18 9"></polyline>
          </svg>
        </button>
        <OverflowList
          id={id}
          class={fileData.collapseToc ? "collapsed toc-content" : "toc-content"}
        >
          {fileData.toc.map((tocEntry: Record<string, unknown>) => {
            const slug = String(tocEntry.slug);
            const depth = String(tocEntry.depth);
            const text = String(tocEntry.text);
            return (
              <li key={slug} class={`depth-${depth}`}>
                <a href={`#${slug}`} data-for={slug}>
                  {renderTocText(text)}
                </a>
              </li>
            );
          })}
        </OverflowList>
      </div>
    );
  };

  TableOfContents.css = modernStyle;
  TableOfContents.afterDOMLoaded = concatenateResources(
    script,
    overflowListAfterDOMLoaded,
  ) as string;

  const LegacyTableOfContents: QuartzComponent = (props: QuartzComponentProps) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { fileData, cfg } = props as any;
    if (!fileData?.toc) {
      return null;
    }
    return (
      <details class="toc" open={!fileData.collapseToc}>
        <summary>
          <h3>{i18n(cfg.locale).components.tableOfContents.title}</h3>
        </summary>
        <ul>
          {fileData.toc.map((tocEntry: Record<string, unknown>) => {
            const slug = String(tocEntry.slug);
            const depth = String(tocEntry.depth);
            const text = String(tocEntry.text);
            return (
              <li key={slug} class={`depth-${depth}`}>
                <a href={`#${slug}`} data-for={slug}>
                  {renderTocText(text)}
                </a>
              </li>
            );
          })}
        </ul>
      </details>
    );
  };
  LegacyTableOfContents.css = legacyStyle;

  return layout === "modern" ? TableOfContents : LegacyTableOfContents;
}) satisfies QuartzComponentConstructor<Partial<Options>>;
