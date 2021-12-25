import { Bookmark, bookmarkOriginData } from '../entity/bookmark'
import { queryOptions } from '../utils/types-define'

export function bookmarkInsertManager(db: IDBDatabase, bookmarkItem: Bookmark): Promise<Bookmark>  {
  return new Promise((resolve, reject) => {
    const a = db.transaction(['bookmark'], 'readwrite')
    const b = a.objectStore('bookmark')
    const request = b.add(bookmarkItem.parse())

    request.onsuccess = function () {
      // console.log('insert event', event)
      // 数据写入成功
      resolve(bookmarkItem)
    }

    request.onerror = function (error) {
      console.log('error', error)
      // 数据写入失败
      // error.__detail = event
      reject(new Error('数据写入失败'))
    }
  })
}

export function bookmarkUpdateManager(db: IDBDatabase, bookmarkItem: Bookmark) {
  return new Promise((resolve, reject) => {
    const request = db.transaction(['bookmark'], 'readwrite')
      .objectStore('bookmark')
      .put(bookmarkItem.parse())

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

export function bookmarkGetManager(db: IDBDatabase, bookmarkId: string): Promise<Bookmark> {
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
    request.onerror = function () {
      // 数据写入失败
      const error = new Error('数据删除失败')
      // error.__detail = event
      reject(error)
    }
  })
}
// 判断当前查询条件跟 bookmark 是否匹配
function isBookmarkMatchesQuery(item: bookmarkOriginData, query: queryOptions) {
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
      const target = event.target as CustomIDBCursorEventTarget
      const cursor = target.result
      if (cursor) {
        const value = cursor.value as bookmarkOriginData
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
      const target = event.target as CustomIDBCountEventTarget
      if (!target) {
        reject(new Error('could not find target'))
      } else {
        const count = typeof target.result === 'number' ? target.result : 0
        resolve(count)
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
      const cursor = (event.target as CustomIDBCursorEventTarget).result
      if (cursor) {
        const cursorValue = cursor.value as bookmarkOriginData
        if(cursorValue.id) {
          const newSortValue = idSortMap.get(cursorValue.id)
          if (newSortValue) {
            // 如果当前书签在 map 中，则修改
            cursorValue.sort = newSortValue
            objectStore.put(cursorValue)
          }
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