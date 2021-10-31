export function bookmarkEntityInit (db) {
  if (db.objectStoreNames.contains('bookmark')) {
    return
  }
  const objectStore = db.createObjectStore('bookmark', {
    keyPath: 'id',
    autoIncrement: true
  })
  objectStore.createIndex("id", "id", { unique: true })
  objectStore.createIndex("name", "name", { unique: false })
  objectStore.createIndex("url", "url", { unique: false })
  objectStore.createIndex("icon", "icon", { unique: false })
}

export class Bookmark {
  constructor(object) {
    this.id = undefined
    this.name = undefined
    this.url = undefined
    this.icon = undefined
    this.fill(object)
  }
  fill(object) {
    if (typeof object !== 'object') {
      return
    }
    this.id = object.id || undefined
    this.name = object.name || ''
    this.url = object.url || ''
    this.icon = object.icon
  }
}