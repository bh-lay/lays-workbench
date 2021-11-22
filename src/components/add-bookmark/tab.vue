<style lang="stylus" scoped>
.tab-outer
  display flex
  border-bottom 1px solid #e0e6eb
.tab-item
  margin-right 2px
  padding 8px 18px
  border-radius 4px 4px 0 0
  font-size 14px
  color #a3b2c2
  cursor pointer
  transition .15s
  &:hover
    background #f6f7f8
    color #6f869f
  &.active,
  &:active
    background #e0e6eb
    color #3d4c5c
</style>

<script>
import { h } from 'vue';
export default {
  props: {
    modelValue: {
      type: String,
      default: null,
    },
  },
  setup(props, context) {
    function createTabItem(id, label) {
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
        class: 'tab-outer'
      },[
        createTabItem('custom', '自定义链接'),
        createTabItem('widgets', '小组件'),
      ]);
    }
  },
};
</script>
