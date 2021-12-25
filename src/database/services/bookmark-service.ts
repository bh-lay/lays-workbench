import { getIDBRequest } from '../db'
import { Bookmark, BookmarkType } from '../entity/bookmark'
import bookmarkDefaultList from '../utils/default-bookmark-data'
import initBookmark2db from '../utils/init-bookmark-to-db'
import {
  bookmarkInsertManager,
  bookmarkUpdateManager,
  bookmarkGetManager,
  bookmarkRemoveManager,
  bookmarkListManager,
  bookmarkCountManager,
  bookmarkResetSortManager,
} from '../manager/bookmark-manager'
import { queryOptions } from '../utils/types-define'

function getDbFromParams(db?: IDBDatabase): Promise<IDBDatabase> {
  if (db) {
    return Promise.resolve(db)
  }
  return getIDBRequest()
}
export function bookmarkInsertService(bookmarkItem: any, db?: IDBDatabase): Promise<Bookmark> {
  return getDbFromParams(db)
    .then((db: IDBDatabase) => {
      return bookmarkCountManager(db).then((count: number) => {
        if (count > 0) {
          return db
        }
        return initBookmark2db(db).then(() => {
          return db
        })
      })
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

export function bookmarkUpdateService(bookmarkItem: any, db?: IDBDatabase) {
  return getDbFromParams(db)
    .then((db: IDBDatabase) => {
      return bookmarkCountManager(db).then((count: number) => {
        if (count > 0) {
          return db
        }
        return initBookmark2db(db).then(() => {
          return db
        })
      })
    })
    .then((db: IDBDatabase) => {
      return bookmarkUpdateManager(db, bookmarkItem)
    })
}
export async function bookmarkRemoveService(bookmarkId: string) {
  const db: IDBDatabase = await getIDBRequest()
  await initBookmark2db(db)
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

export function bookmarkListService(params: queryOptions): Promise<Bookmark[]> {
  return getIDBRequest().then((db: IDBDatabase) => {
    return bookmarkListManager(db, params).then((data: Bookmark[]) => {
      if (!params || !params.parent) {
        // 若数据为空，则将使用默认数据填充
        if (data.length === 0) {
          bookmarkDefaultList.forEach((item: object) => {
            data.push(new Bookmark(item))
          })
        }
      }
      data.sort((A, B) => B.sort - A.sort)
      return data
    })
  })
}

export async function bookmarkResortService(idList: string[]) {
  const db: IDBDatabase = await getIDBRequest()
  await initBookmark2db(db)
  return await bookmarkResetSortManager(db, idList)
}
