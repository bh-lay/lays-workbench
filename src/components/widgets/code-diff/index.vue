<style lang="stylus" scoped>
.formatter-widgets
  height 100%
  display flex
  flex-direction column
  align-items center
  justify-content center
  cursor pointer
  background-image linear-gradient(150deg, #900938, #ff6a00)
  box-shadow inset 1px 1px 1px rgba(255, 255, 255, .1), inset -1px -1px 1px rgba(0, 0, 0, .2)
  transition 2s
  &:hover
    background-image linear-gradient(150deg, #970000, #d45800)
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
</style>
<template>
  <div
    class="formatter-widgets"
    @click="open"
  >
    <v-mdi
      name="mdi-vector-difference"
      :class="{
        small: widgetsSize === BookmarkSize.small
      }"
    />
    <template v-if="widgetsSize !== BookmarkSize.small">
      <div class="title">
        文本对比
      </div>
      <div class="desc">
        高效文本差异分析
      </div>
    </template>
  </div>
</template>

<script lang="ts">
import { computed } from 'vue'
import { openBookmark } from '@/assets/ts/bookmark-utils'
import { Bookmark, BookmarkSize } from '@database/entity/bookmark'

export default {
  name: 'CodeDiffWidgetsButton',
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
