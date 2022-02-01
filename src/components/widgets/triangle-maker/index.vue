<style lang="stylus" scoped>
.tri-maker
  background #5983a6
  display flex
  flex-direction row
  align-items center
  justify-content center
  height 100%
.info
  padding 0 0 10px 20px
  .title
    margin-bottom 10px
    font-size 18px
    color #dee6ed
  .desc
    font-size 13px
    color #94b2d1
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
    <triangle-selector @selected="handleSelected" />
    <div
      v-if="widgetsSize === BookmarkSize.large"
      class="info"
    >
      <div class="title">
        三角形生成器
      </div>
      <div class="desc">
        箭头角标 CSS 全搞定
      </div>
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
