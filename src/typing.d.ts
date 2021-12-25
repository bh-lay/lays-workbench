
declare interface Window {
  mozIndexedDB?: IDBFactory
  webkitIndexedDB?: IDBFactory
  msIndexedDB?: IDBFactory
}

declare module '*.vue' {
  import { ComponentOptions } from 'vue'
  const componentOptions: ComponentOptions
  export default componentOptions
}

declare interface CustomIDBTransactionEventTarget extends EventTarget {
  transaction: IDBTransaction
}
declare interface CustomIDBCountEventTarget extends EventTarget {
  result: number,
}
declare interface CustomIDBCursorEventTarget extends EventTarget {
  result: {
    value: {
      [key: string]: string | number | null | undefined
    },
    continue: () => void
  },
}
