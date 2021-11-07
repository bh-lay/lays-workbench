import { Bookmark } from './entity/bookmark.ts'
import { BookmarkType, BookmarkSize } from './entity/bookmark.ts'

const bookmarkDefaultList = [
  {
    name: '正则可视化',
    type: BookmarkType.widgets,
    size: BookmarkSize.large,
    undercoat: '#2196f3',
    value: 'reg-visual',
  },
  {
    name: 'JSON 格式化',
    type: BookmarkType.widgets,
    size: BookmarkSize.medium,
    undercoat: '#f44336',
    value: 'json-formatter',
  },
  {
    name: '书签快捷键',
    type: BookmarkType.widgets,
    size: BookmarkSize.three_one,
    undercoat: '#e9eff6',
    value: 'native-bookmark',
  },
  {
    name: 'Github',
    type: BookmarkType.link,
    size: BookmarkSize.small,
    undercoat: '#222',
    value: 'https://github.com/',
    icon: 'mdi:github'
  },
  {
    name: 'stackoverflow',
    type: BookmarkType.link,
    size: BookmarkSize.small,
    undercoat: '#444',
    value: 'https://stackoverflow.com/',
    icon: 'mdi:stack-overflow'
  },
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