
export function bookmarkEntityInit (db: IDBDatabase) {
  if (db.objectStoreNames.contains('bookmark')) {
    return
  }
  const objectStore = db.createObjectStore('bookmark', {
    keyPath: 'id',
    autoIncrement: true,
  })
  objectStore.createIndex('id', 'id', { unique: true })
  objectStore.createIndex('name', 'name', { unique: false })
  objectStore.createIndex('type', 'type', { unique: false })
  objectStore.createIndex('parent', 'parent', { unique: false })
  objectStore.createIndex('size', 'size', { unique: false })
  objectStore.createIndex('undercoat', 'undercoat', { unique: false })
  objectStore.createIndex('value', 'value', { unique: false })
  objectStore.createIndex('icon', 'icon', { unique: false })
  objectStore.createIndex('desc', 'desc', { unique: false })
}

// 书签类型
export enum BookmarkType {
  link = 1,
  dialog = 2,
  widgets = 3,
  folder = 4,
}
// 书签尺寸
export enum BookmarkSize {
  small = 1,
  medium = 2,
  large = 3,
  three_one = 4
}
// 书签图标类型
type BookmarkIconCrab = 'crab'
type BookmarkIconMdi = `${'mdi:'}${string}`
type BookmarkIconText = `${'text:'}${string}`
export type BookmarkIcon = BookmarkIconCrab | BookmarkIconMdi | BookmarkIconText

// 书签值类型
export type BookmarkValue = string | boolean
// 生成 ID
function generateID() {
  const randomNum = Math.floor(new Date().getTime() * 100 + Math.random() * 100)
  return randomNum.toString(24)
}
/**
 * Bookmark 书签类
 */
export class Bookmark {
  id!: string
  sort = 0
  // 收藏名称
  name = '未命名'
  // 类型
  type: BookmarkType = BookmarkType.link
  size: BookmarkSize = BookmarkSize.small
  undercoat = '#ffaa00'
  value: BookmarkValue = 'http://bh-lay.com'
  icon: BookmarkIcon = 'text:X'
  parent = ''
  // 描述信息
  desc = ''
  constructor(object: bookmarkOriginData) {
    this.fill(object)
  }
  fill(object: bookmarkOriginData) {
    if (typeof object !== 'object') {
      return
    }
    this.id = object.id || generateID()
    this.sort = object.sort || 0
    this.name = object.name || ''
    this.type = object.type || BookmarkType.link
    this.size = object.size || BookmarkSize.small
    this.undercoat = object.undercoat || ''
    this.value = object.value || ''
    this.parent = object.parent || ''
    this.icon = object.icon || 'text:X'
    this.desc = object.desc || ''
  }
  parse() {
    return {
      id: this.id,
      sort: this.sort,
      name: this.name,
      type: this.type,
      size: this.size,
      undercoat: this.undercoat,
      value: this.value,
      parent: this.parent,
      icon: this.icon,
      desc: this.desc,
    }
  }
}


export type bookmarkOriginData = {
  id?: string,
  sort?: number,
  name?: string,
  type?: BookmarkType,
  size?: BookmarkSize,
  undercoat?: string,
  value?: string,
  parent?: string,
  icon?: BookmarkIcon
  desc?: string
}