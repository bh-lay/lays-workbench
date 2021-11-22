<style lang="stylus" scoped>
.modal-outer
  position fixed
  width 100%
  height 100%
  top 0
  left 0
  display flex
  align-items center
  justify-content center
  transition 0 0
  &.hidden
    // 各种方法保证视觉上弹窗不可见，且不影响动画显示
    pointer-events none
    visibility hidden
    opacity 0
    width 0
    height 0
    transition .1s 1s
.modal-mask
  position absolute
  width 100%
  height 100%
  top 0
  left 0
  z-index 100
  background: rgba(0, 0, 0, .5)
  backdrop-filter blur(2px)
.modal-close
  position absolute
  top 0
  right -60px
  width 40px
  height 40px
  line-height 40px
  text-align center
  z-index 102
  transition-delay .2s
  cursor pointer
  margin-left 5px
  border-radius 100%
  border 1px solid rgba(255, 255, 255, .2)
  transition .2s
  svg
    vertical-align text-bottom
    fill #fff
  &:hover
    background rgba(255, 255, 255, .2)
    border-color rgba(255, 255, 255, .5)
  &:active
    background #aaa
.modal-body
  position relative
  box-sizing border-box
  width 80%
  background #fff
  z-index 101
@media screen and (max-width:600px)
  .modal-close
    top 0
    left auto
    right 0
    border none
    svg
      fill #333
  .modal-mask
    transition 0s !important
  .modal-body
    top 0
    left 0
    width 100% !important
    height 100% !important
</style>

<template>
  <teleport to="body">"
    <div :class="['modal-outer', modelValue ? 'visible' : 'hidden']">
      <transition name="fade-slow">
        <div v-if="modelValue" class="modal-mask"></div>
      </transition>
      <transition name="flip">
        <div class="modal-body" v-if="modelValue" :style="modalBodyStyle">
          <slot/>
          <div class="modal-close" @click="$emit('update:modelValue', false)">
            <v-mdi name="mdi-close" />
          </div>
        </div>
      </transition>
    </div>
  </teleport>
</template>

<script>
export default {
  emits: ['after-open', 'after-close'],
  props: {
    modelValue: {
      type: Boolean,
      default: false,
    },
    width: {
      type: [String, Number],
      default: ''
    },
    height: {
      type: [String, Number],
      default: ''
    },
  },
  setup(props) {
    console.log('props', props)
      const size = {}
      if (props.width) {
        if (typeof props.width === 'number') {
          size.width = props.width + 'px'
        } else {
          size.width = props.width
        }
      }
      if (props.height) {
        if (typeof props.height === 'number') {
          size.height = props.height + 'px'
        } else {
          size.height = props.height
        }
      }
      return {
        modalBodyStyle: size
      }
  },
  watch: {
    modelValue(isVisible) {
      if (isVisible) {
        this.$emit('after-open')
      } else {
        this.$emit('after-close')
      }
    },
  },
};
</script>
