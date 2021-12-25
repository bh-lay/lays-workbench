import { Bookmark } from '../entity/bookmark'
import bookmarkDefaultList from './default-bookmark-data'

export default function initData(db: IDBDatabase) {
  return new Promise(resolve => {

    const transaction = db.transaction(['bookmark'], 'readwrite')
    const bookmarkObjectStore = transaction.objectStore('bookmark')
      
    for(let i = 0, total = bookmarkDefaultList.length; i < total; i++) {
      const bookmark = new Bookmark(bookmarkDefaultList[i])
      bookmarkObjectStore.add(bookmark)
    }
    console.log('transaction', transaction)
    
    resolve({})
  })
}