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
import Countdown from './widgets/countdown/index.vue'
import EasyCropPic from './widgets/easy-crop-pic/index.vue'
import { splitInFirstColon } from '@/assets/ts/utils'

const supportWidgetsTypes = ['reg-visual', 'json-formatter', 'native-bookmark', 'img-to-base', 'public-bookmarks', 'private-bookmarks', 'triangle-maker', 'countdown', 'easy-crop-pic']
const supportWidgets = [RegVisual, JsonFormatter, NativeBookmark, ImgToBase, PublicBookmarks, PrivateBookmarks, TriangleMaker, Countdown, EasyCropPic]

export default {
  components: {
    RegVisual,
    JsonFormatter,
    NativeBookmark,
    ImgToBase,
    PublicBookmarks,
    PrivateBookmarks,
    TriangleMaker,
    Countdown,
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
      const widgetsValue = props.data.value
      if (typeof widgetsValue === 'string') {
        const [widgetsType, widgetsParams] = splitInFirstColon(widgetsValue)
        const index = supportWidgetsTypes.indexOf(widgetsType)
        if (index >= 0) {
          return h(supportWidgets[index], {
            data: props.data,
            params: widgetsParams,
          })
        }
      }
      return h('div', {}, [`unknown widgets type<br>${props.data.name}<small>${props.data.value}</small>`])
    }
  },
}
</script>
