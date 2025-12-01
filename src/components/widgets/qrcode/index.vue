<style lang="stylus" scoped>
.qrcode-widgets
  height 100%
  display flex
  flex-direction column
  align-items center
  justify-content center
  cursor pointer
  background-image linear-gradient(160deg, #094f90, #59b7ce)
  box-shadow inset 1px 1px 1px rgba(255, 255, 255, .1), inset -1px -1px 1px rgba(0, 0, 0, .2)
  &:hover
    background-image linear-gradient(150deg, #164774, #3a8da1)
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
  padding 0 10px
  line-height 20px
  text-align center
  font-size 12px
  color rgba(255, 255, 255, .6)
</style>
<template>
  <div
    class="qrcode-widgets"
    @click="open"
  >
    <v-mdi
      name="mdi-qrcode-scan"
      :class="{
        small: widgetsSize === BookmarkSize.small
      }"
    />
    <div
      v-if="widgetsSize !== BookmarkSize.small"
      class="title"
    >
      二维码工具
    </div>
    <div
      v-if="widgetsSize === BookmarkSize.medium"
      class="desc"
    >
      跨设备文本离线分享
    </div>
    <div
      v-else-if="widgetsSize === BookmarkSize.large"
      class="desc"
    >
      跨设备文本离线分享，支持超大文件
    </div>
  </div>
</template>

<script lang="ts">
import { computed } from 'vue'
import { openBookmark } from '@/assets/ts/bookmark-utils'
import { Bookmark, BookmarkSize } from '@database/entity/bookmark'

export default {
  props: {
    data: {
      type: Bookmark,
      default() {
        return new Bookmark({})
      },
    },
  },
  setup(props: {
    data: Bookmark
  }) {
    const widgetsSize = computed(() => props.data.size)
    return {
      widgetsSize,
      BookmarkSize,
      open() {
        openBookmark(props.data)
      },
    }
  },
}
</script>
