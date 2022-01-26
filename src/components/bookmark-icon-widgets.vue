<script lang="ts">
import { h } from 'vue'
import { Bookmark } from '@database/entity/bookmark'
import RegVisual from './widgets/reg-visual/index.vue'
import JsonFormatter from './widgets/json-formatter/index.vue'
import NativeBookmark from './widgets/native-bookmark.vue'
import ImgToBase from './widgets/img-to-base/index.vue'
import PublicBookmarks from './widgets/public-bookmarks/index.vue'
import PrivateBookmarks from './widgets/private-bookmarks/index.vue'
import TriangleMaker from './widgets/triangle-maker/index.vue'

const supportWidgetsTypes = ['reg-visual', 'json-formatter', 'native-bookmark', 'img-to-base', 'public-bookmarks', 'private-bookmarks', 'triangle-maker']
const supportWidgets = [RegVisual, JsonFormatter, NativeBookmark, ImgToBase, PublicBookmarks, PrivateBookmarks, TriangleMaker]

export default {
  components: {
    RegVisual,
    JsonFormatter,
    NativeBookmark,
    ImgToBase,
    PublicBookmarks,
    PrivateBookmarks,
    TriangleMaker,
  },
  props: {
    data: {
      type: Bookmark,
      default() {
        return new Bookmark({})
      },
    },
  },
  setup(props: {
    data: Bookmark
  }) {
    return function() {
      const index = supportWidgetsTypes.indexOf(props.data.value as string)
      if (index >= 0) {
        return h(supportWidgets[index], {
          data: props.data,
        })
      }
      return h('div', {}, [`unknown widgets type<br>${props.data.name}<small>${props.data.value}</small>`])
    }
  },
}
</script>
