<style lang="less" scoped>
  .preview {
    img {
      box-sizing: border-box;
      width: 100%;
      border: 4px solid transparent;
      min-width: 140px;
      max-width: 400px;
    }
  }
</style>
<template>
  <div>
    <file-relay-encoder-editor
      v-if="!isPreviewMode"
      @request-encode="handleEncode"
    />

    <!-- 单图模式：直接在编辑器下方渲染单个二维码 -->
    <div
      v-if="isSingleMode && singleFrame"
      class="single-preview"
    >
      <div class="form-label">预览</div>
      <div class="preview">
        <img :src="singleFrame.dataUrl" alt="二维码预览" />
      </div>
    </div>

    <!-- 序列模式：使用原有的预览组件 -->
    <file-relay-encoder-preview
      v-if="isPreviewMode"
      :is-generate-success="isGenerateSuccess"
      :relay-frames="relayFrames"
      @request-back="handlePreviewBack"
    />
  </div>
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
const isSingleMode = ref(false)
const isGenerateSuccess = ref(false)

const relayFrames: Ref<RelayFrame[]> = ref([])
const singleFrame = ref<RelayFrame | null>(null)


const logEncoder = (txt: string): void => {
  console.log('qrcode', txt)
}

const handleEncode = async (options: {
    text: string,
    chunkSize: number,
    ecLevel: ErrorCorrectionLevel,
}): Promise<void> => {
  // 重置状态
  isPreviewMode.value = false
  isSingleMode.value = false
  singleFrame.value = null

  relayFrames.value = []
  isGenerateSuccess.value = false

  const txt = options.text ?? ''

  logEncoder('准备编码...')
  const u8 = str2ab(txt)
  const hash = await sha256Hex(u8)
  const csize = Math.max(100, options.chunkSize || 600)
  const parts = splitBytes(u8, csize)
  const total = parts.length

  // 如果只需要一个分片，则直接生成“裸”的单个二维码，任何扫码软件都可识别
  if (total === 1) {
    logEncoder('数据量较小，将直接生成单个二维码，可使用任意扫码软件识别。')
    try {
      const ec = options.ecLevel || 'M'
      const dataUrl = await QRCode.toDataURL(txt, {
        errorCorrectionLevel: ec,
        margin: 1,
        scale: 6,
      })
      singleFrame.value = {
        index: 1,
        total: 1,
        hash: '',
        payload: txt,
        dataUrl,
      }
      isSingleMode.value = true
      logEncoder('单个二维码生成完毕。')
      isGenerateSuccess.value = true
      return
    } catch (error) {
      logEncoder(`生成二维码失败: ${String(error)}`)
      return
    }
  }

  // 否则使用原有的分片序列模式
  isPreviewMode.value = true
  logEncoder(`SHA-256: ${hash}`)
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
  isSingleMode.value = false
  isGenerateSuccess.value = false
  relayFrames.value = []
  singleFrame.value = null
}

</script>

