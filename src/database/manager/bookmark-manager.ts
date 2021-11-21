import { Bookmark } from '../entity/bookmark.ts'

export function bookmarkInsertManager(db: IDBDatabase, bookmarkItem: any) {
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
      // error.__detail = event
      reject(error)
    }
  })
}

export function bookmarkUpdateManager(db: IDBDatabase, bookmarkItem: any) {
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
      // error.__detail = event
      reject(error)
    }
  })
}

export function bookmarkGetManager(db: IDBDatabase, bookmarkId: any) {
  return new Promise((resolve, reject) => {
    var transaction = db.transaction(['bookmark']);
    var objectStore = transaction.objectStore('bookmark');
    var request = objectStore.get(bookmarkId);
  
    request.onsuccess = function () {
      if (request.result) {
        var bookmark = new Bookmark(request.result)
        // 数据读取成功
        resolve(bookmark)
      } else {
        let error = new Error('数据读取失败')
        // error.__detail = event
        reject(error)
      }
      
    };
    request.onerror = function (event) {
      // 数据写入失败
      let error = new Error('数据写入失败')
      // error.__detail = event
      reject(error)
    }
  })
}
export function bookmarkRemoveManager(db: IDBDatabase, bookmarkId: string) {
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
        // error.__detail = event
        reject(error)
      }
      
    };
    request.onerror = function (event) {
      // 数据写入失败
      let error = new Error('数据写入失败')
      // error.__detail = event
      reject(error)
    }
  })
}

export function bookmarkListManager(db: IDBDatabase): Promise<Bookmark[]> {
  return new Promise((resolve, reject) => {
    const objectStore = db.transaction('bookmark').objectStore('bookmark');
    const request = objectStore.openCursor()
    
    const bookmarkList: Bookmark[] = []
    request.onsuccess = function (event) {
      var cursor: any = event.target.result;
      if (cursor) {
        const value: any = cursor.value
        bookmarkList.push(new Bookmark(value))
        cursor.continue();
      } else {
        resolve(bookmarkList)
      }
    };

    request.onerror = function (event) {
      // 数据写入失败
      let error = new Error('数据读取失败')
      // error.__detail = event
      reject(error)
    }
  })
}
export function bookmarkCountManager(db: IDBDatabase): Promise<Bookmark[]> {
  return new Promise((resolve, reject) => {
    
    const objectStore = db.transaction('bookmark').objectStore('bookmark');
    const request = objectStore.count()
  
    request.onsuccess = function (event) {
      resolve(event.target.result)
    };

    request.onerror = function (event) {
      // 数据写入失败
      let error = new Error('数据读取失败')
      // error.__detail = event
      reject(error)
    }
  })
}
