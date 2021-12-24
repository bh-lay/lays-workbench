<style lang="stylus" scoped>
.v-message
  position fixed
  top 40px
  right 40px
  padding 12px 28px
  display flex
  align-items center
  border-radius 4px
  background #2c313a
  box-shadow 1px 1px 3px rgba(0, 0, 0, .2), 1px 1px 10px rgba(0, 0, 0, .2)
  z-index 2001
.message-body
  min-width 200px
  max-width 400px
  margin-right 20px
.message-text
  line-height 1.5em
  font-size 14px
  color #d4d7dd
.message-footer
  padding-top 10px
  .v-button
    margin-right 10px
    padding 3px 8px
    line-height 14px
    font-size 12px
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
  <transition name="message-ani">
    <div v-if="visible" class="v-message">
      <div class="message-body">
        <div class="message-text">{{ message }}</div>
        <div v-if="confirm" class="message-footer">
          <v-button @click="onConfirm">{{ confirmText }} </v-button>
          <v-button @click="visible = false">{{ cancelText }} </v-button>
        </div>
      </div>
      <div class="message-close" @click="visible = false">关闭</div>
    </div>
  </transition>
</template>

<script lang="ts">
import { ref, watch, nextTick } from 'vue'
import VButton from '../components/v-button.vue' 
export default {
  components: { VButton },
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
    confirmText: {
      type: String,
      default: '确定',
    },
    cancelText: {
      type: String,
      default: '取消',
    },
    confirm: {
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
      visible,
      onConfirm() {
        visible.value = false
        props.confirm && props.confirm()
      }
    }
  }
 };
</script>
