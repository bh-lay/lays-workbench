<style lang="less" scoped>
.small {
  padding-left: 10px;
  font-size: 12px;
  color: #fff;
  opacity: .6;
}
.v-tab-switch {
  margin-bottom: 12px;
}
</style>

<template>
  <div class="card">
    <p class="small">
      文本分段生成二维码，扫码后本地重组并校验。
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
import FileRelayDecoder from './file-relay-decoder.vue'
import FileRelayEncoder from './file-relay-encoder.vue'

const tabOptions = [
  { id: 'encoder', label: '发送端（编码）' },
  { id: 'decoder', label: '接收端（扫码并重组）' },
]
const activeType = ref(tabOptions[0].id)
</script>
