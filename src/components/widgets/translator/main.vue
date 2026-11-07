<style lang="stylus" scoped>
.source-input :deep(textarea)
  height 120px
  border none
  border-radius 8px
  background rgba(255, 255, 255, .06)
  transition .15s
  &:focus
    background rgba(255, 255, 255, .1)
.translator
  display flex
  flex-direction column
  box-sizing border-box
  height 100%
  padding 20px
  .caption
    margin-bottom 16px
    line-height 24px
    font-size 16px
    font-weight bold
    color #e3e3e8
  .lang-bar
    display flex
    align-items center
    gap 10px
    .dropdown-button
      display flex
      align-items center
      width 90px
      height 36px
      line-height 36px
      text-align center
      font-size 14px
      color #e3e3e8
      background rgba(255, 255, 255, .08)
      border none
      border-radius 6px
      cursor pointer
      transition .15s
      span
        width 50px
        flex-grow 1
        text-align center
      &:hover
        background rgba(255, 255, 255, .14)
    .swap-btn
      flex-shrink 0
      width 36px
      height 36px
      padding 0
      border none
      border-radius 6px
      font-size 18px
      line-height 36px
      text-align center
      color #a2a2ae
      background rgba(255, 255, 255, .08)
      cursor pointer
      transition .15s
      &:hover
        color #4f8cff
        background rgba(255, 255, 255, .14)
  .actions
    display flex
    justify-content space-between
    margin-top 12px
    .translate-btn
      height 36px
      padding 0 22px
      border none
      border-radius 6px
      font-size 14px
      color #fff
      background #4f8cff
      cursor pointer
      transition .15s
      &:hover
        background #6b9dff
      &:disabled
        opacity .5
        cursor not-allowed
  .result
    flex-grow 1
    margin-top 16px
    padding 12px 14px
    border-radius 8px
    overflow auto
    background rgba(0, 0, 0, .2)
    .result-text
      line-height 1.8
      font-size 16px
      color #e3e3e8
      white-space pre-wrap
      word-break break-word
    .result-meta
      display flex
      align-items center
      justify-content space-between
      margin-top 10px
      .source
        font-size 12px
        color #8a8a94
      .copy-btn
        border none
        padding 2px 6px
        border-radius 4px
        font-size 12px
        color #4f8cff
        background transparent
        cursor pointer
        transition .15s
        &:hover
          background rgba(79, 140, 255, .15)
  .error
    margin-top 12px
    line-height 20px
    font-size 13px
    color #ff6b6b
</style>

<template>
  <div class="translator allow-user-select-text">
    <div class="caption">
      翻译
    </div>
    <v-input
      v-model="inputText"
      class="source-input"
      type="textarea"
      placeholder="输入要翻译的文字…"
      spellcheck="false"
    />
    <div class="actions">
      <div class="lang-bar">
        <v-dropdown :arrow="true">
          <span>{{ languageCode2Label(sourceLang) }}</span>
          <template #body>
            <v-dropdown-item
              v-for="lang in languages"
              :key="lang.code"
              :active="sourceLang === lang.code"
              :disabled="lang.code === targetLang"
              @click="sourceLang = lang.code"
            >
              {{ lang.label }}
            </v-dropdown-item>
          </template>
        </v-dropdown>
        <v-button
          class="swap-btn"
          type="button"
          aria-label="交换语言"
          @click="swapLang"
        >
          ⇄
        </v-button>
        <v-dropdown :arrow="true">
          <span>{{ languageCode2Label(targetLang) }}</span>
          <template #body>
            <v-dropdown-item
              v-for="lang in languages"
              :key="lang.code"
              :active="targetLang === lang.code"
              :disabled="lang.code === sourceLang"
              @click="targetLang = lang.code"
            >
              {{ lang.label }}
            </v-dropdown-item>
          </template>
        </v-dropdown>
      </div>
      <button
        class="translate-btn"
        type="button"
        :disabled="loading"
        @click="translate"
      >
        {{ loading ? '翻译中…' : '翻译' }}
      </button>
    </div>
    <div
      v-if="result"
      class="result"
    >
      <div class="result-text">
        {{ result }}
      </div>
      <div class="result-meta">
        <span class="source">来源：{{ sourceLabel || '缓存' }}</span>
        <button
          class="copy-btn"
          type="button"
          @click="copyResult"
        >
          复制
        </button>
      </div>
    </div>
    <p
      v-if="error"
      class="error"
    >
      {{ error }}
    </p>
  </div>
</template>

<script lang="ts">
import { onMounted, ref } from 'vue'

interface Language {
  code: string
  label: string
}

type TranslateCache = Record<string, string>

const languages: Language[] = [
  { code: 'zh-CN', label: '中文' },
  { code: 'en', label: '英语' },
  { code: 'ja', label: '日语' },
  { code: 'ko', label: '韩语' },
  { code: 'fr', label: '法语' },
  { code: 'de', label: '德语' },
  { code: 'ru', label: '俄语' },
  { code: 'es', label: '西语' },
]

function languageCode2Label(code: string): string {
  const lang = languages.find(lang => lang.code === code)
  return lang ? lang.label : code
}
const cacheStorageKey = 'widget-translator-cache-v1'

function readCache(): TranslateCache {
  try {
    return JSON.parse(localStorage.getItem(cacheStorageKey) || '{}')
  } catch {
    return {}
  }
}

function writeCache(cache: TranslateCache) {
  try {
    localStorage.setItem(cacheStorageKey, JSON.stringify(cache))
  } catch {
    // 缓存写入失败不影响翻译主流程
  }
}

interface YouchuangResponse {
  code?: number
  data?: {
    result?: unknown
  }
}

// 优创翻译 API
async function translateViaYouchuang(text: string, from: string, to: string): Promise<string | null> {
  const url = `https://apis.uctb.cn/api/qqfy?text=${encodeURIComponent(text)}&from=${from}&to=${to}`
  const response: YouchuangResponse = await (await fetch(url)).json()
  if (response.code !== 200 || !response.data || !response.data.result) {
    return null
  }
  const result = String(response.data.result)
  return result.includes('IS AN INVALID') ? null : result
}

// Google 翻译 API 兜底
async function translateViaGoogle(text: string, from: string, to: string): Promise<string | null> {
  const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${from}&tl=${to}&dt=t&q=${encodeURIComponent(text)}`
  const response = await (await fetch(url)).json()
  if (!Array.isArray(response) || !Array.isArray(response[0])) {
    return null
  }
  return response[0]
    .map((item: unknown) => {
      return Array.isArray(item) && typeof item[0] === 'string' ? item[0] : ''
    })
    .join('')
}

export default {
  name: 'TranslatorWidgets',
  props: {
    initialText: {
      type: String,
      default: '',
    },
    initialSourceLang: {
      type: String,
      default: 'en',
    },
    initialTargetLang: {
      type: String,
      default: 'zh-CN',
    },
  },
  setup(props: {
    initialText: string,
    initialSourceLang: string,
    initialTargetLang: string,
  }) {
    const inputText = ref(props.initialText || '')
    const sourceLang = ref(props.initialSourceLang || 'en')
    const targetLang = ref(props.initialTargetLang || 'zh-CN')
    const result = ref('')
    const loading = ref(false)
    const error = ref('')
    const sourceLabel = ref('')

    async function translate() {
      const text = inputText.value.trim()
      if (!text) {
        return
      }
      loading.value = true
      error.value = ''
      result.value = ''
      sourceLabel.value = ''

      const cacheKey = `${sourceLang.value}|${targetLang.value}|${text}`
      const cache = readCache()
      if (cache[cacheKey]) {
        result.value = cache[cacheKey]
        loading.value = false
        return
      }

      let translated: string | null = null
      try {
        translated = await translateViaYouchuang(text, sourceLang.value, targetLang.value)
        if (translated) {
          sourceLabel.value = '优创API'
        }
      } catch {
        // 优创接口失败后走 Google 兜底
      }
      if (!translated) {
        try {
          translated = await translateViaGoogle(text, sourceLang.value, targetLang.value)
          if (translated) {
            sourceLabel.value = 'Google'
          }
        } catch {
          // 两个引擎都失败
        }
      }

      if (translated) {
        result.value = translated
        cache[cacheKey] = translated
        writeCache(cache)
      } else {
        error.value = '翻译服务暂不可用，请稍后再试'
      }
      loading.value = false
    }

    function swapLang() {
      const lang = sourceLang.value
      sourceLang.value = targetLang.value
      targetLang.value = lang
      const text = inputText.value
      inputText.value = result.value
      result.value = text
    }

    async function copyResult() {
      if (!result.value) {
        return
      }
      try {
        await navigator.clipboard.writeText(result.value)
      } catch {
        // 复制失败时静默处理
      }
    }

    onMounted(() => {
      // 快捷入口带入文本时，直接进行首轮翻译
      if (inputText.value.trim()) {
        translate()
      }
    })

    return {
      languages,
      inputText,
      sourceLang,
      targetLang,
      result,
      loading,
      error,
      sourceLabel,
      translate,
      swapLang,
      copyResult,
      languageCode2Label,
    }
  },
}
</script>
