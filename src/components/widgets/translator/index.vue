<style lang="stylus" scoped>
.translator-widgets
  height 100%
  display flex
  flex-direction column
  align-items center
  justify-content center
  cursor pointer
  background-image linear-gradient(160deg, #1d4ed8, #0891b2)
  box-shadow inset 1px 1px 1px rgba(255, 255, 255, .1), inset -1px -1px 1px rgba(0, 0, 0, .2)
  transition .15s
  &:hover
    background-image linear-gradient(150deg, #1e40af, #0e7490)
  svg
    width 32px
    height 32px
    margin 5px 0 10px
    fill #fff
    &.small
      margin 0
      width 24px
  .title
    margin-bottom 2px
    line-height 20px
    font-size 15px
    font-weight bold
    color #fff
  .desc
    line-height 20px
    font-size 12px
    color rgba(255, 255, 255, .6)
  &.translator-widgets-large
    cursor auto
    padding calc(var(--icon-radius) * 0.5)
    box-sizing border-box
    .quick-input
      box-sizing border-box
      width 100%
      height 100%
      padding 14px 16px
      border none
      border-radius calc(var(--icon-radius) * 0.5)
      outline none
      resize none
      font-size 14px
      color #fff
      background rgba(0, 0, 0, .18)
      transition .15s
      &::placeholder
        color rgba(255, 255, 255, .55)
      &:focus
        background rgba(0, 0, 0, .3)
</style>

<template>
  <div
    :class="{
      'translator-widgets': true,
      'translator-widgets-large': widgetsSize === BookmarkSize.large
    }"
    @click="handleClick"
  >
    <template v-if="widgetsSize !== BookmarkSize.large">
      <v-mdi
        name="mdi-translate"
        :class="{
          small: widgetsSize === BookmarkSize.small
        }"
      />
      <template v-if="widgetsSize !== BookmarkSize.small">
        <div class="title">
          翻译
        </div>
        <div class="desc">
          多语言双引擎互译
        </div>
      </template>
    </template>
    <textarea
      v-if="widgetsSize === BookmarkSize.large"
      v-model="quickInput"
      class="quick-input"
      type="text"
      placeholder="输入内容，回车翻译..."
      resize="none"
      @click.stop
      @keydown.enter="startTranslate"
    />
  </div>
</template>

<script lang="ts">
import { computed, ref } from 'vue'
import { openBookmark } from '@/assets/ts/bookmark-utils'
import { Bookmark, BookmarkSize } from '@database/entity/bookmark'

const chineseRegex = /[\u4e00-\u9fff]/

// 识别中文或英文，返回对应的翻译方向
function detectTranslateDirection(text: string) {
  if (chineseRegex.test(text)) {
    // 中文 -> 英语
    return { sourceLang: 'zh-CN', targetLang: 'en' }
  }
  // 其他情况视为英文 -> 中文
  return { sourceLang: 'en', targetLang: 'zh-CN' }
}

export default {
  name: 'TranslatorWidgetsButton',
  props: {
    data: {
      type: Bookmark,
      default() {
        return new Bookmark({})
      },
    },
  },
  setup(props: { data: Bookmark }) {
    const widgetsSize = computed(() => props.data.size)
    const quickInput = ref('')

    function startTranslate() {
      const text = quickInput.value.trim()
      const { sourceLang, targetLang } = detectTranslateDirection(text)
      setTimeout(() => {
        openBookmark(props.data, {
          widgetsData: {
            text,
            sourceLang,
            targetLang,
          },
        })
        quickInput.value = ''
      })
    }

    return {
      widgetsSize,
      BookmarkSize,
      quickInput,
      startTranslate,
      handleClick() {
        if (widgetsSize.value === BookmarkSize.large) {
          return
        }
        openBookmark(props.data)
      },
    }
  },
}
</script>
