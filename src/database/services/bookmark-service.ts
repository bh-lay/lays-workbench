import { getIDBRequest } from '../db'
import { Bookmark, BookmarkType } from '../entity/bookmark'
import { autoInitDefaultData, loadDefaultData } from '../utils/init-bookmark-to-db'
import {
  bookmarkInsertManager,
  bookmarkUpdateManager,
  bookmarkGetManager,
  bookmarkRemoveManager,
  bookmarkListManager,
  bookmarkResetSortManager,
  bookmarkClearManager,
  bookmarkCountManager,
  bookmarkSearchManager,
} from '../manager/bookmark-manager'
import { isBookmarkMatchesQuery, queryOptions } from '../utils/bookmark-query-matches'

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

// 通过默认数据加载数据
async function getListByDefault(db: IDBDatabase, query: queryOptions) {
  const data: Bookmark[] = []
  // 若数据库中有数据，则放弃查找
  const count = await bookmarkCountManager(db)
  if (count > 0) {
    return data
  }
  // 加载远端数据
  const defaultData = await loadDefaultData()
  defaultData.bookmarks.forEach(item => {
    // 判断是否匹配
    if (isBookmarkMatchesQuery(item, query)) {
      data.push(new Bookmark(item))
    }
  })
  return data
}
export async function bookmarkListService(query: queryOptions): Promise<Bookmark[]> {
  const db: IDBDatabase = await getIDBRequest()
  let data: Bookmark[] = await bookmarkListManager(db, query)
  // 若此时数据为空，则尝试使用默认数据填充
  if (data.length === 0) {
    data = await getListByDefault(db, query)
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

// 数据是否为空检查服务
export async function bookmarkIsEmptyService(): Promise<boolean> {
  const db: IDBDatabase = await getIDBRequest()
  const count = await bookmarkCountManager(db)
  return count === 0
}

// 搜索书签
export async function bookmarkSearchService(searchKey: string): Promise<Bookmark[]> {
  const db: IDBDatabase = await getIDBRequest()
  let data: Bookmark[] = await bookmarkSearchManager(db, searchKey)
  return data
}
