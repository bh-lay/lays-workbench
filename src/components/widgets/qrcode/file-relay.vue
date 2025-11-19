
<style lang="less" scoped>
h1 {
  font-size: 18px;
  margin-bottom: 6px;
}

.small {
  font-size: 12px;
  color: #666;
}

:deep(.grid) {
  display: grid;
  grid-template-columns: 1fr 420px;
  gap: 12px;
}
:deep(label) {
  display: block;
  margin: 8px 0 4px;
  font-weight: 600;
}

:deep(textarea) {
  width: 100%;
  height: 160px;
  padding: 8px;
  box-sizing: border-box;
}

:deep(input),
:deep(select) {
  width: 100%;
  padding: 8px;
  box-sizing: border-box;
}

:deep(button) {
  padding: 8px 12px;
  margin-top: 8px;
}

:deep(.preview) {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

:deep(.qr) {
  width: 200px;
  height: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #fff;
  border: 1px solid #ddd;
}

:deep(#cameraCanvas) {
  display: none;
}

:deep(.controls) {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

:deep(.scanner-video) {
  width: 100%;
  height: 320px;
  background: #000;
}
</style>

<template>
  <div class="card">
    <h1>文件接力</h1>
    <p class="small">
      说明：把任意文本分成多片，每片生成带序号的二维码。接收端可连续扫码并重组原文，支持相同文本校验（SHA-256）。完全本地运行，支持导出图片序列或自动播放。
    </p>
    <VTabSwitch
      v-model="activeType"
      :options="tabOptions"
    />
    <FileRelayEncoder v-if="activeType === 'encoder'" />
    <FileRelayDecoder v-else />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
const tabOptions = [
  { id: 'encoder', label: '发送端（编码）' },
  { id: 'decoder', label: '接收端（扫码并重组）' },
]
const activeType = ref(tabOptions[0].id)
import FileRelayDecoder from './file-relay-decoder.vue'
import FileRelayEncoder from './file-relay-encoder.vue'
</script>
