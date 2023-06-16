import {bookmarkEntityInit,bookmarkUpgrade } from './upgrades/bookmark'

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
    const request = indexedDB.open('data-store', 2)
    request.onerror = function() {
      const error = new Error('建立数据库连接失败！')
      reject(error)
    }
    request.onerror = function(event: Event) {
      const error = new Error('建立数据库连接失败！')
      reject(error)
    }
    request.onsuccess = function() {
      resolve(request.result)
    }
    request.onblocked = function(event) {
      alert('本地数据升级，请关闭全部页面重新打开！');
    }
    request.onupgradeneeded = async function(event) {
      const target = event.target as CustomIDBTransactionEventTarget
      const db = target.result

      if (!target || !db) {
        return reject(new Error('could not find target'))
      }
      const transaction = target.transaction
      transaction.oncomplete = function() {
        resolve(db)
      }

      const newVersion: number = event.newVersion || 0
      const oldVersion: number = event.oldVersion || 0

      if (oldVersion === 0) {
        // 数据库初始化逻辑
        bookmarkEntityInit(db)
      } else {
        // 数据库升级逻辑
        await bookmarkUpgrade(newVersion, oldVersion, db, transaction)
      }
    }
  })
}