import { getIDBRequest } from '../db.ts'
import { Bookmark } from '../entity/bookmark.ts'
import bookmarkDefaultList from '../default-bookmark-data.ts'
import {
  bookmarkInsertManager,
  bookmarkUpdateManager,
  bookmarkGetManager,
  bookmarkRemoveManager,
  bookmarkListManager,
  bookmarkCountManager,
} from '../manager/bookmark-manager.ts'

function getDbFromParams(db?: IDBDatabase): Promise<IDBDatabase> {
  if (db) {
    return Promise.resolve(db)
  }
  return getIDBRequest()
}
export function insertBookmarkService(bookmarkItem: any, db?: IDBDatabase) {
  
  return getDbFromParams(db).then((db: IDBDatabase) => {
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
    console.log(2)
    return bookmarkInsertManager(db, bookmarkItem)
  })
}
export function getBookmarkService(bookmarkId: string) {
  return getIDBRequest().then((db: IDBDatabase) => {
    return bookmarkGetManager(db, bookmarkId)
  })
}

export function updateBookmarkService(bookmarkItem: any) {
  return getIDBRequest().then((db: IDBDatabase) => {
    return bookmarkUpdateManager(db, bookmarkItem)
  })
}
export function removeBookmarkService(bookmarkId: string) {
  return getIDBRequest().then((db: IDBDatabase) => {
    return bookmarkRemoveManager(db, bookmarkId)
  })
}

export function listBookmarkService() {
  return getIDBRequest().then((db: IDBDatabase) => {
    return bookmarkListManager(db).then((data: Bookmark[]) => {
      // 若数据为空，则将使用默认数据填充
      if (data.length === 0) {
        bookmarkDefaultList.forEach((item: Bookmark) => {
          data.push(new Bookmark(item))
        });
      }
      return data
    })
  })
}