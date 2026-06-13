interface CommentsOptions {
  apiBase: string
  maxLength: number
  katexScript: string
}

declare const _default: (opts?: Partial<CommentsOptions>) => unknown

export { _default as Comments, type CommentsOptions }
