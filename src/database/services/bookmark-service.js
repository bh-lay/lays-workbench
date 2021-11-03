import { getIDBRequest } from '../db.js'
import { Bookmark } from '../entity/bookmark.ts'

function insertMethod(db, bookmarkItem) {
  return new Promise((resolve, reject) => {
    var bookmark = new Bookmark(bookmarkItem)
    var request = db.transaction(['bookmark'], 'readwrite')
      .objectStore('bookmark')
      .add(bookmark);

    request.onsuccess = function (event) {
      // 数据写入成功
      resolve(event)
    };

    request.onerror = function (event) {
      // 数据写入失败
      let error = new Error('数据写入失败')
      error.__detail = event
      reject(error)
    }
  })
}

function updateMethod(db, bookmarkItem) {
  return new Promise((resolve, reject) => {
    var bookmark = new Bookmark(bookmarkItem)
    var request = db.transaction(['bookmark'], 'readwrite')
      .objectStore('bookmark')
      .put(bookmark);

    request.onsuccess = function (event) {
      // 数据写入成功
      resolve(event)
    };

    request.onerror = function (event) {
      // 数据写入失败
      let error = new Error('数据写入失败')
      error.__detail = event
      reject(error)
    }
  })
}

function getMethod(db, bookmarkId) {
  return new Promise((resolve, reject) => {
    var transaction = db.transaction(['bookmark']);
    var objectStore = transaction.objectStore('bookmark');
    var request = objectStore.get(bookmarkId);
  
    request.onsuccess = function (event) {
      if (request.result) {
        var bookmark = new Bookmark(request.result)
        // 数据读取成功
        resolve(bookmark)
      } else {
        let error = new Error('数据读取失败')
        error.__detail = event
        reject(error)
      }
      
    };
    request.onerror = function (event) {
      // 数据写入失败
      let error = new Error('数据写入失败')
      error.__detail = event
      reject(error)
    }
  })
}
function removeMethod(db, bookmarkId) {
  return new Promise((resolve, reject) => {
    var transaction = db.transaction(['bookmark']);
    var objectStore = transaction.objectStore('bookmark');
    var request = objectStore.delete(bookmarkId);
  
    request.onsuccess = function (event) {
      if (request.result) {
        var bookmark = new Bookmark(request.result)
        // 数据读取成功
        resolve(bookmark)
      } else {
        let error = new Error('数据读取失败')
        error.__detail = event
        reject(error)
      }
      
    };
    request.onerror = function (event) {
      // 数据写入失败
      let error = new Error('数据写入失败')
      error.__detail = event
      reject(error)
    }
  })
}

function list(db) {
  return new Promise((resolve, reject) => {
    const objectStore = db.transaction('bookmark').objectStore('bookmark');
    const request = objectStore.openCursor()
    
    const bookmarkList = []
    request.onsuccess = function (event) {
      var cursor = event.target.result;
      if (cursor) {
        bookmarkList.push(new Bookmark(cursor.value))
        cursor.continue();
      } else {
        resolve(bookmarkList)
      }
    };

    request.onerror = function (event) {
      // 数据写入失败
      let error = new Error('数据读取失败')
      error.__detail = event
      reject(error)
    }
  })
}
export function insertBookmarkService(bookmarkItem) {
  return getIDBRequest().then(db => {
    return insertMethod(db, bookmarkItem)
  })
}
export function getBookmarkService(bookmarkId) {
  return getIDBRequest().then(db => {
    return getMethod(db, bookmarkId)
  })
}

export function updateBookmarkService(bookmarkItem) {
  return getIDBRequest().then(db => {
    return updateMethod(db, bookmarkItem)
  })
}
export function removeBookmarkService() {
  return getIDBRequest().then(db => {
    return removeMethod(db, bookmarkItem)
  })
}

export function listBookmarkService() {
  return getIDBRequest().then(db => {
    return list(db)
  })
}