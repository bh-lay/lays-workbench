import { bookmarkEntityInit } from './entity/bookmark'

function getIDBObject() {
  return window.indexedDB ||
    window.mozIndexedDB ||
    window.webkitIndexedDB ||
    window.msIndexedDB;
}

export function isSupportIDB() {
  var indexedDB = getIDBObject()
  return !!(indexedDB && indexedDB.open)
}
export function getIDBRequest() {
  return new Promise((resolve, reject) => {
    var indexedDB = getIDBObject()
    var request = indexedDB.open('workbench', 1);
    request.onerror = function(event) {
      let error = new Error('建立数据库连接失败！')
      error.__detail = event
      reject(error)
    }
    request.onerror = function(event) {
      let error = new Error('建立数据库连接失败！')
      error.__detail = event
      reject(error)
    }
    request.onsuccess = function() {
      resolve(request.result)
    }
    request.onupgradeneeded = function(event) {
      const db = request.result

      // db = event.target.result;
      const transaction = event.target.transaction;

      transaction.oncomplete = function(event) {    
        resolve(db)
      }

      bookmarkEntityInit(db)
      
    }
  })
}