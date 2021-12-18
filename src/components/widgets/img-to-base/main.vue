<style lang="stylus" scoped>
.imgtobase-main
  display flex
  flex-direction column
  box-sizing border-box
  height 100%
  padding 20px
button
  width 100px
  margin-bottom 10px
textarea
  display block
  box-sizing border-box
  width: 100%
  height 100px
  flex-grow 1
  padding 16px
  border 1px solid #eee
  line-height 1.2em
  font-size 12px
  color #444
  resize none
  spell-check none
</style>

<template>
  <div class="imgtobase-main">
    <button @click="copy">复制</button>
    <textarea
      v-model="base64Str"
      ref="textarea"
      spellcheck="false"
    />
  </div>
</template>

<script lang="ts">
import { ref, computed } from "vue";
import { imgToBase64 } from './image-base64'

export default {
  props: {
    file: {
      type: File,
      default: '',
    },
  },
  setup(props) {
    const base64Str = ref('')
    if (props.file) {
      imgToBase64(props.file)
        .then(base64 => {
          console.log('base64', base64)
          base64Str.value = base64
        })
        .catch(() => {})
    }
    return {
      base64Str
    }
  },
  methods: {
    copy() {
      const textareaNode = this.$refs.textarea as HTMLInputElement
      if (!textareaNode) {
        return
      }
      textareaNode.select()
      document.execCommand('Copy')
      alert('已复制到剪切板！')
    },
  },
};
</script>
