import { QuartzComponent } from '@quartz-community/types';

interface D3Config {
    drag: boolean;
    zoom: boolean;
    depth: number;
    showNeighborLinks: boolean;
    neighborLinkDepth: number;
    scale: number;
    repelForce: number;
    centerForce: number;
    linkDistance: number;
    fontSize: number;
    opacityScale: number;
    nodeSize: number;
    linkWidth: number;
    linkOpacity: number;
    showArrows: boolean;
    textOpacity: number;
    alwaysShowLabels?: boolean;
    linkStrength: number;
    centerCurrentNode?: boolean;
    hideOrphans?: boolean;
    removeNodes: string[];
    removeTags: string[];
    showTags: boolean;
    focusOnHover?: boolean;
    enableRadial?: boolean;
}
interface GraphOptions {
    localGraph?: Partial<D3Config>;
    globalGraph?: Partial<D3Config>;
}
declare const _default: (userOpts?: Partial<GraphOptions>) => QuartzComponent;

export { type D3Config, _default as Graph, type GraphOptions };
