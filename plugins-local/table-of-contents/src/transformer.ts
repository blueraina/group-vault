import type { QuartzTransformerPlugin } from "@quartz-community/types";
import type { Root } from "mdast";
import type { VFile } from "vfile";
import { visit } from "unist-util-visit";
import { toString } from "mdast-util-to-string";
import Slugger from "github-slugger";

export interface TableOfContentsTransformerOptions {
  maxDepth: 1 | 2 | 3 | 4 | 5 | 6;
  minEntries: number;
  showByDefault: boolean;
  collapseByDefault: boolean;
}

const defaultOptions: TableOfContentsTransformerOptions = {
  maxDepth: 3,
  minEntries: 1,
  showByDefault: true,
  collapseByDefault: false,
};

export interface TocEntry {
  depth: number;
  text: string;
  slug: string; // this is just the anchor (#some-slug), not the canonical slug
}

const slugAnchor = new Slugger();

function toTocDisplayText(node: unknown): string {
  if (!node || typeof node !== "object") return "";

  const typedNode = node as {
    type?: string;
    value?: unknown;
    children?: unknown[];
  };

  if (typedNode.type === "inlineMath") return `$${String(typedNode.value ?? "")}$`;
  if (typedNode.type === "math") return `$$${String(typedNode.value ?? "")}$$`;
  if (typeof typedNode.value === "string") return typedNode.value;
  if (Array.isArray(typedNode.children)) {
    return typedNode.children.map((child) => toTocDisplayText(child)).join("");
  }

  return "";
}

export const TableOfContentsTransformer: QuartzTransformerPlugin<
  Partial<TableOfContentsTransformerOptions>
> = (userOpts) => {
  const opts = { ...defaultOptions, ...userOpts };
  return {
    name: "TableOfContents",
    markdownPlugins() {
      return [
        () => {
          return async (tree: Root, file: VFile) => {
            const frontmatter = file.data.frontmatter as Record<string, unknown> | undefined;
            const display = frontmatter?.enableToc ?? opts.showByDefault;
            if (display) {
              slugAnchor.reset();
              const toc: TocEntry[] = [];
              let highestDepth: number = opts.maxDepth;
              visit(tree, "heading", (node) => {
                if (node.depth <= opts.maxDepth) {
                  const slugText = toString(node);
                  const text = toTocDisplayText(node);
                  highestDepth = Math.min(highestDepth, node.depth);
                  toc.push({
                    depth: node.depth,
                    text,
                    slug: slugAnchor.slug(slugText),
                  });
                }
              });

              if (toc.length > 0 && toc.length > opts.minEntries) {
                file.data.toc = toc.map((entry) => ({
                  ...entry,
                  depth: entry.depth - highestDepth,
                }));
                file.data.collapseToc = opts.collapseByDefault;
              }
            }
          };
        },
      ];
    },
  };
};
