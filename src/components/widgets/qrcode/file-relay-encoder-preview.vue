<style lang="less" scoped>
  .preview {
    display: flex;
    flex-wrap: wrap;
    img {
      box-sizing: border-box;
      width: 25%;
      border: 4px solid transparent;
      min-width: 140px;
    }
  }
  .fullscreen-preview {
    position: fixed;
    inset: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 18px;
    background: rgba(0,0,0,0.7);
    z-index: 9999;
    padding: 16px;
    img {
      width: 60vmin;
      height: auto;
      box-shadow: 0 6px 24px rgba(0,0,0,0.45);
      border-radius: 12px;
      background: #fff;
      padding: 12px;
    }
  }
</style>
<template>
  <div class="generate-part">
    <v-button @click="$emit('request-back')">
      <v-mdi name="mdi-chevron-left" />
    </v-button>
    <v-button
      type="primary"
      :disabled="!isGenerateSuccess"
      @click="handleStartAutoPlay"
    >
      播放二维码序列
    </v-button>
    <div class="form-label">生成信息 / 日志</div>
    <v-input
      :model-value="encoderLog"
      type="textarea"
      disabled
    />

    <h4>预览</h4>
    <div class="preview">
      <img
        v-for="(frame, index) in relayFrames"
        :key="frame.index"
        :src="frame.dataUrl"
        @click="handlePreview(index)"
      />
    </div>
    <div
      v-if="fullscreenVisible"
      class="fullscreen-preview"
    >
      <img
        :src="relayFrames[fullscreenPreviewIndex].dataUrl"
        :alt="relayFrames[fullscreenPreviewIndex].index + ''"
      />
      <div class="counter">
        第{{ relayFrames[fullscreenPreviewIndex].index }}/{{ relayFrames[fullscreenPreviewIndex].total }}片
      </div>
      <div>
        <v-button type="primary" @click="handleExitPlay">退出播放</v-button>
        <v-button @click="handleTogglePause">{{ fullscreenPaused ? '继续' : '暂停' }}</v-button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onUnmounted, PropType, ref } from 'vue'

import {
  RelayFrame,
} from './file-relay-helpers'

const props = defineProps({
  encoderLog: {
    type: String,
    default: '',
  },
  isGenerateSuccess: {
    type: Boolean,
    default: false,
  },
  relayFrames: {
    type: Array as PropType<RelayFrame[]>,
    default() {
      return []
    },
  },
})

defineEmits(['request-back'])

const fullscreenVisible = ref(false)
const fullscreenPaused = ref(false)
const fullscreenPreviewIndex = ref(0)

const PLAY_INTERVAL_MS = 1000

let playInterval: number | null = null

const startAutoPlay = () => {
  if (props.relayFrames.length === 0 || playInterval) return
  playInterval = window.setInterval(() => {
    fullscreenPreviewIndex.value = (fullscreenPreviewIndex.value + 1) % props.relayFrames.length
  }, PLAY_INTERVAL_MS)
  fullscreenPaused.value = false
}

const stopAutoPlay = (): void => {
  if (playInterval !== null) {
    window.clearInterval(playInterval)
    playInterval = null
  }
  fullscreenPaused.value = true
}

const handleStartAutoPlay = () => {
  fullscreenVisible.value = true
  fullscreenPreviewIndex.value = 0
  startAutoPlay()
}

const handlePreview = (idx: number): void => {
  fullscreenVisible.value = true
  fullscreenPreviewIndex.value = idx || 0
  stopAutoPlay()
}

const handleExitPlay = () => {
  stopAutoPlay()
  fullscreenVisible.value = false
}

const handleTogglePause = () => {
  if (fullscreenPaused.value) {
    startAutoPlay()
  } else {
    stopAutoPlay()
  }
}
onUnmounted(() => {
  stopAutoPlay()
})
</script>

