import {
  Bookmark,
  BookmarkType,
} from '@database/entity/bookmark'
import { replaceRouter } from '@/assets/ts/router'

type options = {
  handleFolder?: () => void,
  widgetsData?: {},
}
export function openBookmark(data: Bookmark, options?: options) {
  const { handleFolder, widgetsData } = (options || {})
  if (data.type === BookmarkType.link) {
    const bookmarkValue = data.value
    if (typeof bookmarkValue !== 'string') {
      return
    }
    if (bookmarkValue && bookmarkValue.match(/^#/)) {
      location.hash = bookmarkValue
    } else {
      window.open(bookmarkValue, '_blank')
    }
  } else if (data.type === BookmarkType.widgets) {
    replaceRouter('widgets', data.value as string, widgetsData)
  } else if (data.type === BookmarkType.folder) {
    handleFolder && handleFolder()
  }
}

