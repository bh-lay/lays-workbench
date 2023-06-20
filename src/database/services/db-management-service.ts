import { getIDBRequest, dbVersioon } from '../db'
import { bookmarkOriginData, Bookmark } from '../entity/bookmark'
import { bookmarkListService } from './bookmark-service'
import {
  bookmarkInsertListManager,
  bookmarkClearManager,
} from '../manager/bookmark-manager'

export type dbBackupDataType = {
  version: number,
  bookmarks: Bookmark[]
}
export async function dbExportService(): Promise<dbBackupDataType> {
  const bookmarks = await bookmarkListService({
    parent: '*',
  })
  return {
    bookmarks,
    version: dbVersioon
  }
}
// 数据导入服务
export async function dbImportService(data: {
  version?: number,
  bookmarks?: bookmarkOriginData[]
}) {
  if (data.version !== dbVersioon) {
    throw new Error('数据版本不匹配，无法导入！')
  }
  const bookmarks = data.bookmarks
  if (typeof bookmarks !== 'undefined') {
    const db: IDBDatabase = await getIDBRequest()
    return await bookmarkInsertListManager(db, bookmarks)
  }
  
}

// 数据清空服务
export async function dbEmptyService() {
  const db: IDBDatabase = await getIDBRequest()
  return await bookmarkClearManager(db)
}
