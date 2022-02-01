import { bookmarkCountManager, bookmarkInsertListManager } from '../manager/bookmark-manager'
import { bookmarkOriginData } from '../entity/bookmark'

type defaultData = {
  bookmarks: bookmarkOriginData[]
}
// 默认数据缓存
let defaultDataCache: defaultData | null = null
// 获取默认数据方法
export function loadDefaultData(): Promise<defaultData> {
  if (defaultDataCache) {
    return Promise.resolve(defaultDataCache)
  }
  return fetch('/static-api/default-data.json')
    .then(res => res.json())
    .then(json => {
      defaultDataCache = {
        bookmarks: (json.bookmarks || []) as bookmarkOriginData[],
      }
      return defaultDataCache
    })
}
// 自动填充默认数据
export async function autoInitDefaultData(db: IDBDatabase) {
  const count = await bookmarkCountManager(db)
  if (count > 0) {
    return db
  }
  const defaultData = await loadDefaultData()
  await bookmarkInsertListManager(db, defaultData.bookmarks)
  return db
}