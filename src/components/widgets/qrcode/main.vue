<style lang="less" scoped>
.code-diff-container {
  display: flex;
  flex-direction: column;
  height: 100%;
  .caption {
    padding: 0 10px 10px;
    font-size: 16px;
  }
}
</style>

<template>
  <div class="code-diff-container">
    <div class="caption">
      生成二维码、在线扫描、文件接力
    </div>
    <div class="code-diff-content" />
    <FileRelay />
  </div>
</template>

<script setup lang="ts">
import { Ref, ref, onMounted, onUnmounted } from 'vue'
import FileRelay from './file-relay.vue'


onMounted(() => {
  // ...
})
onUnmounted(() => {
  // ...
})
</script>
