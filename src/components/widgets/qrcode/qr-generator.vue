<style lang="less" scoped>
.qr-generator {
  display: flex;
  gap: 16px;
}

.input-section {
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: 100px;
  flex-grow: 1;
  .v-input {
    :deep textarea {
      min-height: 200px;
    }
  }
  .v-slider {
    max-width: 400px;
  }
}
.preview-section {
  display: flex;
  flex-direction: column;
  gap: 12px;
  align-items: center;
  width: 240px
}

.qr-preview {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  padding: 20px;
  background: #fff;
  border-radius: 8px;
  border: 1px solid #333;
}

.qr-image {
  max-width: 300px;
  max-height: 300px;
  width: 100%;
  height: auto;
}

</style>

<template>
  <div class="qr-generator">
    <div class="input-section">
      <v-input
        v-model="inputText"
        type="textarea"
        placeholder="输入要生成二维码的文本内容"
      />

      <div>
        <div class="form-label">错误更正等级</div>
        <ec-level-slider v-model="ecLevel" />
      </div>

      <div>
        <v-button type="primary" @click="handleGenerate">生成二维码</v-button>
      </div>
    </div>

    <div class="preview-section" v-if="qrDataUrl">
      <div class="qr-preview">
        <img :src="qrDataUrl" alt="QR Code" class="qr-image" />
        <div style="font-size: 12px; color: #666; text-align: center;">
          扫描此二维码即可获取内容
        </div>
      </div>
      <div>
        <v-button :disabled="!qrDataUrl" @click="handleDownload">下载</v-button>
        <v-button :disabled="!qrDataUrl" @click="handleCopy">复制</v-button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import * as QRCode from 'qrcode'
import { Message } from '@/ui-lib/message'
import EcLevelSlider from './ec-level-slider.vue'
import { QRCodeToDataURLOptions } from 'qrcode'

const inputText = ref('')
const ecLevel = ref<'L' | 'M' | 'Q' | 'H'>('M')
const qrDataUrl = ref<string>('')

const handleGenerate = async (): Promise<void> => {
  if (!inputText.value.trim()) {
    new Message({
      message: '请输入要生成二维码的文本内容',
    })
    return
  }

  try {
    const dataUrl = await QRCode.toDataURL(inputText.value, {
      errorCorrectionLevel: ecLevel.value,
      type: 'image/png',
      quality: 0.92,
      margin: 1,
      width: 300,
    } as QRCodeToDataURLOptions)
    qrDataUrl.value = dataUrl
  } catch (error) {
    new Message({
      message: `生成二维码失败：${String(error)}`,
    })
  }
}

const handleDownload = (): void => {
  if (!qrDataUrl.value) return

  const link = document.createElement('a')
  link.href = qrDataUrl.value
  link.download = 'qrcode.png'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

const handleCopy = async (): Promise<void> => {
  if (!qrDataUrl.value) return

  try {
    const response = await fetch(qrDataUrl.value)
    const blob = await response.blob()
    await navigator.clipboard.write([
      new ClipboardItem({ 'image/png': blob }),
    ])
    new Message({
      message: '二维码图片已复制到剪贴板',
    })
  } catch (error) {
    new Message({
      message: `复制失败：${String(error)}`,
    })
  }
}
</script>

