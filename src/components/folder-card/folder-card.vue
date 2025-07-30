<style lang="stylus" scoped>
  .folder-card
    box-sizing border-box
    height 100%
    height 100%
    box-sizing border-box
    background rgba(255, 255, 255, .3)
    & > div
      overflow hidden
  .mini-icon
    cursor pointer
    transition background .2s
    .origin-map
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
      div
        border-radius 8px
        overflow hidden
    &:hover
      background rgba(255, 255, 255, .5)
  .folder-card-small
    .mini-icon
      width 100%
      height 100%
  .origin-map
    padding calc((var(--grid-size) * 0.6) / 5)
    div
      width calc((var(--grid-size) * 0.6) * 0.75)
      height calc((var(--grid-size) * 0.6) * 0.75)
      font-size calc((var(--grid-size) * 0.6) * 0.18)
  .folder-card-large,
  .folder-card-medium
    display grid
    padding calc(var(--grid-size) * 0.1)
    grid-template-rows repeat(auto-fill, calc(var(--grid-size) * 0.7))
    grid-template-columns repeat(auto-fill, calc(var(--grid-size) * 0.7))
    grid-auto-flow dense
    justify-content space-between
    align-items center
    justify-items center
    & > div
      width calc((var(--grid-size) * 0.6))
      height calc((var(--grid-size) * 0.6))
      border-radius 8px
</style>

<template>
  <div
    :class="{
      'folder-card': true,
      'folder-card-small': data.size === BookmarkSize.small,
      'folder-card-medium': data.size === BookmarkSize.medium,
      'folder-card-large': data.size === BookmarkSize.large
    }"
    @click="handleClickEmpty"
  >
    <item-icon
      v-for="item in bookmarkListNormal"
      :key="item.id"
      :data="item"
      :title="item.name"
      class="folder-card-item"
      @next="$emit('next', item)"
    />
    <div
      v-if="bookmarkListMini.length"
      class="mini-icon"
      @click="$emit('next', data)"
    >
      <div class="origin-map">
        <item-icon
          v-for="item in bookmarkListMini"
          :key="item.id"
          :data="item"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { ref, watch, Ref } from 'vue'
import ItemIcon from './item-icon.vue'
import { Bookmark, BookmarkSize, BookmarkType } from '@database/entity/bookmark'
import { bookmarkListService } from '@database/services/bookmark-service'

export default {
  components: { ItemIcon },
  props: {
    data: {
      type: Bookmark,
      default() {
        return new Bookmark({})
      },
    },
  },
  emits: ['next'],
  setup(props: {
    data: Bookmark
  }, context) {
    let bookmarkListNormal: Ref<Bookmark[]> = ref([])
    let bookmarkListMini: Ref<Bookmark[]> = ref([])
    const loadList = () => {
      bookmarkListService({
        parent: props.data.id,
      }).then((list) => {
        const cardSize = props.data.size
        // 强制更改为小组件模式
        list.forEach(item => {
          item.size = BookmarkSize.small
        })
        let normalIconCount = 0
        if (cardSize === BookmarkSize.large) {
          normalIconCount = list.length === 8 ? 8 : 7
        } else if (cardSize === BookmarkSize.medium) {
          normalIconCount = list.length === 4 ? 4 : 3
        } else if (cardSize === BookmarkSize.small) {
          normalIconCount = 0
        }
        bookmarkListNormal.value = list.slice(0, normalIconCount)
        bookmarkListMini.value = list.slice(normalIconCount, normalIconCount + 4)
      })
    }
    loadList()
    watch(() => props.data.value, () => {
      loadList()
    })
    watch(() => props.data.size, () => {
      loadList()
    })
    return {
      bookmarkListNormal,
      bookmarkListMini,
      BookmarkSize,
      BookmarkType,
      handleClickEmpty(event: MouseEvent) {
        const target = event.target as HTMLDivElement
        if (target.classList.contains('folder-card')) {
          context.emit('next', props.data)
        }
      },
    }
  },
}
</script>
