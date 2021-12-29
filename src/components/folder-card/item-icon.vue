<script lang="ts">
import { h } from 'vue'
import BookmarkIconLink from '../bookmark-icon-link.vue'
import BookmarkIconWidgets from '../bookmark-icon-widgets.vue'
import { Bookmark, BookmarkType } from '@database/entity/bookmark'

export default {
  components: { BookmarkIconLink, BookmarkIconWidgets },
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
        return h(BookmarkIconLink, {
          icon: bookmark.icon,
          undercoat: bookmark.undercoat,
          url: bookmark.value as string,
          onClick() {
            context.emit('next')
          },
        })
      }
      return h(BookmarkIconWidgets, {
        data: bookmark,
      })
    }
  },
}
</script>
