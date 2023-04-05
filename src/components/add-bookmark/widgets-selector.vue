<style lang="stylus" scoped>
@import '../../assets/stylus/functions/scrollbar.styl'
.widgets-selector
  padding-top 20px
.size-selector
  margin 0 auto 20px
.scroll-area
  height 500px
  max-height calc(90vh - 150px)
  overflow auto
  scrollbar #26262c
.bookmark-item
  cursor pointer
  :deep(.card)
    pointer-events none
    transition .2s
  &:hover
    :deep(.card)
      transform scale(.9)
.widgets-selector-body
  display grid
  grid-template-columns repeat(auto-fill, var(--grid-size))
  grid-template-rows repeat(auto-fill, var(--grid-size))
  grid-auto-flow dense
  justify-content center
</style>

<template>
  <div class="widgets-selector">
    <size-selector v-model="previewSize" />
    <div class="scroll-area">
      <div class="widgets-selector-body">
        <bookmark-item
          v-for="item in widgetsList"
          :key="item.id"
          :data="item"
          @click="$emit('confirm', item)"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Ref, ref, watch } from 'vue'
import { Bookmark, BookmarkType, BookmarkSize } from '@database/entity/bookmark'
import BookmarkItem from '../bookmark-item.vue'
import SizeSelector from './size-selector.vue'

const supportWidgetsList = [
  {
    label: '正则可视化',
    name: 'reg-visual',
  },
  {
    label: 'JSON格式化',
    name: 'json-formatter',
  },
  {
    label: '图片base64',
    name: 'img-to-base',
  },
  {
    label: '藏经阁',
    name: 'public-bookmarks',
  },
  {
    label: '小书房',
    name: 'private-bookmarks',
  },
  {
    label: '三角形生成器',
    name: 'triangle-maker',
  },
  {
    label: '倒计时',
    name: 'countdown',
  },
]

export default {
  components: { BookmarkItem, SizeSelector },
  emits: ['confirm'],
  setup() {
    const previewSize = ref(BookmarkSize.large)
    const widgetsList: Ref<Bookmark[]> = ref([])
    watch(previewSize, size => {
      widgetsList.value.forEach(item => {
        item.size = size
      })
    })

    supportWidgetsList.forEach(item => {
      widgetsList.value.push(
        new Bookmark({
          type: BookmarkType.widgets,
          size: BookmarkSize.large,
          value: item.name,
          name: item.label,
        })
      )
    })
    return {
      previewSize,
      widgetsList,
    }
  },
}
</script>
