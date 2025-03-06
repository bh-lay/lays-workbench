<style lang="less" scoped>
.imgtobase-main {
  display: flex;
  flex-flow: row;
  // flex-direction column
  align-items: center;
  justify-content: center;
  gap: 40px;
  height: 100%;
}
.action-side {
  display: flex;
  flex-direction: column;
  gap: 20px;
  button {
    width: 140px;
  }
}
.hidden-input {
  position: absolute;
  width: 0;
  height: 0;
  opacity: 0;
  visibility: hidden;
}
.base64-output {
  display: block;
  box-sizing: border-box;
  width: 100%;
  max-width: 400px;
  height: 80vh;
  max-height: 700px;
  padding: 20px;
  background: rgba(0, 0, 0, .2);
  border: none;
  line-height: 1.5em;
  font-size: 14px;
  border-radius: 8px;
  color: #9c9cab;
  resize: none;
  &:focus {
    outline: none;
    background: #18181b;
  }
}
@media screen and (max-width:600px) {
  .imgtobase-main {
    flex-direction: column;
  }
  .action-side {
    flex-direction: row;
  }
}
</style>

<template>
  <div class="imgtobase-main">
    <textarea
      ref="textareaRef"
      v-model="base64Str"
      class="base64-output"
      spellcheck="false"
      placeholder="图片 Base64 后显示于此处 !"
    />
    <div class="action-side">
      <v-button type="primary" @click="copy">
        复制
      </v-button>
      <v-button @click="inputRef?.click()">
        换张图片
      </v-button>
      <input
        ref="inputRef"
        type="file"
        accept="image/*"
        class="hidden-input"
        @change="handleInputChange"
      >
    </div>
  </div>
</template>

<script lang="ts">
import { ref } from 'vue'
import { imgToBase64 } from './image-base64'
import { Message } from '@/ui-lib/message/index'

export default {
  name: 'ImageBaseWidgets',
  props: {
    file: {
      type: File,
      default: '',
    },
  },
  setup(props) {
    const base64Str = ref('')
    const inputRef = ref<HTMLInputElement | null>(null)
    const textareaRef = ref<HTMLTextAreaElement | null>(null)
    const transformImage = (file: File) => {
      imgToBase64(file)
        .then(base64 => {
          base64Str.value = base64
        })
        .catch(() => {
          // nothing
        })
    }
    if (props.file) {
      transformImage(props.file)
    }
    return {
      base64Str,
      inputRef,
      textareaRef,
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
          new Message({
            message: '图片大于 2M，不建议使用 base64 !',
          })
          return
        }
        transformImage(file)
      },
      copy() {
        const textareaNode = textareaRef.value
        if (!textareaNode) {
          return
        }
        textareaNode.select()
        document.execCommand('Copy')

        new Message({
          message: '已复制到剪切板！',
        })
      },
    }
  },
}
</script>
