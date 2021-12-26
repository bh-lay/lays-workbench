<script lang="ts">
import { h } from 'vue'
import BookmarkIcon from '../bookmark-icon.vue'
import BookmarkWidgetsIcon from '../bookmark-widgets-icon.vue'
import { Bookmark, BookmarkType } from '@database/entity/bookmark'

export default {
  components: { BookmarkIcon, BookmarkWidgetsIcon },
  props: {
    data: {
      type: Bookmark,
      default() {
        return new Bookmark({})
      },
    },
  },
  emits: ['next'],
  setup(props: {
    data: Bookmark,
  }, context) {
    return function () {
      const bookmark = props.data
      if (bookmark.type === BookmarkType.link) {
        return h(BookmarkIcon, {
          icon: bookmark.icon,
          undercoat: bookmark.undercoat,
          url: bookmark.value,
          style: {
            background: bookmark.undercoat,
          },
          onClick() {
            context.emit('next')
          },
        })
      }
      return h(BookmarkWidgetsIcon, {
        data: bookmark,
      })
    }
  },
}
</script>
