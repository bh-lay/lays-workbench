import { getIDBRequest } from '../db.ts';
import { Bookmark } from '../entity/bookmark.ts';
import bookmarkDefaultList from '../default-bookmark-data.ts';
import initBookmark2db from '../init-bookmark-to-db.ts';
import {
  bookmarkInsertManager,
  bookmarkUpdateManager,
  bookmarkGetManager,
  bookmarkRemoveManager,
  bookmarkListManager,
  bookmarkCountManager,
  bookmarkResetSortManager,
} from '../manager/bookmark-manager.ts';

function getDbFromParams(db?: IDBDatabase): Promise<IDBDatabase> {
  if (db) {
    return Promise.resolve(db);
  }
  return getIDBRequest();
}
export function bookmarkInsertService(bookmarkItem: any, db?: IDBDatabase) {
  return getDbFromParams(db)
    .then((db: IDBDatabase) => {
      return bookmarkCountManager(db).then((count: number) => {
        if (count > 0) {
          return db;
        }
        return initBookmark2db(db).then(() => {
          return db;
        });
      });
    })
    .then((db: IDBDatabase) => {
      return bookmarkInsertManager(db, bookmarkItem);
    });
}
export function bookmarkGetService(bookmarkId: string) {
  return getIDBRequest().then((db: IDBDatabase) => {
    return bookmarkGetManager(db, bookmarkId);
  });
}

export function bookmarkUpdateService(bookmarkItem: any, db?: IDBDatabase) {
  return getDbFromParams(db)
    .then((db: IDBDatabase) => {
      return bookmarkCountManager(db).then((count: number) => {
        if (count > 0) {
          return db;
        }
        return initBookmark2db(db).then(() => {
          return db;
        });
      });
    })
    .then((db: IDBDatabase) => {
      console.log(2);
      return bookmarkUpdateManager(db, bookmarkItem);
    });
}
export function bookmarkRemoveService(bookmarkId: string) {
  return getIDBRequest().then((db: IDBDatabase) => {
    return bookmarkRemoveManager(db, bookmarkId);
  });
}

export function bookmarkListService() {
  return getIDBRequest().then((db: IDBDatabase) => {
    return bookmarkListManager(db).then((data: Bookmark[]) => {
      // 若数据为空，则将使用默认数据填充
      if (data.length === 0) {
        bookmarkDefaultList.forEach((item: Bookmark) => {
          data.push(new Bookmark(item));
        });
      }

      data.sort((A, B) => B.sort - A.sort);
      return data;
    });
  });
}


export function bookmarkResortService(idList: string[]) {
  return getIDBRequest().then((db: IDBDatabase) => {
    return bookmarkResetSortManager(db, idList)
  });
}
