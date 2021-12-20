<style lang="stylus" scoped>
.v-message
  position fixed
  bottom 40px
  left 40px
  padding 15px 20px
  display flex
  align-items center
  border-radius 4px
  background #5d636f
  box-shadow 1px 1px 3px rgba(0, 0, 0, .2), 1px 1px 10px rgba(0, 0, 0, .2)
  z-index 2001
.message-body
  min-width 200px
  max-width 400px
  margin-right 20px
  line-height 1.5em
  font-size 14px
  color #d4d7dd
.message-close
  line-height 40px
  text-align center
  z-index 102
  cursor pointer
  transition .2s
  font-size 12px
  color #8f96a3
  &:hover
    color #d4d7dd
  &:active
    color #aaa
</style>

<template>
  <transition name="slideup">
    <div v-if="visible" class="v-message">
      <div class="message-body">{{ message }}</div>
      <div class="message-close" @click="visible = false">关闭</div>
    </div>
  </transition>
</template>

<script>
import { ref, watch, nextTick } from 'vue'
export default {
  props: {
    message: {
      type: String,
      default: '',
    },
    duration: {
      type: Number,
      default: 5000,
    },
    onClose: {
      type: Function
    },
  },
  setup(props) {
    // 初始显示
    const visible = ref(true)
    function triggerCallback() {
      // 为保证关闭动画完整进行，延迟两秒触发关闭事件
      setTimeout(() => {
        props.onClose && props.onClose()
      }, 2000)
    }
    nextTick(() => {
      // 为了执行动画，下一栈隐藏，然后显示
      visible.value = false
      nextTick(() => {
        visible.value = true
      })
      // 当真正需要关闭时，触发回调
      watch(visible, isVisible => {
        if (isVisible) {
          return
        }
        triggerCallback()
      })
    })
    if (props.duration > 0) {
      setTimeout(() => {
        visible.value = false
      }, props.duration)
    }
    return {
      visible
    }
  }
 };
</script>
