<style lang="stylus" scoped>
.bookmarks-widgets
  height 100%
  display flex
  flex-direction column
  align-items center
  justify-content center
  cursor pointer
  background #2b425a
  transition .2s
  &:hover
    background #233548
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
    class="bookmarks-widgets"
    @click="open"
  >
    <v-mdi
      name="mdi-book-open-page-variant"
      :class="{
        small: widgetsSize === BookmarkSize.small
      }"
    />
    <template v-if="widgetsSize !== BookmarkSize.small">
      <div class="title">
        小书房
      </div>
      <div class="desc">
        个人书签库
      </div>
    </template>
  </div>
</template>

<script lang="ts">
import { computed } from 'vue'
import { replaceRouter } from '@/assets/ts/router'
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
  setup(props: { data: Bookmark }) {
    const widgetsSize = computed(() => props.data.size)
    return {
      widgetsSize,
      BookmarkSize,
      open() {
        replaceRouter('widgets', 'private-bookmark')
      },
    }
  },
}
</script>
