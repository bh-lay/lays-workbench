<template>
  <div class="card">
    <h3>接收端（扫码并重组）</h3>
    <label>选择摄像头</label>
    <select id="cameraSelect" ref="cameraSelect"></select>
    <div style="margin-top:8px">
      <video id="video" ref="video" class="scanner-video" autoplay playsinline></video>
      <canvas id="cameraCanvas" ref="cameraCanvas"></canvas>
    </div>

    <div class="controls">
      <button id="startScanBtn" ref="startScanBtn" @click="handleStartScan">开始扫码</button>
      <button id="stopScanBtn" ref="stopScanBtn" disabled @click="handleStopScan">
        停止扫码
      </button>
      <button id="resetDecoderBtn" ref="resetDecoderBtn" @click="handleResetDecoder">
        重置接收器
      </button>
    </div>

    <label>解码日志 / 进度</label>
    <div id="decoderLog" ref="decoderLog" class="log"></div>

    <label>已接收分片（实时）</label>
    <div
      id="partsList"
      ref="partsList"
      style="min-height:60px;padding:8px;border:1px dashed #eee;border-radius:6px;background:#fafafa"
    ></div>

    <label>恢复出的文本</label>
    <textarea id="recovered" ref="recovered" readonly></textarea>
  </div>
</template>

<script setup lang="ts">
import { Ref, ref, onMounted, onUnmounted } from 'vue'
import jsQR from 'jsqr'
import { ab2str, bytesFromB64, sha256Hex } from './file-relay-helpers'

interface DecoderState {
  total: number | null
  hash: string | null
  parts: Record<number, string>
}

const cameraSelect = ref<HTMLSelectElement | null>(null)
const video = ref<HTMLVideoElement | null>(null)
const cameraCanvas = ref<HTMLCanvasElement | null>(null)
const startScanBtn = ref<HTMLButtonElement | null>(null)
const stopScanBtn = ref<HTMLButtonElement | null>(null)
const resetDecoderBtn = ref<HTMLButtonElement | null>(null)
const decoderLog = ref<HTMLDivElement | null>(null)
const partsList = ref<HTMLDivElement | null>(null)
const recovered = ref<HTMLTextAreaElement | null>(null)

let stream: MediaStream | null = null
let scanTimer: number | null = null
let decoderState: DecoderState = { total: null, hash: null, parts: {} }

const setButtonDisabled = (btn: Ref<HTMLButtonElement | null>, disabled: boolean): void => {
  if (btn.value) {
    btn.value.disabled = disabled
  }
}

const logDecoder = (txt: string): void => {
  if (!decoderLog.value) return
  decoderLog.value.innerText += `${txt}\n`
  decoderLog.value.scrollTop = decoderLog.value.scrollHeight
}

const updatePartsUI = (): void => {
  if (!partsList.value) return
  const totalLabel = decoderState.total ?? '?'
  partsList.value.innerHTML = ''
  const keys = Object.keys(decoderState.parts)
    .map((n) => Number.parseInt(n, 10))
    .sort((a, b) => a - b)
  keys.forEach((k) => {
    const d = document.createElement('div')
    d.innerText = `${k}/${totalLabel}`
    partsList.value?.appendChild(d)
  })
}

const tryFinish = async (): Promise<void> => {
  const total = decoderState.total
  if (!total) return
  const got = Object.keys(decoderState.parts).length
  if (got !== total) return
  logDecoder('接收完毕，正在重组并校验...')
  let all = new Uint8Array(0)
  for (let i = 1; i <= total; i += 1) {
    const b64 = decoderState.parts[i]
    if (!b64) return
    const u = bytesFromB64(b64)
    const tmp = new Uint8Array(all.length + u.length)
    tmp.set(all, 0)
    tmp.set(u, all.length)
    all = tmp
  }
  const expectedHash = decoderState.hash
  const calculated = await sha256Hex(all)
  if (expectedHash && calculated === expectedHash) {
    if (recovered.value) {
      recovered.value.value = ab2str(all)
    }
    logDecoder('校验通过：SHA256 匹配。已恢复文本。')
  } else {
    logDecoder(`校验失败：计算 ${calculated} ≠ 期望 ${expectedHash ?? '未知'}`)
  }
}

const scanOnce = (): void => {
  if (!video.value || !cameraCanvas.value) return
  if (!video.value.videoWidth || !video.value.videoHeight) return
  const ctx = cameraCanvas.value.getContext('2d')
  if (!ctx) return
  ctx.drawImage(video.value, 0, 0, cameraCanvas.value.width, cameraCanvas.value.height)
  const imgd = ctx.getImageData(0, 0, cameraCanvas.value.width, cameraCanvas.value.height)
  const code = jsQR(imgd.data, imgd.width, imgd.height, { inversionAttempts: 'attemptBoth' })
  if (!code) return
  const payload = code.data
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
    if (!decoderState.total) {
      decoderState.total = total
      decoderState.hash = hash
      logDecoder(`检测到第 ${partNum}/${total} 片，目标 SHA256: ${hash}`)
    }
    if (decoderState.hash !== hash || decoderState.total !== total) {
      logDecoder('警告：检测到不一致的任务（哈希或总片数不同），已忽略此片')
      return
    }
    if (!decoderState.parts[partNum]) {
      decoderState.parts[partNum] = b64
      logDecoder(`已接收片 ${partNum}`)
      updatePartsUI()
      void tryFinish()
    }
  } else {
    logDecoder(`检测到非分片二维码，内容：${payload.slice(0, 200)}`)
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
  if (!video.value || !cameraCanvas.value) return
  video.value.srcObject = stream
  await video.value.play()
  cameraCanvas.value.width = video.value.videoWidth
  cameraCanvas.value.height = video.value.videoHeight
}

const initCameras = async (): Promise<void> => {
  if (!navigator.mediaDevices?.enumerateDevices || !cameraSelect.value) return
  const devices = await navigator.mediaDevices.enumerateDevices()
  const cams = devices.filter((d) => d.kind === 'videoinput')
  cameraSelect.value.innerHTML = ''
  cams.forEach((c, index) => {
    const option = document.createElement('option')
    option.value = c.deviceId
    option.innerText = c.label || `camera ${index + 1}`
    cameraSelect.value?.appendChild(option)
  })
}

const handleStartScan = async (): Promise<void> => {
  try {
    await initCameras()
    const selected = cameraSelect.value?.value || undefined
    await startCamera(selected)
    setButtonDisabled(startScanBtn, true)
    setButtonDisabled(stopScanBtn, false)
    setButtonDisabled(resetDecoderBtn, false)
    if (decoderLog.value) {
      decoderLog.value.innerText = ''
    }
    scanTimer = window.setInterval(scanOnce, 300)
  } catch (error) {
    alert(`打开摄像头失败：${String(error)}`)
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
  setButtonDisabled(startScanBtn, false)
  setButtonDisabled(stopScanBtn, true)
}

const handleResetDecoder = (): void => {
  decoderState = { total: null, hash: null, parts: {} }
  if (partsList.value) {
    partsList.value.innerHTML = ''
  }
  if (recovered.value) {
    recovered.value.value = ''
  }
  if (decoderLog.value) {
    decoderLog.value.innerText = ''
  }
  logDecoder('接收器已重置')
}

onMounted(() => {
  if (navigator.mediaDevices && typeof navigator.mediaDevices.getUserMedia === 'function') {
    initCameras().catch(() => {
      // 用户未授权时忽略
    })
  }
})

onUnmounted(() => {
  handleStopScan()
})
</script>

