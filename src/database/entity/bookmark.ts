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
  objectStore.createIndex("type", "type", { unique: false })
  objectStore.createIndex("size", "size", { unique: false })
  objectStore.createIndex("undercoat", "undercoat", { unique: false })
  objectStore.createIndex("value", "value", { unique: false })
  objectStore.createIndex("icon", "icon", { unique: false })
}

// 书签类型
export enum BookmarkType {
  Link = 1,
  Dialog = 2,
  Widgits = 3
}
// 书签尺寸
export enum BookmarkSize {
  small = 1,
  medium = 2,
  large = 3
}
// 书签图标
type BookmarkIconCrab = 'crab'
type BookmarkIconMdi = `${'mdi:'}${string}`
type BookmarkIconText = `${'text:'}${string}`
export type BookmarkIcon = BookmarkIconCrab | BookmarkIconMdi | BookmarkIconText

function generateID() {
  return new Date().getTime().toString(24)
}
/**
 * Bookmark 书签类
 */
export class Bookmark {
  id: string
  // 收藏名称
  name: string
  // 类型
  type: BookmarkType
  size: BookmarkSize
  undercoat: string
  value: string
  icon: BookmarkIcon
  constructor(object) {
    this.fill(object)
  }
  fill(object) {
    if (typeof object !== 'object') {
      return
    }
    this.id = object.id || generateID()
    this.name = object.name || ''
    this.type = object.type || BookmarkType.Link
    this.size = object.size || BookmarkSize.small
    this.undercoat = object.undercoat || ''
    this.value = object.value || ''
    this.icon = object.icon || 'text:X'
  }
}