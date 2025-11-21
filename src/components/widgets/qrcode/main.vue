<style lang="less" scoped>
.qrcode-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 10px;
}
.qrcode-header {
  margin-bottom: 16px;
}
:deep(.card) {
  padding: 16px;
  background: #3e4451;
}

:deep(.form-label) {
  display: block;
  margin: 12px 2px 4px;
  font-weight: 600;
  font-size: 14px;
}

</style>

<template>
  <div class="qrcode-container">
    <VTabSwitch
      v-model="activeType"
      class="qrcode-header"
      :options="tabOptions"
    />
    <div class="card" v-if="activeType === 'create'">
      <QRGenerator />
    </div>
    <div class="card" v-if="activeType === 'scan'">
      <QRScanner />
    </div>
    <FileRelay v-if="activeType === 'relay'" />
  </div>
</template>

<script setup lang="ts">
import { defineAsyncComponent, ref } from 'vue'

const FileRelay = defineAsyncComponent(() => import('./file-relay.vue'))
const QRGenerator = defineAsyncComponent(() => import('./qr-generator.vue'))
const QRScanner = defineAsyncComponent(() => import('./qr-scanner.vue'))

const tabOptions = [
  { id: 'create', label: '生成二维码' },
  { id: 'scan', label: '在线扫描' },
  { id: 'relay', label: '文件接力' },
]
const activeType = ref<string>(tabOptions[0].id)
</script>
