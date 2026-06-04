export { TableOfContents } from './components/index.js';
import { QuartzTransformerPlugin } from '@quartz-community/types';
export { QuartzTransformerPlugin } from '@quartz-community/types';

interface TableOfContentsTransformerOptions {
    maxDepth: 1 | 2 | 3 | 4 | 5 | 6;
    minEntries: number;
    showByDefault: boolean;
    collapseByDefault: boolean;
}
interface TocEntry {
    depth: number;
    text: string;
    slug: string;
}
declare const TableOfContentsTransformer: QuartzTransformerPlugin<Partial<TableOfContentsTransformerOptions>>;

export { TableOfContentsTransformer, type TableOfContentsTransformerOptions, type TocEntry };
