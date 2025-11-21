<style lang="less" scoped>
  .v-input {
    margin-bottom: 16px;
    :deep textarea {
      min-height: 200px;
    }
  }
  .advance-config {
    padding: 12px 20px 10px 0;
    .v-slider {
      max-width: 400px;
    }
  }
</style>
<template>
  <div class="source-part">
    <v-input
      v-model="sourceText"
      type="textarea"
      placeholder="把长文本粘贴到这里——例如几 KB 的说明、短文件内容等"
    />

    <div>
      <VButton
        type="primary"
        :disabled="sourceText.length === 0"
        @click="handleEncode"
      >
        生成二维码序列
      </VButton>
      <VButton
        type="secondary"
        @click="advanceConfigVisible = !advanceConfigVisible"
      >
        更多设置
      </VButton>
    </div>
    <div
      v-if="advanceConfigVisible"
      class="advance-config"
    >
      <div class="form-label">分片字节上限（估算）</div>
      <v-slider
        v-model="chunkSize"
        :min="200"
        :max="800"
        :step="50"
        :marks="chunkSizeMarks"
      />
      <div class="form-label">错误更正等级</div>
      <ec-level-slider v-model="ecLevel" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { ErrorCorrectionLevel } from './file-relay-helpers'
import EcLevelSlider from './ec-level-slider.vue'

const sourceText = ref('')
const chunkSize = ref(600)
const ecLevel = ref<ErrorCorrectionLevel>('M')
const advanceConfigVisible = ref(false)

const emits = defineEmits(['request-encode'])
const chunkSizeMarks = [
  {
    value: 200,
    label: '200',
  },
  {
    value: 400,
    label: '400',
  },
  {
    value: 600,
    label: '600',
  },
  {
    value: 800,
    label: '800',
  },
]
const handleEncode = async (): Promise<void> => {
  if (!sourceText.value) {
    return
  }
  emits('request-encode', {
    text: sourceText.value,
    chunkSize: chunkSize.value,
    ecLevel: ecLevel.value,
  })
}

</script>

