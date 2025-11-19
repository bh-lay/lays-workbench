<style lang="less" scoped>
.qrcode-header {
  margin-bottom: 16px;
}
:deep(.card) {
  padding: 16px;
  border: 1px solid #333;
  border-radius: 8px;
  background: #222;
}

</style>

<template>
  <div class="code-diff-container">
    <VTabSwitch
      v-model="activeType"
      class="qrcode-header"
      :options="tabOptions"
    />
    <FileRelay v-if="activeType === 'relay'" />
  </div>
</template>

<script setup lang="ts">
import { defineAsyncComponent, ref } from 'vue'

const FileRelay = defineAsyncComponent(() => import('./file-relay.vue'))

const tabOptions = [
  { id: 'create', label: '生成二维码' },
  { id: 'scan', label: '在线扫描' },
  { id: 'relay', label: '文件接力' },
]
const activeType = ref<string>(tabOptions[2].id)
</script>
