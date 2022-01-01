import { bookmarkCountManager, bookmarkInsertListManager } from '../manager/bookmark-manager'
import { bookmarkOriginData } from '../entity/bookmark'

export function loadDefaultData() {
  return fetch('/static-api/default-data.json')
    .then(res => res.json())
    .then(json => {
      return {
        bookmarks: (json.bookmarks || []) as bookmarkOriginData[],
      }
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