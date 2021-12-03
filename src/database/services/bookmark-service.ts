import { getIDBRequest } from '../db';
import { Bookmark } from '../entity/bookmark';
import bookmarkDefaultList from '../default-bookmark-data';
import initBookmark2db from '../init-bookmark-to-db';
import {
  bookmarkInsertManager,
  bookmarkUpdateManager,
  bookmarkGetManager,
  bookmarkRemoveManager,
  bookmarkListManager,
  bookmarkCountManager,
  bookmarkResetSortManager,
} from '../manager/bookmark-manager';
import { BookmarkType } from '../entity/bookmark';

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
      console.log('update', bookmarkItem)
      return bookmarkUpdateManager(db, bookmarkItem);
    });
}
export function bookmarkRemoveService(bookmarkId: string) {
  return getIDBRequest().then((db: IDBDatabase) => {
    return bookmarkGetManager(db, bookmarkId)
      .then((bookmarkItem?: Bookmark) => {
        if (!bookmarkItem) {
          return
        }
        if (bookmarkItem.type === BookmarkType.folder) {
          throw Error('目录暂不允许删除，后续会支持的呦')
        }
        return bookmarkRemoveManager(db, bookmarkId);
      });
  })
}

export function bookmarkListService(params: {parent: string | null}) {
  return getIDBRequest().then((db: IDBDatabase) => {
    return bookmarkListManager(db, params).then((data: Bookmark[]) => {
      if (!params || !params.parent) {
        // 若数据为空，则将使用默认数据填充
        if (data.length === 0) {
          bookmarkDefaultList.forEach((item: object) => {
            data.push(new Bookmark(item));
          });
        }
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
