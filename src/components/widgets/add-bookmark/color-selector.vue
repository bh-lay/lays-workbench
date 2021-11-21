<style lang="stylus" scoped>
.color-outer
  display flex
  flex-wrap wrap
  width 500px
  height 300px
  padding 20px
  overflow auto
.color-item
  box-sizing border-box
  margin 0 3px 3px 0
  flex-shrink 0
  width 60px
  height 60px
  border 4px solid transparent
  border-radius 6px
  overflow hidden
  cursor pointer
  transition .15s
  span
    box-sizing border-box
    width 30px
    height 100%
    padding-top 5px
    writing-mode vertical-lr
    line-height 24px
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

<script>
import { ref, h } from 'vue';
import colorList from './color-list.ts';
export default {
  props: {
    active: {
      type: String,
      default: null,
    },
  },
  setup(props, context) {
    const dropdownVisible = ref(false)
    function createColorItem(colorItem) {
      return h(
        'div',
        {
          class: ['color-item', props.active === colorItem.value ? 'active' : ''],
          onClick() {
            context.emit('update:active', colorItem.value);
          },
          style: {
            background: colorItem.value
          },
        },
        [
          h('span', colorItem.label)
        ]
      );
    }
    return function () {
      return h(
        'div',
        {
          class: 'color-outer',
        },
        colorList.map(createColorItem)
      );
    };
  },
};
</script>
