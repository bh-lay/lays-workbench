
import one from './1'
// import two from './2'

type upgradedFn = (db: IDBDatabase, transaction: IDBTransaction) => Promise<boolean>

const upgradeVersionFnMap: Record<number, upgradedFn | undefined> = {
  // 1-> 2
  1: one,
  // // 2 -> 3
  // 2: two
}

export async function bookmarkUpgrade (
  newVersion: number,
  oldVersion: number,
  db: IDBDatabase,
  transaction: IDBTransaction
) {
  async function upgradeNext(currentVersion: number) {
    const currentUpgradeFn = upgradeVersionFnMap[currentVersion]
    if (currentUpgradeFn) {
      await currentUpgradeFn(db, transaction)
    }
    const nextVersion = currentVersion + 1
    if (nextVersion < newVersion) {
      await upgradeNext(nextVersion)
    }
  }
  await upgradeNext(oldVersion)
}


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
