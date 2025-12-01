<style lang="less" scoped>
.scanner-video {
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
  .progress-mask {
    position: absolute;
    box-sizing: border-box;
    width: 100%;
    left: 0;
    bottom: 0;
    padding: 60px 10px 10px;
    background: linear-gradient(180deg, transparent, rgba(0, 0, 0, 0.8))
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
.v-input {
  :deep textarea {
    min-height: 200px;
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
@media screen and (max-width:600px) {
  video {
    min-height: 60vh;
  }
}
</style>
<template>
  <file-relay-decoder-preview
    v-if="isScanedSuccess"
    :origin-text="recoveredText"
    @request-back="handleResetDecoder"
  />
  <div v-else>
    <div class="scanner-video">
      <video
        ref="videoNodeRef"
        autoplay
        playsinline
      />
      <canvas ref="canvasNodeRef"></canvas>
      <div
        v-if="isScaning"
        class="progress-mask"
      >
        <file-relay-decoder-progress :decoder-state="decoderState" />
      </div>
      <div
        v-else
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
        {{ isScaning ? '停止扫码' : '开始扫码' }}
      </v-button>
      <v-button
        v-if="mode === 'simple' && scannedTextList.length"
        @click="handleClearResult"
      >
        清空结果
      </v-button>
    </div>

    <div v-if="decoderLog.length">
      <div class="form-label">解码日志 / 进度</div>
      <v-input
        :model-value="decoderLog"
        type="textarea"
        disabled
      />
    </div>

    <div
      v-if="mode === 'simple' && scannedTextList.length"
      class="result-section"
    >
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
import { ab2str, bytesFromB64, sha256Hex, DecoderState } from './file-relay-helpers'
import FileRelayDecoderProgress from './file-relay-decoder-progress.vue'
import FileRelayDecoderPreview from './file-relay-decoder-preview.vue'
import CameraSelector from './camera-selector.vue'

const isScaning = ref(false)
const isScanedSuccess = ref(false)
const selectedCameraId = ref('')
const mode = ref<'unknown' | 'fragment' | 'simple'>('unknown')

const videoNodeRef = ref<HTMLVideoElement | null>(null)
const canvasNodeRef = ref<HTMLCanvasElement | null>(null)
const decoderLog = ref('')
const recoveredText = ref('')
const scannedTextList = ref<string[]>([])

let stream: MediaStream | null = null
let scanTimer: number | null = null
let decoderState = ref<DecoderState>({ total: null, hash: null, parts: {} })

const logDecoder = (txt: string): void => {
  decoderLog.value += `${txt}\n`
}

const tryFinish = async (): Promise<void> => {
  const total = decoderState.value.total
  if (!total) return
  const got = Object.keys(decoderState.value.parts).length
  if (got !== total) return
  logDecoder('接收完毕，正在重组并校验...')
  let all = new Uint8Array(0)
  for (let i = 1; i <= total; i += 1) {
    const b64 = decoderState.value.parts[i]
    if (!b64) return
    const u = bytesFromB64(b64)
    const tmp = new Uint8Array(all.length + u.length)
    tmp.set(all, 0)
    tmp.set(u, all.length)
    all = tmp
  }
  const expectedHash = decoderState.value.hash
  const calculated = await sha256Hex(all)
  if (expectedHash && calculated === expectedHash) {
    recoveredText.value = ab2str(all)
    logDecoder('校验通过：SHA256 匹配。已恢复文本。')
    handleScanSuccess()
  } else {
    logDecoder(`校验失败：计算 ${calculated} ≠ 期望 ${expectedHash ?? '未知'}`)
  }
}

const scanOnce = (): void => {
  if (!videoNodeRef.value || !canvasNodeRef.value) return
  if (!videoNodeRef.value.videoWidth || !videoNodeRef.value.videoHeight) return
  const ctx = canvasNodeRef.value.getContext('2d')
  if (!ctx) return
  ctx.drawImage(videoNodeRef.value, 0, 0, canvasNodeRef.value.width, canvasNodeRef.value.height)
  const imgd = ctx.getImageData(0, 0, canvasNodeRef.value.width, canvasNodeRef.value.height)
  const code = jsQR(imgd.data, imgd.width, imgd.height, { inversionAttempts: 'attemptBoth' })
  if (!code || !code.data) return
  const payload = code.data

  // 根据第一次识别到的二维码内容自动决定工作模式
  if (mode.value === 'unknown') {
    mode.value = payload.startsWith('ZX|') ? 'fragment' : 'simple'
    if (mode.value === 'simple') {
      // 简单模式下直接记录扫描结果，与原“在线扫描”功能一致
      scannedTextList.value.push(payload)
      return
    }
  }

  // 简单模式：直接累积结果
  if (mode.value === 'simple') {
    if (scannedTextList.value[scannedTextList.value.length - 1] !== payload) {
      if (scannedTextList.value.length > 10) {
        new Message({
          message: '扫描记录过多，请清空后继续！',
        })
        return
      }
      scannedTextList.value.push(payload)
    }
    return
  }

  // 分片模式：只处理带 ZX| 头的分片二维码
  if (payload.startsWith('ZX|')) {
    const idx1 = payload.indexOf('|', 3)
    const idx2 = payload.indexOf('|', idx1 + 1)
    const idx3 = payload.indexOf('|', idx2 + 1)
    if (idx1 === -1 || idx2 === -1 || idx3 === -1) return
    const partNum = Number.parseInt(payload.substring(3, idx1), 10)
    const total = Number.parseInt(payload.substring(idx1 + 1, idx2), 10)
    const hash = payload.substring(idx2 + 1, idx3)
    const b64 = payload.substring(idx3 + 1)
    if (Number.isNaN(partNum) || Number.isNaN(total) || !hash) return
    if (!decoderState.value.total) {
      decoderState.value.total = total
      decoderState.value.hash = hash
      logDecoder(`检测到第 ${partNum}/${total} 片，目标 SHA256: ${hash}`)
    }
    if (decoderState.value.hash !== hash || decoderState.value.total !== total) {
      logDecoder('警告：检测到不一致的任务（哈希或总片数不同），已忽略此片')
      return
    }
    if (!decoderState.value.parts[partNum]) {
      decoderState.value.parts[partNum] = b64
      logDecoder(`已接收片 ${partNum}`)
      void tryFinish()
    }
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
  if (!videoNodeRef.value || !canvasNodeRef.value) return
  videoNodeRef.value.srcObject = stream
  await videoNodeRef.value.play()
  canvasNodeRef.value.width = videoNodeRef.value.videoWidth
  canvasNodeRef.value.height = videoNodeRef.value.videoHeight
}

const handleResetDecoder = (): void => {
  decoderState.value = { total: null, hash: null, parts: {} }
  recoveredText.value = ''
  decoderLog.value = ''
  scannedTextList.value = []
  mode.value = 'unknown'
  isScaning.value = false
  isScanedSuccess.value = false
}
const handleStartScan = async (): Promise<void> => {
  try {
    isScaning.value = true
    const selected = selectedCameraId.value || undefined
    await startCamera(selected)
    decoderLog.value = ''
    scanTimer = window.setInterval(scanOnce, 300)
  } catch (error) {
    isScaning.value = false
    new Message({
      message: `打开摄像头失败：${String(error)}`,
    })
  }
}

const handleStopScan = (): void => {
  isScaning.value = false
  if (scanTimer) {
    window.clearInterval(scanTimer)
    scanTimer = null
  }
  if (stream) {
    stream.getTracks().forEach((t) => t.stop())
    stream = null
  }
}
const handleToggleScan = () => {
  if (isScaning.value) {
    handleResetDecoder()
    handleStopScan()
  } else {
    handleResetDecoder()
    handleStartScan()
  }
}
const handleScanSuccess = () => {
  setTimeout(() => {
    handleStopScan()
    isScanedSuccess.value = true
  }, 1000)
}

onUnmounted(() => {
  handleStopScan()
})

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
</script>

