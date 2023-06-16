import { bookmarkOriginData, BookmarkType } from '../entity/bookmark'

export type queryOptions = {
  parent?: string | null,
  type?: BookmarkType,
  search?: string
}
// 判断当前查询条件跟 bookmark 是否匹配
export function isBookmarkMatchesQuery(item: bookmarkOriginData, query: queryOptions) {
  const parentMatch = query.parent === '*' || query.parent === item.parent
  // parent 不一致，直接返回，避免后续的对比浪费性能
  if (!parentMatch) {
    return false
  }
  let typeMatch = false
  if (query.type) {
    typeMatch = query.type === item.type
  } else {
    typeMatch = true
  }
  return parentMatch && typeMatch
}