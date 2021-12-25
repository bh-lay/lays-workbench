<style lang="stylus" scoped>
.tab-outer
  display flex
  border-bottom 1px solid #3b3b44
.tab-item
  margin-right 2px
  padding 8px 18px
  border-radius 4px 4px 0 0
  font-size 14px
  color #6b6b7b
  cursor pointer
  transition .15s
  &:hover
    background #2f2f37
  &.active,
  &:active
    background #3b3b44
    color #c1c5cd
</style>

<script lang="ts">
import { h } from 'vue'
export default {
  props: {
    modelValue: {
      type: String,
      default: null,
    },
  },
  emits: ['update:modelValue'],
  setup(props, context) {
    function createTabItem(id: string, label: string) {
      return h(
        'div',
        {
          class: [
            'tab-item',
            props.modelValue === id ? 'active' : '',
          ],
          onClick() {
            context.emit('update:modelValue', id)
          },
        },
        [label]
      )
    }
    return function() {
      return h('div', {
        class: 'tab-outer',
      },[
        createTabItem('custom', '自定义链接'),
        createTabItem('widgets', '小工具'),
      ])
    }
  },
}
</script>
