// upgrade: 1 -> 2

type dataItem = {
  [key: string]: string | number | null | undefined
}

// 将第一版本中 bookmark 的 parentId 转换为标准结构的 parentId
function upgradeParentId(
  currentBookmark: dataItem,
  objectStore: IDBObjectStore
): Promise<boolean> {
  return new Promise((resolve) => {
    let newParentId = ''
    if (!currentBookmark.parent) {
      // 将为空的 parentId，强制指定为默认桌面
      newParentId = 'desktop-default'
    } else if (currentBookmark.parent === 'root') {
      // 将为 root 的 parentId，强制指定为书签收藏
      newParentId = 'bookmark-collection'
    }
    if (newParentId) {
      currentBookmark.parent = newParentId
      const putRequest = objectStore.put(currentBookmark)
      putRequest.onsuccess = function () {
        resolve(true)
      }
      putRequest.onerror = function () {
        resolve(false)
      }
    } else {
      resolve(true)
    }
  })
}
function fixAllParentId(objectStore: IDBObjectStore): Promise<boolean> {
  return new Promise((resolve) => {
    const request = objectStore.openCursor()
    request.onsuccess = function (event) {
      if (!event.target) {
        resolve(false)
        return
      }
      const target = event.target as CustomIDBCursorEventTarget
      const cursor = target.result
      if (cursor) {
        upgradeParentId(cursor.value, objectStore).finally(() => {
          cursor.continue()
        })
      } else {
        resolve(true)
      }
    }
    request.onerror = function () {
      resolve(false)
    }
  })
}

function addBookmark(objectStore: IDBObjectStore, data: unknown) {
  return new Promise((resolve) => {
    const request = objectStore.add(data)
    request.onsuccess = function () {
      resolve(true)
    }
    request.onerror = function () {
      resolve(false)
    }
  })
}

function getBookmarkCount(objectStore: IDBObjectStore): Promise<number> {
  return new Promise((resolve) => {
    const request = objectStore.count()
    request.onsuccess = function (event) {
      const target = event.target as CustomIDBCountEventTarget
      if (!target || typeof target.result !== 'number') {
        resolve(0)
      } else {
        resolve(target.result || 0)
      }
    }
    request.onerror = function () {
      resolve(0)
    }
  })
}
async function addDesktopDefaultBookmark(objectStore: IDBObjectStore) {
  await addBookmark(objectStore, {
    id: 'desktop-default',
    parent: 'desktop',
    name: '在搬砖',
    undercoat: '#177cb0',
    type: 4,
    size: 1,
    icon: 'mdi:worker',
    sort: 0,
    value: '{"wallpaper": "https://w.wallhaven.cc/full/nz/wallhaven-nzkggo.jpg"}',
    desc: '',
  })
  await addBookmark(objectStore, {
    id: 'desktop-fish',
    parent: 'desktop',
    name: '在摸鱼',
    undercoat: '#4caf50',
    type: 4,
    size: 1,
    icon: 'mdi:fish',
    sort: 0,
    value: '{"wallpaper": "https://w.wallhaven.cc/full/wy/wallhaven-wyewex.jpg"}',
    desc: '',
  })
}
export default async function bookmarkUpgrade (
  db: IDBDatabase,
  transaction: IDBTransaction
): Promise<boolean> {
  if (!db.objectStoreNames.contains('bookmark')) {
    return false
  }
  const objectStore = transaction.objectStore('bookmark')
  const bookmarkCount = await getBookmarkCount(objectStore)
  if (bookmarkCount > 0) {
    await fixAllParentId(objectStore)
    await addDesktopDefaultBookmark(objectStore)
  }
  return true
}
