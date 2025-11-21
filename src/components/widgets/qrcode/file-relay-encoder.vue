<style lang="less" scoped>
  .preview {
    display: flex;
    flex-wrap: wrap;
    img {
      box-sizing: border-box;
      width: 25%;
      border: 4px solid transparent;
      min-width: 140px;
    }
  }
</style>
<template>
  <file-relay-encoder-editor
    v-show="!isPreviewMode"
    @request-encode="handleEncode"
  />
  <file-relay-encoder-preview
    v-show="isPreviewMode"
    :is-generate-success="isGenerateSuccess"
    :encoder-log="encoderLog"
    :relay-frames="relayFrames"
    @request-back="handlePreviewBack"
  />
</template>

<script setup lang="ts">
import { Ref, ref } from 'vue'
import * as QRCode from 'qrcode'
import {
  ErrorCorrectionLevel,
  str2ab,
  splitBytes,
  b64FromBytes,
  sha256Hex,
  RelayFrame,
} from './file-relay-helpers'
import FileRelayEncoderEditor from './file-relay-encoder-editor.vue'
import FileRelayEncoderPreview from './file-relay-encoder-preview.vue'

const isPreviewMode = ref(false)
const encoderLog = ref('')
const isGenerateSuccess = ref(false)

let relayFrames: Ref<RelayFrame[]> = ref([])


const logEncoder = (txt: string): void => {
  encoderLog.value += `${txt}\n`
}

const handleEncode = async (options: {
    text: string,
    chunkSize: number,
    ecLevel: ErrorCorrectionLevel,
}): Promise<void> => {
  isPreviewMode.value = true
  encoderLog.value = ''

  relayFrames.value = []
  isGenerateSuccess.value = false

  const txt = options.text ?? ''

  logEncoder('准备编码...')
  const u8 = str2ab(txt)
  const hash = await sha256Hex(u8)
  logEncoder(`SHA-256: ${hash}`)
  const csize = Math.max(100, options.chunkSize || 600)
  const parts = splitBytes(u8, csize)
  const total = parts.length
  logEncoder(`分片数量: ${total}（估算每片 ${csize} 字节）`)

  for (let i = 0; i < parts.length; i += 1) {
    const b64 = b64FromBytes(parts[i])
    const header = `ZX|${i + 1}|${total}|${hash}|`
    const payload = header + b64
    try {
      const ec = options.ecLevel || 'M'
      const dataUrl = await QRCode.toDataURL(payload, {
        errorCorrectionLevel: ec,
        margin: 1,
        scale: 6,
      })
      relayFrames.value.push({ index: i + 1, total, hash, payload, dataUrl })

      logEncoder(`生成分片 ${i + 1}/${total}`)
      await new Promise<void>((resolve) => {
        window.setTimeout(() => resolve(), 50)
      })
    } catch (error) {
      logEncoder(`生成分片失败: ${String(error)}`)
    }
  }
  logEncoder('全部生成完毕。')
  isGenerateSuccess.value = true
}

const handlePreviewBack = () => {
  isPreviewMode.value = false
  isGenerateSuccess.value = false
  encoderLog.value = ''
  relayFrames.value = []
}

</script>

