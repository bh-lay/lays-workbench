import { bookmarkEntityInit } from './entity/bookmark'

function getIDBObject() {
  return window.indexedDB ||
    window.mozIndexedDB ||
    window.webkitIndexedDB ||
    window.msIndexedDB
}

export function isSupportIDB() {
  const indexedDB = getIDBObject()
  return !!(indexedDB && indexedDB.open)
}
export function getIDBRequest(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const indexedDB = getIDBObject()
    const request = indexedDB.open('data-store', 1)
    request.onerror = function() {
      const error = new Error('建立数据库连接失败！')
      // error.__detail = event
      reject(error)
    }
    request.onerror = function() {
      const error = new Error('建立数据库连接失败！')
      // error.__detail = event
      reject(error)
    }
    request.onsuccess = function() {
      resolve(request.result)
    }
    request.onupgradeneeded = function(event) {
      const db = request.result
      const target = event.target as CustomIDBTransactionEventTarget
      // db = event.target.result;
      if (!target) {
        reject(new Error('could not find target'))
      } else {
        const transaction = target.transaction
        transaction.oncomplete = function() {
          resolve(db)
        }
        // 此处处理数据库初始化、升级逻辑
        bookmarkEntityInit(db)
      }
    }
  })
}