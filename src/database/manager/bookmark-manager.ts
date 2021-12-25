import { Bookmark } from '../entity/bookmark'
import { queryOptions } from '../utils/types-define'

export function bookmarkInsertManager(db: IDBDatabase, bookmarkItem: any): Promise<Bookmark>  {
  return new Promise((resolve, reject) => {
    const bookmark = new Bookmark(bookmarkItem)
    const request = db.transaction(['bookmark'], 'readwrite')
      .objectStore('bookmark')
      .add(bookmark)

    request.onsuccess = function () {
      // console.log('insert event', event)
      // 数据写入成功
      resolve(bookmarkItem)
    }

    request.onerror = function () {
      // 数据写入失败
      const error = new Error('数据写入失败')
      // error.__detail = event
      reject(error)
    }
  })
}

export function bookmarkUpdateManager(db: IDBDatabase, bookmarkItem: any) {
  return new Promise((resolve, reject) => {
    const bookmark = new Bookmark(bookmarkItem)
    const request = db.transaction(['bookmark'], 'readwrite')
      .objectStore('bookmark')
      .put(bookmark)

    request.onsuccess = function (event) {
      // 数据写入成功
      resolve(event)
    }

    request.onerror = function () {
      // 数据写入失败
      const error = new Error('数据写入失败')
      // error.__detail = event
      reject(error)
    }
  })
}

export function bookmarkGetManager(db: IDBDatabase, bookmarkId: any): Promise<Bookmark> {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(['bookmark'])
    const objectStore = transaction.objectStore('bookmark')
    const request = objectStore.get(bookmarkId)
  
    request.onsuccess = function () {
      if (request.result) {
        const bookmark = new Bookmark(request.result)
        // 数据读取成功
        resolve(bookmark)
      } else {
        const error = new Error('数据读取失败')
        // error.__detail = event
        reject(error)
      }
    }
    request.onerror = function () {
      // 数据写入失败
      const error = new Error('数据写入失败')
      // error.__detail = event
      reject(error)
    }
  })
}
export function bookmarkRemoveManager(db: IDBDatabase, bookmarkId: string) {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(['bookmark'], 'readwrite')
    const objectStore = transaction.objectStore('bookmark')
    const request = objectStore.delete(bookmarkId)
  
    request.onsuccess = function () {
      // 数据读取成功
      resolve(true)
    }
    request.onerror = function (event) {
      // 数据写入失败
      const error = new Error('数据删除失败')
      // error.__detail = event
      reject(error)
    }
  })
}

// 判断当前查询条件跟 bookmark 是否匹配
function isBookmarkMatchesQuery(item: any, query: queryOptions) {
  let parentMatch = false
  if (query.parent) {
    parentMatch = query.parent === '*' || query.parent === item.parent
  } else {
    parentMatch = !item.parent
  }
  // parent 不一致，直接返回，避免后续的对比浪费性能
  if (!parentMatch) {
    return
  }
  let typeMatch = false
  if (query.type) {
    typeMatch = query.type === item.type
  } else {
    typeMatch = true
  }
  return parentMatch && typeMatch
}
export function bookmarkListManager(db: IDBDatabase, query: queryOptions): Promise<Bookmark[]> {
  return new Promise((resolve, reject) => {
    const objectStore = db.transaction('bookmark').objectStore('bookmark')
    const request = objectStore.openCursor()
    const bookmarkList: Bookmark[] = []
    request.onsuccess = function (event) {
      if (!event.target) {
        reject(new Error('could not find target'))
        return
      }
      const cursor: any = (event.target as CustomIDBEventTarget).result
      if (cursor) {
        const value: any = cursor.value
        if (isBookmarkMatchesQuery(value, query)) {
          bookmarkList.push(new Bookmark(value))
        }
        cursor.continue()
      } else {
        resolve(bookmarkList)
      }
    }

    request.onerror = function () {
      // 数据写入失败
      const error = new Error('数据读取失败')
      // error.__detail = event
      reject(error)
    }
  })
}
export function bookmarkCountManager(db: IDBDatabase): Promise<number> {
  return new Promise((resolve, reject) => {
    
    const objectStore = db.transaction('bookmark').objectStore('bookmark')
    const request = objectStore.count()
  
    request.onsuccess = function (event) {
      if (!event.target) {
        reject(new Error('could not find target'))
      } else {
        resolve((event.target as CustomIDBEventTarget).result)
      }
    }

    request.onerror = function () {
      // 数据写入失败
      const error = new Error('数据读取失败')
      // error.__detail = event
      reject(error)
    }
  })
}
export function bookmarkResetSortManager(db: IDBDatabase, idList: string[]): Promise<Map<string, number>> {
  return new Promise((resolve, reject) => {
    // id -> sort 值映射 Map
    const idSortMap = idList.reduce((result: Map<string, number>, id: string, index: number) => {
      result.set(id, idList.length - index)
      return result
    }, new Map())
    // 创建数据库 store 对象
    const objectStore = db.transaction('bookmark', 'readwrite').objectStore('bookmark')
    // 打开游标
    const request = objectStore.openCursor()
    request.onsuccess = function (event) {
      if (!event.target) {
        reject(new Error('could not find target'))
        return
      }
      const cursor: any = (event.target as CustomIDBEventTarget).result
      if (cursor) {
        const value: any = cursor.value
        const newSortValue = idSortMap.get(value.id)
        if (newSortValue) {
          // 如果当前书签在 map 中，则修改
          value.sort = newSortValue
          objectStore.put(value)
        }
        cursor.continue()
      } else {
        resolve(idSortMap)
      }
    }

    request.onerror = function () {
      // 数据写入失败
      const error = new Error('数据设置失败')
      // error.__detail = event
      reject(error)
    }
  })
}