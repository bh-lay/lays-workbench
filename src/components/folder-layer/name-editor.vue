<style lang="stylus" scoped>
input
  display block
  width 200px
  margin auto
  padding 10px 20px
  background transparent
  border none
  transition .15s
  line-height 16px
  text-align center
  font-size 14px
  &:focus
    outline none
    background #fff
</style>

<template>
  <div class="folder-name-editor">
    <input
      ref="inputRef"
      maxlength="20"
      v-model="inputValue"
      type="text"
      @keydown.enter="blur"
      @focusout="handleChange"
    />
  </div>
</template>

<script>
import { ref, watch } from 'vue'

export default {
  props: {
    modelValue: {
      type: String,
      default: null,
    },
  },
  setup(props, context) {
    const inputRef = ref(null)
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
    };
  },
};
</script>
