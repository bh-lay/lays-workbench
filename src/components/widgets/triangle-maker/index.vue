<style lang="stylus" scoped>
.tri-maker
  background #5983a6
  display flex
  flex-direction row
  align-items center
  justify-content center
  height 100%
.triangle-selector
  position relative
  width 100px
  height 100%
  border 1px dashed #7a9cb8
  span
    display block
    width 0
    height 0
    border 50px solid #4f7492
  &:before,
  &:after
    position absolute
    content ''
    display block
    width 141.421%
    height 1px
    border-top 1px dashed #7a9cb8
    transform-origin left center
  &:before
    transform rotate(45deg)
  &:after
    transform rotate(-45deg)
</style>

<template>
  <div
    :class="{
      'tri-maker': true,
      'tri-maker-small': widgetsSize === BookmarkSize.small,
      'tri-maker-medium': widgetsSize === BookmarkSize.medium,
      'tri-maker-large': widgetsSize === BookmarkSize.large,
    }"
    @click="handleClick"
  >
    <div
      class="main-text"
    >
      <triangle-selector @selected="handleSelected" />
    </div>
  </div>
</template>

<script lang="ts">
import { ref, computed } from 'vue'
import { Bookmark, BookmarkSize } from '@database/entity/bookmark'
import { replaceRouter } from '@/assets/ts/router'
import TriangleSelector from './triangle-selector.vue'
export default {
  name: 'TriangleMakerButton',
  components: { TriangleSelector },
  props: {
    data: {
      type: Bookmark,
      default() {
        return new Bookmark({})
      },
    },
  },
  setup(props: { data: Bookmark }) {
    const quickInput = ref('')
    const widgetsSize = computed(() => props.data.size)
    return {
      BookmarkSize,
      widgetsSize,
      quickInput,
      handleSelected(index: number) {
        replaceRouter('widgets', 'triangle-maker', {
          defaultIndex: index,
        })
      },
    }
  },
}
</script>
