<style lang="less" scoped>
.qr-scanner {
  display: flex;
  flex-direction: column;
}

.video-container {
  position: relative;
  margin-bottom: 16px;
  video {
    display: block;
    width: 100%;
    height: 320px;
    background: #000;
    border-radius: 8px;
    border: 1px solid #333;
  }
  canvas {
    display: none;
  }
  .camera-selector {
    position: absolute;
    width: 300px;
    height: 100px;
    top: 50%;
    left: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: -50px 0 0 -150px;
  }
}

.result-section {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.result-box {
  padding: 12px;
  background: #2f2f37;
  border: 1px solid #1c1c21;
  border-radius: 4px;
  word-break: break-all;
  white-space: pre-wrap;
  font-size: 12px;
  color: #ccc;
  .v-button {
    vertical-align: baseline;
    margin-left: 1em;
    padding: 4px 8px;
    font-size: 12px;
  }
}

</style>

<template>
  <div class="qr-scanner">
    <div class="video-container">
      <video
        ref="videoNodeRef"
        autoplay
        playsinline
      ></video>
      <canvas ref="cameraCanvas"></canvas>
      <div
        v-if="!isScanning"
        class="camera-selector"
      >
        <camera-selector v-model="selectedCameraId" />
      </div>
    </div>

    <div>
      <v-button
        type="primary"
        @click="handleToggleScan"
      >
        {{ isScanning ? '停止扫码' : '开始扫码' }}
      </v-button>
      <v-button
        v-if="scannedTextList.length"
        @click="handleClearResult"
      >
        清空结果
      </v-button>
    </div>

    <div v-if="scannedTextList.length" class="result-section">
      <div class="form-label">扫描结果</div>
      <div
        v-for="(scannedText, index) in scannedTextList"
        :key="index"
      >
        <div class="result-box allow-user-select-text">
          {{ scannedText }}
          <v-button @click="handleCopyResult(index)">复制</v-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onUnmounted } from 'vue'
import jsQR from 'jsqr'
import { Message } from '@/ui-lib/message'
import CameraSelector from './camera-selector.vue'

const videoNodeRef = ref<HTMLVideoElement | null>(null)
const cameraCanvas = ref<HTMLCanvasElement | null>(null)

const selectedCameraId = ref('')
const isScanning = ref(false)
const scannedTextList = ref<string[]>([])

let stream: MediaStream | null = null
let scanTimer: number | null = null

const scanOnce = (): void => {
  if (!videoNodeRef.value || !cameraCanvas.value) return
  if (!videoNodeRef.value.videoWidth || !videoNodeRef.value.videoHeight) return

  const ctx = cameraCanvas.value.getContext('2d')
  if (!ctx) return

  cameraCanvas.value.width = videoNodeRef.value.videoWidth
  cameraCanvas.value.height = videoNodeRef.value.videoHeight
  ctx.drawImage(videoNodeRef.value, 0, 0, cameraCanvas.value.width, cameraCanvas.value.height)

  const imgd = ctx.getImageData(0, 0, cameraCanvas.value.width, cameraCanvas.value.height)
  const code = jsQR(imgd.data, imgd.width, imgd.height, { inversionAttempts: 'attemptBoth' })

  if (code && code.data && scannedTextList.value[scannedTextList.value.length - 1] !== code.data) {
    if (scannedTextList.value.length > 10) {
      new Message({
        message: '扫描记录过多，请清空后继续！',
      })
      return
    }
    scannedTextList.value.push(code.data)
  }
}

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

  if (!videoNodeRef.value || !cameraCanvas.value) return

  videoNodeRef.value.srcObject = stream
  await videoNodeRef.value.play()
}

const handleStartScan = async (): Promise<void> => {
  try {
    await startCamera(selectedCameraId.value)
    isScanning.value = true
    scanTimer = window.setInterval(scanOnce, 300)
  } catch (error) {
    new Message({
      message: `打开摄像头失败：${String(error)}`,
    })
  }
}

const handleStopScan = (): void => {
  if (scanTimer) {
    window.clearInterval(scanTimer)
    scanTimer = null
  }

  if (stream) {
    stream.getTracks().forEach((t) => t.stop())
    stream = null
  }

  isScanning.value = false
}

const handleToggleScan = () => {
  if (isScanning.value) {
    handleStopScan()
  } else {
    handleStartScan()
  }
}
const handleClearResult = (): void => {
  scannedTextList.value = []
}

const handleCopyResult = async (index: number): Promise<void> => {
  const text = scannedTextList.value[index]
  if (!text) return

  try {
    await navigator.clipboard.writeText(text)
    new Message({
      message: '结果已复制到剪贴板',
    })
  } catch (error) {
    new Message({
      message: `复制失败：${String(error)}`,
    })
  }
}

onUnmounted(() => {
  handleStopScan()
})
</script>

