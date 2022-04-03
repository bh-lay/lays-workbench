<style lang="stylus" scoped>
.v-input
  width 260px
  margin auto
  :deep(input)
    text-align center
    font-size 16px
    color #fff
    border-color transparent
    background transparent
</style>

<template>
  <div class="folder-name-editor">
    <v-input
      ref="inputRef"
      v-model="inputValue"
      maxlength="20"
      type="text"
      placeholder="分组名"
      @keydown.enter="blur"
      @focusout="handleChange"
    />
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
