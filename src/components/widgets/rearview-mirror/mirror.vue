<style lang="less" scoped>
.mirror-container {
  position: relative;
  width: 100%;
  height: 100%;
  &:hover .action-layer {
    opacity: 1;
    transform: scale(1);
  }
  video {
    display: block;
    width: 100.1%;
    height: 100.1%;
    object-fit: cover;
    border-radius: 0;
  }
  .mask {
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    background-color: rgba(0, 0, 0, .4);
    backdrop-filter: blur(2px) contrast(0.7) grayscale(0.2);
  }
  .action-layer {
    position: absolute;
    box-sizing: border-box;
    width: 100%;
    height: 100%;
    left: 0;
    top: 0;
    opacity: 0;
    transform: scale(1.05);
    transition: .15s ease-in-out;
    .picture-open-button {
      position: absolute;
      top: 10px;
      left: 10px;
      padding: 6px;
    }
    .close-button {
      position: absolute;
      top: 10px;
      right: 10px;
      padding: 6px;
    }
    .v-slider {
      position: absolute;
      bottom: 10%;
      left: 10px;
      right: 10px;
    }
  }
}
</style>
<template>
  <div class="mirror-container">
    <video
      ref="videoNodeRef"
      autoplay
      playsinline
    />
    <div
      class="mask"
      :style="{
        opacity: maskOpacity
      }"
    />
    <div class="action-layer">
      <v-button
        class="close-button"
        @click="$emit('request-close')"
      >
        <v-mdi
          name="mdi-close"
          size="26"
        />
      </v-button>
      <template v-if="size !== BookmarkSize.small">
        <v-button
          class="picture-open-button"
          @click="handlePictureInPicture"
        >
          <v-mdi
            name="mdi-fullscreen"
            size="26"
          />
        </v-button>
        <v-slider
          v-model="maskOpacity"
          :min="0"
          :max="1"
        />
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onUnmounted, onMounted, PropType } from 'vue'
import { Message } from '@/ui-lib/message'
import { BookmarkSize } from '@database/entity/bookmark'

defineProps({
  size: {
    type: Number as PropType<BookmarkSize>,
    default: BookmarkSize.large,
  },
})
defineEmits(['request-close'])
const videoNodeRef = ref<HTMLVideoElement | null>(null)
const maskOpacity = ref(1)

let stream: MediaStream | null = null

const startCamera = async (deviceId?: string): Promise<void> => {
  if (stream) {
    stream.getTracks().forEach((t) => t.stop())
    stream = null
  }
  if (!navigator.mediaDevices?.getUserMedia) {
    throw new Error('浏览器不支持摄像头访问')
  }
  const constraints: MediaStreamConstraints = {
    video: {
      deviceId: deviceId ? { exact: deviceId } : undefined,
      facingMode: 'environment',
    },
  }
  stream = await navigator.mediaDevices.getUserMedia(constraints)
  if (!videoNodeRef.value) return
  videoNodeRef.value.srcObject = stream
  await videoNodeRef.value.play()
}

const handleStart = async (): Promise<void> => {
  try {
    await startCamera()
  } catch (error) {
    new Message({
      message: `打开摄像头失败：${String(error)}`,
    })
  }
}

const handleStop = (): void => {
  if (stream) {
    stream.getTracks().forEach((t) => t.stop())
    stream = null
  }
}
const handlePictureInPicture = () => {
  if (!videoNodeRef.value) return
  videoNodeRef.value.requestPictureInPicture()
}
onMounted(() => {
  handleStart()
})
onUnmounted(() => {
  handleStop()
})

</script>

