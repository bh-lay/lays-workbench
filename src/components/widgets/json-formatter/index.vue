<style lang="stylus" scoped>
.formatter-widgets
  height 100%
  display flex
  flex-direction column
  align-items center
  justify-content center
  cursor pointer
  background #f44336
  transition .2s
  &:hover
    background #9b2f27
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
      name="mdi-code-json"
      :class="{
        small: widgetsSize === BookmarkSize.small
      }"
    />
    <template v-if="widgetsSize !== BookmarkSize.small">
      <div class="title">
        JSON格式化
      </div>
      <div class="desc">
        数据查看好帮手
      </div>
    </template>
  </div>
</template>

<script lang="ts">
import { computed } from 'vue'
import { replaceRouter } from '@/assets/ts/router'
import { Bookmark, BookmarkSize } from '@database/entity/bookmark'

export default {
  name: 'JsonFormatterWidgetsButton',
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
        replaceRouter('widgets', 'json-formatter')
      },
    }
  },
}
</script>
