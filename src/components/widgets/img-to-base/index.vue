<style lang="stylus" scoped>
.imgtobase-widgets
  display flex
  box-sizing border-box
  height 100%
  background #4caf50
.small
  display flex
  align-items center
  justify-content center
  width 100%
  height 100%
  transition .2s
  color #fff
  cursor pointer
  &:hover
    background rgba(0, 0, 0, .2)
.intro
  padding 16px 0 16px 16px
  .caption
    height 10px
    flex-grow 1
  .title
    margin-bottom 4px
    line-height 20px
    font-weight bold
    font-size 16px
    color #fff
  .desc
    margin-bottom 28px
    line-height 16px
    font-size 12px
    color #adebaf
  button
    width 80px
    height 30px
    border none
    border-radius 4px
    cursor pointer
    background #91cf93
    color #27722a
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
  border-left 1px dashed #8cd98f
  cursor pointer
  transition .2s
  span
    font-size 12px
    color #85e088
  &.active
    background #70c273
  &:hover
    background #58b65c
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
    <div v-else :class="{
      intro: true,
      medium: widgetsSize === BookmarkSize.medium
    }">
      <div class="title">图片base64</div>
      <div class="desc">小图嵌入更容易</div>
      <button @click="$refs.input.click()">上传</button>
    </div>
    <template v-if="widgetsSize === BookmarkSize.large">
      <div
        :class="['drag-area', isDragOver ? 'active' : '']"
        ref="drag_area"
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
    />
  </div>
  <modal
    v-model="modalVisible"
    width="80%"
    height="80%"
    @after-close="afterModalClose"
  >
    <main-function :base64-str="base64Str" />
  </modal>
</template>

<script>
import { ref, computed } from "vue";
import { Bookmark, BookmarkSize } from '../../../database/entity/bookmark.ts';
import { imgToBase64 } from './image-base64.ts'
import MainFunction from './main.vue'
export default {
  components: { MainFunction },
  props: {
    data: {
      type: Bookmark,
      default() {
        return new Bookmark({})
      },
    }
  },
  setup(props) {
    const modalVisible = ref(false)
    const isDragOver = ref(false)
    const base64Str = ref('')
    const widgetsSize = computed(() => props.data.size)
    return {
      modalVisible,
      isDragOver,
      base64Str,
      widgetsSize,
      BookmarkSize,
    };
  },
  mounted() {
    const dragAreaNode = this.$refs.drag_area
    if (!dragAreaNode) {
      return
    }
    dragAreaNode.addEventListener('dragover', e => {
      e.stopPropagation()
      e.preventDefault()
      e.dataTransfer.dropEffect = 'copy'
      this.isDragOver = true
    })
    dragAreaNode.addEventListener('dragleave', e => {
      this.isDragOver = false
    })
    dragAreaNode.addEventListener("drop", e => {
      e.stopPropagation()
      e.preventDefault()
      var files = e.dataTransfer.files
      this.handleSelectFile(files[0])
      this.isDragOver = false
    })
  },
  methods: {
    handleInputChange(event) {
      this.handleSelectFile(event.target.files[0])
    },
    handleSelectFile(file) {
      console.log('file', file)
      if (file.size > 2 * 1024 * 1024) {
        alert('图片大于 2M，不建议使用 base64！')
        return
      }
      imgToBase64(file)
        .then(base64 => {
          console.log('base64', base64)
          this.base64Str = base64
          this.modalVisible = true
        })
        .catch(() => {})
    },
    afterModalClose() {
      this.base64Str = ''
    }
  },
};
</script>
