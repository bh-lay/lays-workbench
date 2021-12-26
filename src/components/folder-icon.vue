<style lang="stylus" scoped>
  .folder-icon
    box-sizing border-box
    height 100%
    transition .4s
    cursor pointer
    &:hover
      background rgba(255, 255, 255, .7)
  .folder-icon-medium .origin-map
    height 100%
    box-sizing border-box
    transform-origin top left
    pointer-events none
    display flex
    flex-wrap wrap
    justify-content space-between
    align-content space-between
    padding calc((var(--grid-size) * 2 - var(--grid-gap)) / 10)
    div
      width calc((var(--grid-size) * 2 - var(--grid-gap)) * .35)
      height calc((var(--grid-size) * 2 - var(--grid-gap)) * .35)
      border-radius 8px
      font-size calc((var(--grid-size) * 2 - var(--grid-gap)) * 0.07)
  .folder-icon-small .origin-map
    width 200%
    height 200%
    transform scale(.5)
    box-sizing border-box
    transform-origin top left
    pointer-events none
    display flex
    flex-wrap wrap
    justify-content space-between
    align-content space-between
    padding calc((var(--grid-size) - var(--grid-gap)) / 4.2)
    div
      width calc((var(--grid-size) - var(--grid-gap)) * 0.7)
      height calc((var(--grid-size) - var(--grid-gap)) * 0.7)
      border-radius 4px
      font-size calc((var(--grid-size) - var(--grid-gap)) * 0.15)
</style>

<template>
  <div
    :class="[
      'folder-icon',
      data.size === BookmarkSize.small ? 'folder-icon-small' : '',
      data.size === BookmarkSize.medium ? 'folder-icon-medium' : ''
    ]"
  >
    <div class="origin-map">
      <div
        v-for="item in bookmarkList"
        :key="item.id"
      >
        <bookmark-icon
          v-if="item.type === BookmarkType.link"
          :icon="item.icon"
          :undercoat="item.undercoat"
          :url="item.value"
          :style="{
            background: item.undercoat
          }"
        />
        <bookmark-widgets-icon
          v-else
          :data="item"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { ref, watch, Ref } from 'vue'
import BookmarkIcon from './bookmark-icon.vue'
import BookmarkWidgetsIcon from './bookmark-widgets-icon.vue'
import { Bookmark, BookmarkSize, BookmarkType } from '@database/entity/bookmark'
import { bookmarkListService } from '@database/services/bookmark-service'

export default {
  components: { BookmarkIcon, BookmarkWidgetsIcon },
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
    let bookmarkList: Ref<Bookmark[]> = ref([])
    const loadList = () => {
      bookmarkListService({
        parent: props.data.id,
      }).then((list) => {
        bookmarkList.value = list.slice(0, 4)
      })
    }
    loadList()
    watch(() => props.data.value, () => {
      loadList()
    })
    return {
      bookmarkList,
      BookmarkSize,
      BookmarkType,
    }
  },
}
</script>
