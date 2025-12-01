<style lang="less" scoped>
.v-input {
  margin-bottom: 16px;
  :deep textarea {
    aspect-ratio: 2.5;
    min-height: 200px;
  }
}
@media screen and (max-width:600px) {
  .v-input {
    :deep textarea {
      height: 60vh;
    }
  }
}
</style>
<template>
  <div>
    <v-button @click="$emit('request-back')">
      <v-mdi name="mdi-chevron-left" />
    </v-button>
    <v-button
      type="primary"
      @click="handleCopy"
    >
      复制
    </v-button>
    <div class="form-label">恢复的文本</div>
    <v-input
      :model-value="originText"
      type="textarea"
      disabled
    />
  </div>
</template>

<script setup lang="ts">
import { Message } from '@/ui-lib/message'

const props = defineProps({
  originText: {
    type: String,
    default: '',
  },
})
defineEmits(['request-back'])
const handleCopy = async () => {
  // ...const handleCopyResult = async (): Promise<void> => {
  if (!props.originText) return

  try {
    await navigator.clipboard.writeText(props.originText)
    new Message({
      message: '结果已复制到剪贴板',
    })
  } catch (error) {
    new Message({
      message: `复制失败：${String(error)}`,
    })
  }

}
</script>

