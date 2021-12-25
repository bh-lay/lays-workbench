<style lang="stylus" scoped>
.color-outer
  display flex
  flex-wrap wrap
  width 374px
  border-radius 14px
  padding 7px 0 5px 7px
  overflow hidden
  background #3b3b44
.color-item
  box-sizing border-box
  margin 0 3px 3px 0
  flex-shrink 0
  width 50px
  height 50px
  border 6px solid transparent
  border-radius 10px
  overflow hidden
  cursor pointer
  transition .15s
  span
    box-sizing border-box
    width 20px
    height 100%
    writing-mode vertical-lr
    line-height 12px
    font-size 12px
    color #a3b2c2
    background #1d232a
    opacity 0
    transform translatex(-3px)
    transition .15s
    visibility hidden
  &:hover,
  &.active,
  &:active
    border-color #1d232a
    span
      visibility visible
      opacity 1
      transform translateX(0)
</style>

<script lang="ts">
import { resolveComponent, h } from 'vue'
import colorList from '@/assets/ts/color-list'
export default {
  props: {
    modelValue: {
      type: String,
      default: null,
    },
  },
  setup(props, context) {
    // 目前没有好的方法定义此类型，临时解析成字符串
    const dropdownItemComponent = resolveComponent('dropdown-item') as string
    function createColorItem(colorItem: { label: string, value: string }) {
      return h(
        dropdownItemComponent,
        {
          class: ['color-item', props.modelValue === colorItem.value ? 'active' : ''],
          onClick() {
            context.emit('update:modelValue', colorItem.value)
          },
          style: {
            background: colorItem.value,
          },
        },
        {
          default() {
            return h('span', colorItem.label)
          },
        }
      )
    }
    return function () {
      return h(
        'div',
        {
          class: 'color-outer',
        },
        colorList.map(createColorItem)
      )
    }
  },
}
</script>
