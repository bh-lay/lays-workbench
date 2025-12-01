<style lang="less" scoped>
  .preview {
    display: flex;
    flex-wrap: wrap;
  }
  .preview-item {
    position: relative;
    box-sizing: border-box;
    width: 20%;
    min-width: 100px;
    cursor: pointer;
    img {
      display: block;
      box-sizing: border-box;
      width: 100%;
      aspect-ratio: 1;
      border: 5px solid transparent;
    }
    .badge {
      position: absolute;
      inset: 5px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: rgba(0, 0, 0, 0.4);
      font-size: 24px;
      color: #fff;
      transition: .3s ease-in-out;
    }
    &:hover {
      .badge {
        background: rgba(0,0,0,.7);
      }
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
  .tip {
    margin: 16px 0 12px;
    padding: 10px 14px;
    border-radius: 6px;
    border: 1px solid rgba(249, 169, 51, 0.6);
    background: linear-gradient(90deg, rgba(249, 169, 51, 0.15), rgba(249, 169, 51, 0.05));
    font-size: 13px;
    line-height: 1.6;
    color: #ffdca0;
    a {
      font-size: 18px;
      color: #ffdca0;
      text-decoration: underline;
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
    <p
      class="tip allow-user-select-text"
    >
      使用其它设备打开“在线扫描”，依次识别二维码序列后重组。<br />
      <a href="https://e.bh-lay.com/#!=widgets:qrcode">https://e.bh-lay.com/#!=widgets:qrcode</a>
    </p>

    <div class="preview">
      <div
        v-for="(frame, index) in relayFrames"
        :key="frame.index"
        class="preview-item"
        @click="handlePreview(index)"
      >
        <span class="badge">
          {{ frame.index }}/{{ frame.total }}
        </span>
        <img :src="frame.dataUrl" />
      </div>
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
        <v-button @click="handleTogglePause">
          <v-mdi :name="fullscreenPaused ? 'mdi-play' : 'mdi-pause'" />
          {{ fullscreenPaused ? '继续' : '暂停' }}
        </v-button>
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

