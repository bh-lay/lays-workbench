import { BookmarkType } from '../entity/bookmark'

export type queryOptions = {
  parent?: string | null,
  type?: BookmarkType,
  search?: string
}