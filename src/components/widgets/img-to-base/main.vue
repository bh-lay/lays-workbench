<style lang="stylus" scoped>
.imgtobase-main
  display flex
  flex-direction column
  height 100%
  background #26262c
.header
  padding 10px 20px
button
  width 100px
  margin-right 10px
.hidden-input
  position absolute
  width 0
  height 0
  opacity 0
  visibility hidden
textarea
  display block
  box-sizing border-box
  width: 100%
  height 100px
  flex-grow 1
  padding 20px
  background #1f1f23
  border none
  border-top 1px solid #18181b
  line-height 1.5em
  font-size 12px
  color #9c9cab
  resize none
  spell-check none
  &:focus
    outline none
    background #18181b
    border-top-color #111113
</style>

<template>
  <div class="imgtobase-main">
    <div class="header">
      <v-button @click="copy" type="dark">复制</v-button>
      <v-button @click="$refs.input.click()" type="dark">选择图片</v-button>
      <input
        ref="input"
        type="file"
        accept="image/*"
        class="hidden-input"
        @change="handleInputChange"
      />
    </div>
    <textarea
      v-model="base64Str"
      ref="textarea"
      spellcheck="false"
      placeholder="图片 Base64 后显示于此处 !"
    />
  </div>
</template>

<script lang="ts">
import { ref } from "vue";
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
    const transformImage = (file: File) => {
      imgToBase64(file)
        .then(base64 => {
          base64Str.value = base64
        })
        .catch(() => {})
    }
    if (props.file) {
      transformImage(props.file)
    }
    return {
      base64Str,
      handleInputChange(event: InputEvent) {
        const eventTarget = event.target as null | {
          files: File[]
        }
        if (!eventTarget) {
          return
        }
        if (!eventTarget.files) {
          return
        }
        const file = eventTarget.files[0]
        if (!file) {
          return
        }
        if (file.size > 2 * 1024 * 1024) {
          alert('图片大于 2M，不建议使用 base64 !')
          return
        }
        transformImage(file)
      },
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
