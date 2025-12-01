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
  .decription {
    padding: 1.5em 0 0.5em;
    font-size: 14px;
    color: #f9a933
  }
  @media screen and (max-width:600px) {
    .v-input {
      :deep textarea {
        min-height: 60vh;
      }
    }
  }

</style>
<template>
  <div class="source-part">
    <v-input
      v-model="sourceText"
      type="textarea"
      placeholder="在这里输入或粘贴要生成二维码的内容"
    />
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

    <div>
      <VButton
        type="primary"
        :disabled="sourceText.length === 0"
        @click="handleEncode"
      >
        {{ encodeButtonLabel }}
      </VButton>
      <VButton
        type="secondary"
        @click="advanceConfigVisible = !advanceConfigVisible"
      >
        更多设置
      </VButton>
    </div>
    <div
      v-if="isSequenceMode"
      class="decription"
    >
      文本较长，需要生成多张二维码序列。
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
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

// 根据当前文本长度和分片上限，预估是单图还是序列
const isSequenceMode = computed(() => {
  if (!sourceText.value) return false
  const encoder = new TextEncoder()
  const bytesLength = encoder.encode(sourceText.value).length
  const csize = Math.max(100, chunkSize.value || 600)
  const expectedParts = Math.ceil(bytesLength / csize)
  return expectedParts > 1
})

// 按模式返回对应的按钮文案
const encodeButtonLabel = computed(() => {
  if (!sourceText.value) return '生成二维码'
  return isSequenceMode.value ? '生成二维码序列' : '生成二维码'
})
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

