<template>
  <div class="card">
    <h3>发送端（编码）</h3>
    <label>要传输的文本</label>
    <textarea
      id="sourceText"
      ref="sourceText"
      placeholder="把长文本粘贴到这里——例如几 KB 的说明、短文件内容等"
    ></textarea>

    <label>分片字节上限（估算）</label>
    <input id="chunkSize" ref="chunkSize" type="number" value="600" />

    <label>错误更正等级</label>
    <select id="ecLevel" ref="ecLevel">
      <option value="L">L（低）</option>
      <option value="M" selected>M（中）</option>
      <option value="Q">Q（高）</option>
      <option value="H">H（最高）</option>
    </select>

    <div class="controls">
      <button id="encodeBtn" @click="handleEncode">生成二维码序列</button>
      <button id="exportZipBtn" ref="exportZipBtn" disabled @click="handleExportZip">
        导出图片 ZIP（所有分片）
      </button>
      <button id="playBtn" ref="playBtn" disabled @click="handlePlay">播放二维码序列</button>
    </div>

    <label>生成信息 / 日志</label>
    <div id="encoderLog" ref="encoderLog" class="log"></div>

    <h4>预览（点击图片可放大右键保存）</h4>
    <div id="preview" ref="preview" class="preview"></div>
  </div>
</template>

<script setup lang="ts">
import { Ref, ref, onUnmounted } from 'vue'
import * as QRCode from 'qrcode'
import {
  ErrorCorrectionLevel,
  str2ab,
  splitBytes,
  b64FromBytes,
  sha256Hex,
} from './file-relay-helpers'

interface Frame {
  index: number
  total: number
  hash: string
  payload: string
  dataUrl: string
}

interface JsZipInstance {
  file(name: string, data: string, options?: { base64?: boolean }): JsZipInstance
  generateAsync(options: { type: 'blob' }): Promise<Blob>
}

type JsZipConstructor = new () => JsZipInstance

declare global {
  interface Window {
    JSZip?: JsZipConstructor
  }
}

const PLAY_INTERVAL_MS = 1200

const sourceText = ref<HTMLTextAreaElement | null>(null)
const chunkSize = ref<HTMLInputElement | null>(null)
const ecLevel = ref<HTMLSelectElement | null>(null)
const preview = ref<HTMLDivElement | null>(null)
const encoderLog = ref<HTMLDivElement | null>(null)
const exportZipBtn = ref<HTMLButtonElement | null>(null)
const playBtn = ref<HTMLButtonElement | null>(null)

let frames: Frame[] = []
let playInterval: number | null = null

let overlayRoot: HTMLDivElement | null = null
let overlayImage: HTMLImageElement | null = null
let overlayCounter: HTMLDivElement | null = null

let cachedJsZip: JsZipConstructor | null = null

const loadExternalScript = (src: string): Promise<void> =>
  new Promise((resolve, reject) => {
    const script = document.createElement('script')
    script.src = src
    script.async = true
    script.onload = () => resolve()
    script.onerror = () => reject(new Error(`加载脚本失败：${src}`))
    document.head.appendChild(script)
  })

const ensureJsZip = async (): Promise<JsZipConstructor> => {
  if (cachedJsZip) return cachedJsZip
  if (window.JSZip) {
    cachedJsZip = window.JSZip
    return cachedJsZip
  }
  await loadExternalScript('https://cdn.jsdelivr.net/npm/jszip@3.10.0/dist/jszip.min.js')
  if (!window.JSZip) {
    throw new Error('JSZip 加载失败')
  }
  cachedJsZip = window.JSZip
  return cachedJsZip
}

const logEncoder = (txt: string): void => {
  if (!encoderLog.value) return
  encoderLog.value.innerText += `${txt}\n`
  encoderLog.value.scrollTop = encoderLog.value.scrollHeight
}

const setButtonDisabled = (btn: Ref<HTMLButtonElement | null>, disabled: boolean): void => {
  if (btn.value) {
    btn.value.disabled = disabled
  }
}

const updateOverlayFrame = (frame: Frame): void => {
  if (overlayImage) {
    overlayImage.src = frame.dataUrl
  }
  if (overlayCounter) {
    overlayCounter.innerText = `第 ${frame.index}/${frame.total} 片`
  }
}

const createOverlay = (): void => {
  overlayRoot = document.createElement('div')
  Object.assign(overlayRoot.style, {
    position: 'fixed',
    inset: '0',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'rgba(0,0,0,0.7)',
    zIndex: '9999',
    padding: '16px',
  })

  const content = document.createElement('div')
  Object.assign(content.style, {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '12px',
  })

  overlayImage = document.createElement('img')
  Object.assign(overlayImage.style, {
    width: '60vmin',
    height: 'auto',
    boxShadow: '0 6px 24px rgba(0,0,0,0.45)',
    borderRadius: '12px',
    background: '#fff',
    padding: '12px',
  })

  overlayCounter = document.createElement('div')
  Object.assign(overlayCounter.style, {
    color: '#fff',
    fontSize: '18px',
  })

  const stopBtn = document.createElement('button')
  stopBtn.innerText = '停止播放'
  Object.assign(stopBtn.style, {
    padding: '8px 14px',
    borderRadius: '6px',
    border: 'none',
    background: '#ff6b6b',
    color: '#fff',
    cursor: 'pointer',
    fontSize: '14px',
  })
  stopBtn.addEventListener('click', handleStopPlay)

  content.appendChild(overlayImage)
  content.appendChild(overlayCounter)
  content.appendChild(stopBtn)
  overlayRoot.appendChild(content)
  document.body.appendChild(overlayRoot)
}

const destroyOverlay = (): void => {
  if (overlayRoot) {
    overlayRoot.remove()
  }
  overlayRoot = null
  overlayImage = null
  overlayCounter = null
}

const handleEncode = async (): Promise<void> => {
  if (!sourceText.value || !chunkSize.value || !ecLevel.value || !preview.value) {
    return
  }
  handleStopPlay()
  if (encoderLog.value) {
    encoderLog.value.innerText = ''
  }
  preview.value.innerHTML = ''
  frames = []
  setButtonDisabled(exportZipBtn, true)
  setButtonDisabled(playBtn, true)

  const txt = sourceText.value.value ?? ''
  if (!txt) {
    logEncoder('请先输入要发送的文本。')
    return
  }

  logEncoder('准备编码...')
  const u8 = str2ab(txt)
  const hash = await sha256Hex(u8)
  logEncoder(`SHA-256: ${hash}`)
  const csize = Math.max(100, Number.parseInt(chunkSize.value.value, 10) || 600)
  const parts = splitBytes(u8, csize)
  const total = parts.length
  logEncoder(`分片数量: ${total}（估算每片 ${csize} 字节）`)

  for (let i = 0; i < parts.length; i += 1) {
    const b64 = b64FromBytes(parts[i])
    const header = `ZX|${i + 1}|${total}|${hash}|`
    const payload = header + b64
    try {
      const ec = (ecLevel.value.value as ErrorCorrectionLevel) || 'M'
      const dataUrl = await QRCode.toDataURL(payload, {
        errorCorrectionLevel: ec,
        margin: 1,
        scale: 6,
      })
      frames.push({ index: i + 1, total, hash, payload, dataUrl })
      const img = document.createElement('img')
      img.src = dataUrl
      img.className = 'qr'
      img.title = `part ${i + 1}/${total}`
      img.addEventListener('click', () => {
        window.open(dataUrl)
      })
      preview.value.appendChild(img)
      logEncoder(`生成分片 ${i + 1}/${total}`)
      await new Promise<void>((resolve) => {
        window.setTimeout(() => resolve(), 50)
      })
    } catch (error) {
      logEncoder(`生成分片失败: ${String(error)}`)
    }
  }
  logEncoder('全部生成完毕。')
  if (frames.length > 0) {
    setButtonDisabled(exportZipBtn, false)
    setButtonDisabled(playBtn, false)
  }
}

const handlePlay = (): void => {
  if (frames.length === 0 || playInterval) return
  setButtonDisabled(playBtn, true)
  createOverlay()
  let idx = 0
  updateOverlayFrame(frames[idx])
  playInterval = window.setInterval(() => {
    idx = (idx + 1) % frames.length
    updateOverlayFrame(frames[idx])
  }, PLAY_INTERVAL_MS)
}

const handleStopPlay = (): void => {
  if (playInterval !== null) {
    window.clearInterval(playInterval)
    playInterval = null
  }
  destroyOverlay()
  setButtonDisabled(playBtn, frames.length === 0)
}

const handleExportZip = async (): Promise<void> => {
  if (frames.length === 0) return
  const JSZip = await ensureJsZip()
  const zip = new JSZip()
  frames.forEach((frame, index) => {
    const base64 = frame.dataUrl.split(',')[1]
    zip.file(`part_${String(index + 1).padStart(3, '0')}.png`, base64, { base64: true })
  })
  const blob = await zip.generateAsync({ type: 'blob' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'qr_parts.zip'
  a.click()
  URL.revokeObjectURL(url)
}

onUnmounted(() => {
  handleStopPlay()
})
</script>

