export const errorCorrectionLevels = ['L', 'M', 'Q', 'H'] as const
export type ErrorCorrectionLevel = typeof errorCorrectionLevels[number]

export interface RelayFrame {
  index: number
  total: number
  hash: string
  payload: string
  dataUrl: string
}

export interface DecoderState {
  total: number | null
  hash: string | null
  parts: Record<number, string>
}

const textEncoder = new TextEncoder()
const textDecoder = new TextDecoder()

export function str2ab(str: string): Uint8Array {
  return textEncoder.encode(str)
}

export function ab2str(buf: Uint8Array): string {
  return textDecoder.decode(buf)
}

export function splitBytes(u8: Uint8Array, chunkBytes: number): Uint8Array[] {
  const parts: Uint8Array[] = []
  for (let i = 0; i < u8.length; i += chunkBytes) {
    parts.push(u8.slice(i, i + chunkBytes))
  }
  return parts
}

export function b64FromBytes(u8: Uint8Array): string {
  let binary = ''
  const chunk = 0x8000
  for (let i = 0; i < u8.length; i += chunk) {
    binary += String.fromCharCode.apply(null, Array.from(u8.slice(i, i + chunk)))
  }
  return btoa(binary)
}

export function bytesFromB64(b64: string): Uint8Array {
  const binary = atob(b64)
  const len = binary.length
  const u8 = new Uint8Array(len)
  for (let i = 0; i < len; i += 1) {
    u8[i] = binary.charCodeAt(i)
  }
  return u8
}

export async function sha256Hex(uint8arr: Uint8Array): Promise<string> {
  const buffer =
    uint8arr.byteOffset === 0 && uint8arr.byteLength === uint8arr.buffer.byteLength
      ? (uint8arr.buffer as ArrayBuffer)
      : (uint8arr.slice().buffer as ArrayBuffer)
  const h = await crypto.subtle.digest('SHA-256', buffer)
  const bytes = new Uint8Array(h)
  return Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')
}

