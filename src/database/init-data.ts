import { Bookmark } from './entity/bookmark.ts'
import { BookmarkType, BookmarkSize } from './entity/bookmark.ts'

const bookmarkDefaultList = [
  {
    name: '正则可视化',
    type: BookmarkType.Dialog,
    size: BookmarkSize.small,
    undercoat: '#2196f3',
    value: 'regVisual',
    icon: 'mdi:regex'
  },
  {
    name: 'JSON 格式化',
    type: BookmarkType.Dialog,
    size: BookmarkSize.small,
    undercoat: '#f44336',
    value: 'jsonFormatter',
    icon: 'mdi:code-json'
  }
]
export default function initData(db: IDBDatabase) {
  return new Promise((resolve, reject) => {

    const transaction = db.transaction(['bookmark'], 'readwrite')
    const bookmarkObjectStore = transaction.objectStore('bookmark')
      
    for(let i = 0, total = bookmarkDefaultList.length; i < total; i++) {
      var bookmark = new Bookmark(bookmarkDefaultList[i])
      console.log('bookmark', bookmark)
      bookmarkObjectStore.add(bookmark);
    }
    transaction.onsuccess = function (event) {
      // 数据写入成功
      resolve(event)
    };

    transaction.onerror = function (event) {
      // 数据写入失败
      let error = new Error('数据写入失败')
      // error.__detail = event
      reject(error)
    }
  })
}