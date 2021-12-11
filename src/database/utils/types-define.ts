import { Bookmark, BookmarkType } from '../entity/bookmark';

export type queryOptions = {
  parent?: string,
  type?: BookmarkType,
  search?: string
}