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
  { id: 'encoder', label: '生成二维码' },
  { id: 'decoder', label: '在线扫描' },
]
const activeType = ref(tabOptions[0].id)
</script>
