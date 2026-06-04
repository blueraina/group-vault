interface ContentMetaOptions {
  showReadingTime: boolean
  showWordCount: boolean
  showComma: boolean
  wordsPerMinute: number
}

declare const _default: (opts?: Partial<ContentMetaOptions>) => unknown

export { _default as ContentMeta, type ContentMetaOptions }
