
declare interface Window {
  mozIndexedDB?: IDBFactory
  webkitIndexedDB?: IDBFactory
  msIndexedDB?: IDBFactory
}

declare module '*.vue' {
  import { DefineComponent } from 'vue'
  const componentOptions: DefineComponent<{}, {}, any>
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

interface ImportMetaEnv {
  readonly PROD: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
