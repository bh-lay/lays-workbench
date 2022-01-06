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
    overflow hidden
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
    font-size calc((var(--grid-size) - var(--grid-gap)) * 0.2)
  &:hover
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
    font-size calc((var(--grid-size) * 2 - var(--grid-gap)) * 0.2)
  .card
    width calc(var(--grid-size) * 2 - var(--grid-gap))
    height calc(var(--grid-size) * 2 - var(--grid-gap))
.item-size-large
  grid-area span 2 / span 4 / auto / auto
  width calc(var(--grid-size) * 4)
  height calc(var(--grid-size) * 2)
  .bookmark-icon
    font-size calc((var(--grid-size) * 4 - var(--grid-gap)) * 0.14)
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
      v-if="$slots.body"
      class="card"
    >
      <slot name="body" />
    </div>
    <bookmark-icon-link
      v-else-if="data.type === BookmarkType.link"
      class="card"
      :icon="data.icon"
      :undercoat="data.undercoat"
      :url="data.value"
      @click="$emit('next', data)"
    />
    <bookmark-icon-widgets
      v-else-if="data.type === BookmarkType.widgets"
      class="card"
      :data="data"
    />
    <folder-card
      v-else-if="data.type === BookmarkType.folder"
      class="card"
      :data="data"
      @next="$emit('next', $event)"
    />
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
