<script lang="ts">
import { h } from 'vue'
import { Bookmark } from '@database/entity/bookmark'
import { splitInFirstColon } from '@/assets/ts/utils'
import { getWidgetsByName } from '@/components/widgets/widgets-config'

export default {
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
        const matchedWidgets = getWidgetsByName(widgetsType)
        if (matchedWidgets) {
          return h(matchedWidgets.iconComponent, {
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
