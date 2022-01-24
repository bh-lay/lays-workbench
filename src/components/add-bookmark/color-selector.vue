<style lang="stylus" scoped>
outer-padding = 10px
color-width = 38px
color-outline-width = 7px
color-margin-width = 2px
.color-outer
  display flex
  flex-wrap wrap
  width color-width * 7 + color-margin-width * 6 + outer-padding
  padding outer-padding 0 (outer-padding - color-margin-width) outer-padding
  background #3b3b44
.color-item
  position relative
  box-sizing border-box
  margin 0 color-margin-width color-margin-width 0
  flex-shrink 0
  width color-width
  height color-width
  cursor pointer
  transition .15s
  span
    position absolute
    left color-width * -1
    top color-outline-width * -1
    box-sizing border-box
    width color-width
    height color-width + color-outline-width * 2
    text-indent color-outline-width
    writing-mode vertical-lr
    line-height color-width
    font-size 12px
    color #a3b2c2
    background #1d232a
    opacity 0
    transform translatex(4px)
    visibility hidden
    transition .15s
    pointer-events none
  &.active
    &:before
      content ''
      position absolute
      width 0
      height 0
      top 0
      left 0
      border-width 0 0 28px 28px
      border-style solid
      border-color transparent #fff
    &:after
      content '✓'
      position absolute
      width 18px
      height 18px
      text-align center
      line-height 18px
      font-size 14px
      color #C3272B
  &:hover,
  &:active
    outline color-outline-width solid #1d232a
    z-index 1
    span
      visibility visible
      opacity 1
      transform translateX(0)
  &:hover
    z-index 2
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
  emits: ['update:modelValue'],
  setup(props, context) {
    // 目前没有好的方法定义此类型，临时解析成字符串
    const dropdownItemComponent = resolveComponent('v-dropdown-item-plain') as string
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
