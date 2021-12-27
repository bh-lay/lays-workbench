import bookmarkDefaultList from './default-bookmark-data'
import { bookmarkCountManager, bookmarkInsertListManager } from '../manager/bookmark-manager'

// 自动填充默认数据
export async function autoInitDefaultData(db: IDBDatabase) {
  const count = await bookmarkCountManager(db)
  if (count > 0) {
    return db
  }
  await bookmarkInsertListManager(db, bookmarkDefaultList, false)
  return db
}