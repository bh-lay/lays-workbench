import { getIDBRequest } from '../db'
import { Bookmark, BookmarkType, bookmarkOriginData } from '../entity/bookmark'
import bookmarkDefaultList from '../utils/default-bookmark-data'
import { autoInitDefaultData } from '../utils/init-bookmark-to-db'
import {
  bookmarkInsertManager,
  bookmarkInsertListManager,
  bookmarkUpdateManager,
  bookmarkGetManager,
  bookmarkRemoveManager,
  bookmarkListManager,
  bookmarkResetSortManager,
  bookmarkClearManager,
} from '../manager/bookmark-manager'
import { queryOptions } from '../utils/types-define'

function getDbFromParams(db?: IDBDatabase): Promise<IDBDatabase> {
  if (db) {
    return Promise.resolve(db)
  }
  return getIDBRequest()
}

export function bookmarkInsertService(bookmarkItem: Bookmark, db?: IDBDatabase): Promise<Bookmark> {
  return getDbFromParams(db)
    .then((db: IDBDatabase) => {
      return autoInitDefaultData(db)
    })
    .then((db: IDBDatabase) => {
      return bookmarkInsertManager(db, bookmarkItem)
    })
}
export function bookmarkGetService(bookmarkId: string) {
  return getIDBRequest().then((db: IDBDatabase) => {
    return bookmarkGetManager(db, bookmarkId)
  })
}

export async function bookmarkUpdateService(bookmarkItem: Bookmark, indexdb?: IDBDatabase) {
  const db = await getDbFromParams(indexdb)
  await autoInitDefaultData(db)
  return await bookmarkUpdateManager(db, bookmarkItem)
}
export async function bookmarkRemoveService(bookmarkId: string) {
  const db: IDBDatabase = await getIDBRequest()
  await autoInitDefaultData(db)
  const bookmarkItem: Bookmark = await bookmarkGetManager(db, bookmarkId)
  // 不存在，则不继续执行
  if (!bookmarkItem) {
    return
  }
  if (bookmarkItem.type === BookmarkType.folder) {
    // 被删除的是组，则检查组内是否还有元素
    const childBookmarkList: Bookmark[] = await bookmarkListManager(db, {
      parent: bookmarkId,
    })
    if (childBookmarkList.length) {
      throw Error('分组内还有链接，暂不允许删除！')
    }
  }
  // 执行删除逻辑
  return await bookmarkRemoveManager(db, bookmarkId)
}

export async function bookmarkListService(params: queryOptions): Promise<Bookmark[]> {
  const db: IDBDatabase = await getIDBRequest()
  const data: Bookmark[] = await bookmarkListManager(db, params)
  // 若没有 parent 参数，则认为是请求桌面
  // 若此时数据为空，则将使用默认数据填充
  if ((!params || !params.parent) && data.length === 0) {
    bookmarkDefaultList.forEach(item => {
      data.push(new Bookmark(item))
    })
  }
  // 处理好排序，返回
  data.sort((A, B) => B.sort - A.sort)
  return data
}

export async function bookmarkResortService(idList: string[]) {
  const db: IDBDatabase = await getIDBRequest()
  await autoInitDefaultData(db)
  return await bookmarkResetSortManager(db, idList)
}
// 数据导入服务
export async function bookmarkImportService(bookmarks: bookmarkOriginData[]) {
  const db: IDBDatabase = await getIDBRequest()
  return await bookmarkInsertListManager(db, bookmarks)
}

// 数据清空服务
export async function bookmarkClearService() {
  const db: IDBDatabase = await getIDBRequest()
  return await bookmarkClearManager(db)
}


