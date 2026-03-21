/** Raw API values returned by the `visible` field in global settings */
export const VISIBLE = {
  BOOK: 'book',
  CHAPTER: 'chapter',
} as const;

export type VisibleValue = (typeof VISIBLE)[keyof typeof VISIBLE];