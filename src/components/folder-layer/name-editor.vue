<style lang="stylus" scoped>
input
  display block
  width 220px
  margin auto
  padding 10px 20px
  background transparent
  border none
  transition .15s
  line-height 16px
  text-align center
  font-size 18px
  color #fff
  transition .3s
  &:focus
    outline none
    background #1d2126
</style>

<template>
  <div class="folder-name-editor">
    <input
      ref="inputRef"
      v-model="inputValue"
      maxlength="20"
      type="text"
      placeholder="分组名"
      @keydown.enter="blur"
      @focusout="handleChange"
    >
  </div>
</template>

<script lang="ts">
import { Ref, ref } from 'vue'

export default {
  props: {
    modelValue: {
      type: String,
      default: null,
    },
  },
  emits: ['update:modelValue'],
  setup(props, context) {
    const inputRef: Ref<HTMLInputElement | null> = ref(null)
    const inputValue = ref(props.modelValue)
    return {
      inputValue,
      inputRef,
      blur() {
        if (inputRef.value) {
          inputRef.value.blur()
        }
      },
      handleChange() {
        context.emit('update:modelValue', inputValue.value)
      },
    }
  },
}
</script>
