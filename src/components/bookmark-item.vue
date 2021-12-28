<style lang="stylus" scoped>
.bookmark-item
  position relative
  width var(--grid-size)
  height var(--grid-size)
  grid-area span 1 / span 1 / auto / auto
  .card
    width calc(var(--grid-size) - var(--grid-gap))
    height calc(var(--grid-size) - var(--grid-gap))
    margin 0 auto
    border-radius var(--icon-radius)
    background #333
    overflow hidden
    transition 0.15s
  .title
    height 16px
    padding-top 4px
    line-height 16px
    text-align center
    font-size 12px
    color #fff
    text-shadow 1px 1px 1px rgba(0, 0, 0, .4), 1px 1px 4px rgba(0, 0, 0, .4)
    overflow hidden
    text-overflow ellipsis
    white-space nowrap
  .popover
    position absolute
    bottom 110%
    left 50%
    width auto
    z-index 20
    opacity 0
    transform translateX(-50%) scale(.9)
    visibility hidden
    transition .15s
  .bookmark-icon
    font-size 10px
  &:hover
    .card
      box-shadow 2px 2px 8px rgba(0, 0, 0, 0.1), 0 0 2px rgba(0, 0, 0, 0.3)
    .popover
      visibility visible
      transform translateX(-50%) scale(1)
      opacity 1
      transition .15s .3s ease-out
.item-size-medium
  grid-area span 2 / span 2 / auto / auto
  width calc(var(--grid-size) * 2)
  height calc(var(--grid-size) * 2)
  .bookmark-icon
    font-size 18px
  .card
    width calc(var(--grid-size) * 2 - var(--grid-gap))
    height calc(var(--grid-size) * 2 - var(--grid-gap))
.item-size-large
  grid-area span 2 / span 4 / auto / auto
  width calc(var(--grid-size) * 4)
  height calc(var(--grid-size) * 2)
  .bookmark-icon
    font-size 26px
  .card
    width calc(var(--grid-size) * 4 - var(--grid-gap))
    height calc(var(--grid-size) * 2 - var(--grid-gap))
.item-size-three_one
  width calc(var(--grid-size) * 3)
  height var(--grid-size)
  grid-area span 1 / span 3 / auto / auto
  .card
    width calc(var(--grid-size) * 3 - var(--grid-gap))
</style>

<template>
  <div :class="['bookmark-item', 'item-size-' + BookmarkSize[data.size]]">
    <div
      class="card"
      :style="{
        background: data.type === BookmarkType.folder ? 'rgba(255, 255, 255, .5)' : data.undercoat
      }"
    >
      <slot
        v-if="$slots.body"
        name="body"
      />
      <bookmark-icon-link
        v-else-if="data.type === BookmarkType.link"
        :icon="data.icon"
        :undercoat="data.undercoat"
        :url="data.value"
        @click="$emit('next', data)"
      />
      <bookmark-icon-widgets
        v-else-if="data.type === BookmarkType.widgets"
        :data="data"
      />
      <folder-card
        v-else-if="data.type === BookmarkType.folder"
        :data="data"
        @next="$emit('next', $event)"
      />
    </div>
    <div class="title">
      {{ data.name }}
    </div>
  </div>
</template>

<script lang="ts">
import { Bookmark, BookmarkType, BookmarkSize } from '@database/entity/bookmark'
import BookmarkIconLink from './bookmark-icon-link.vue'
import FolderCard from './folder-card/folder-card.vue'
import BookmarkIconWidgets from './bookmark-icon-widgets.vue'

export default {
  components: {
    BookmarkIconWidgets,
    BookmarkIconLink,
    FolderCard,
  },
  props: {
    data: {
      type: Bookmark,
      default() {
        return new Bookmark({})
      },
    },
  },
  emits: ['next'],
  setup() {
    return {
      BookmarkType,
      BookmarkSize,
    }
  },
}
</script>
