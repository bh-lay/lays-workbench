import { Bookmark } from '../entity/bookmark'
import bookmarkDefaultList from './default-bookmark-data'
import { bookmarkCountManager } from '../manager/bookmark-manager'

function initBookmark2db(db: IDBDatabase) {
  return new Promise(resolve => {
    const transaction = db.transaction(['bookmark'], 'readwrite')
    const bookmarkObjectStore = transaction.objectStore('bookmark')
      
    for(let i = 0, total = bookmarkDefaultList.length; i < total; i++) {
      const bookmark = new Bookmark(bookmarkDefaultList[i])
      bookmarkObjectStore.add(bookmark)
    }
    resolve({})
  })
}
// 自动填充默认数据
export async function autoInitDefaultData(db: IDBDatabase) {
  const count = await bookmarkCountManager(db)
  if (count > 0) {
    return db
  }
  await initBookmark2db(db)
  return db
}