
declare interface Window {
  mozIndexedDB: any
  webkitIndexedDB: any
  msIndexedDB: any
}

declare module '*.vue' {
  import { ComponentOptions } from 'vue'
  const componentOptions: ComponentOptions
  export default componentOptions
}

declare interface CustomIDBEventTarget extends EventTarget {
  transaction: IDBTransaction
  result: any,
}