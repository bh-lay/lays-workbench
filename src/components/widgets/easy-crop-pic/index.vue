<style lang="stylus" scoped>
.imgtobase-widgets
  display flex
  box-sizing border-box
  height 100%
  background #d7ecf1
  --primary-color #415358
  --secondary-color #5d7d86
  --third-color #c9dce1
  --fouth-color #b1cad1
.small
  display flex
  align-items center
  justify-content center
  width 100%
  height 100%
  transition .2s
  color color var(--primary-color)
  cursor pointer
  &:hover
    background rgba(0, 0, 0, .2)
.intro
  width 40%
  padding 16px 0 16px 16px
  font-size 14px
  .caption
    height 10px
    flex-grow 1
  .title
    margin-bottom 4px
    line-height 20px
    font-weight bold
    font-size 16px
    color var(--primary-color)
  .desc
    margin-bottom 28px
    line-height 16px
    font-size 12px
    color var(--secondary-color)
  button
    width 80px
    height 30px
    border none
    border-radius 4px
    cursor pointer
    background var(--fouth-color)
    color var(--primary-color)
    transition .5s
    &:active,
    &:focus
      outline none
    &:hover
      background #fff
  &.medium
    width 100%
    padding 16px
    text-align center
.drag-area
  margin-left 20px
  display flex
  flex-grow 1
  align-items center
  justify-content center
  border-left 1px dashed #cbdce0
  cursor pointer
  transition .2s
  span
    font-size 12px
    color var(--secondary-color)
  &:hover
    background var(--third-color)
  &:active
    background var(--fouth-color)
.hidden-input
  position absolute
  width 0
  height 0
  opacity 0
  visibility hidden
</style>

<template>
  <div class="imgtobase-widgets">
    <div
      v-if="widgetsSize === BookmarkSize.small"
      class="small"
      @click="$refs.input.click()"
    >
      <v-mdi name="mdi-image-move" />
    </div>
    <div
      v-else
      :class="{
        intro: true,
        medium: widgetsSize === BookmarkSize.medium
      }"
    >
      <div class="title">
        简裁变图
      </div>
      <div class="desc">
        图片尺寸随意拿捏
      </div>
      <button @click="$refs.input.click()">
        上传
      </button>
    </div>
    <template v-if="widgetsSize === BookmarkSize.large">
      <div
        ref="dragArea"
        :class="['drag-area', isDragOver ? 'active' : '']"
        @click="$refs.input.click()"
      >
        <span>拖拽图片至此处</span>
      </div>
    </template>
    <input
      ref="input"
      type="file"
      accept="image/*"
      class="hidden-input"
      @change="handleInputChange"
    >
  </div>
</template>

<script lang="ts">
import { ref, Ref, computed, onMounted } from 'vue'
import { Bookmark, BookmarkSize } from '@database/entity/bookmark'
import { openBookmark } from '@/assets/ts/bookmark-utils'
export default {
  name: 'EasyCropPicWidgetsButton',
  props: {
    data: {
      type: Bookmark,
      default() {
        return new Bookmark({})
      },
    },
  },
  setup(props: { data: Bookmark }) {
    const isDragOver = ref(false)
    const base64Str = ref('')
    const widgetsSize = computed(() => props.data.size)
    const dragArea: Ref<HTMLElement | null> = ref(null)

    function handleSelectFile(file: File) {
      openBookmark(props.data, {
        widgetsData: {
          file,
        },
      })
    }
    onMounted(() => {
      const dragAreaNode = dragArea.value
      if (!dragAreaNode) {
        return
      }
      dragAreaNode.addEventListener('dragover', (e: DragEvent) => {
        e.stopPropagation()
        e.preventDefault()
        if (e.dataTransfer) {
          e.dataTransfer.dropEffect = 'copy'
        }
        isDragOver.value = true
      })
      dragAreaNode.addEventListener('dragleave', () => {
        isDragOver.value = false
      })
      dragAreaNode.addEventListener('drop', (e: DragEvent) => {
        e.stopPropagation()
        e.preventDefault()
        if (e.dataTransfer) {
          var files = e.dataTransfer.files
          handleSelectFile(files[0])
        }
        isDragOver.value = false
      })
    })
    return {
      dragArea,
      isDragOver,
      base64Str,
      widgetsSize,
      BookmarkSize,
      handleInputChange(event: InputEvent) {
        const eventTarget = event.target as null | {
          files: File[]
        }
        if (!eventTarget) {
          return
        }
        if (!eventTarget.files) {
          return
        }
        if (!eventTarget.files[0]) {
          return
        }
        handleSelectFile(eventTarget.files[0])
      },
    }
  },
}
</script>
