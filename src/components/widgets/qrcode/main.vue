<style lang="less" scoped>
.qrcode-container {
  max-width: 800px;
  height: 100%;
  margin: 0 auto;
  --main-editor-height: 320px
}
.qrcode-header {
  margin-bottom: 16px;
}
:deep(.card) {
  box-sizing: border-box;
  padding: 16px;
  background: #3e4451;
}

:deep(.form-label) {
  display: block;
  margin: 12px 2px 4px;
  font-weight: 600;
  font-size: 14px;
}
@media screen and (max-width:600px) {
  :deep(.card) {
    min-height: 100%;
  }
  .qrcode-container {
    --main-editor-height: 60vh
  }
}
</style>

<template>
  <div class="qrcode-container">
    <FileRelay />
  </div>
</template>

<script setup lang="ts">
import { defineAsyncComponent } from 'vue'

const FileRelay = defineAsyncComponent(() => import('./file-relay.vue'))
</script>
