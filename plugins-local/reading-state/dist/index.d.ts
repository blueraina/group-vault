interface ReadingStateOptions {
  readLabel: string
  readActiveLabel: string
  favoriteLabel: string
  favoriteActiveLabel: string
}

declare const _default: (opts?: Partial<ReadingStateOptions>) => unknown

export { _default as ReadingState, type ReadingStateOptions }
