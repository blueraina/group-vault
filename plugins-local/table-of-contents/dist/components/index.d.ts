import { QuartzComponent } from '@quartz-community/types';

interface Options {
    layout: "modern" | "legacy";
}
declare const _default: (opts?: Partial<Options>) => QuartzComponent;

export { _default as TableOfContents };
