<style lang="stylus" scoped>
.imgtobase-widgets
  display flex
  box-sizing border-box
  height 100%
  padding 16px
.side
  margin-right 20px
  .caption
    height 10px
    flex-grow 1
  .title
    margin-bottom 4px
    line-height 20px
    font-weight bold
    font-size 18px
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
.drag-area
  display flex
  flex-grow 1
  align-items center
  justify-content center
  border 1px dashed #8cd98f
  transition .2s
  span
    font-size 12px
    color #85e088
  &.active
    background #70c273
.hidden-input
  position absolute
  width 0
  height 0
  opacity 0
  visibility hidden
</style>

<template>
  <div class="imgtobase-widgets">
    <div class="side">
      <div class="title">图片base64</div>
      <div class="desc">小图嵌入更容易</div>
      <button @click="$refs.input.click()">上传</button>
    </div>
    <div :class="['drag-area', isDragOver ? 'active' : '']" ref="drag_area">
      <span>拖拽图片至此处</span>
    </div>
    <input
      ref="input"
      type="file"
      accept="image/*"
      class="hidden-input"
      @change="handleInputChange"
    />
  </div>
  <modal v-model:visible="regVisualVisible" >
  </modal>
</template>

<script>
import { ref } from "vue";
export default {
  setup() {
    const regVisualVisible = ref(false)
    const quickInput = ref('')
    const iframeSrc = ref('')
    const isDragOver = ref(false)
    function showRegVisual() {
      let quickInputValue = quickInput.value
      let queryStr = ''
      if (quickInputValue && quickInputValue.length) {
        quickInputValue = quickInputValue.trim()
        if (/^\/.+\/$/.test(quickInputValue)) {
          quickInputValue = quickInputValue.replace(/^\/|\/$/g, '')
        }
        
        queryStr = `#!re=${encodeURIComponent(quickInputValue)}`
      }
      iframeSrc.value = '/regulex-legacy/' + queryStr
      regVisualVisible.value = true
      quickInput.value = ''
    }
    return {
      regVisualVisible,
      quickInput,
      showRegVisual,
      iframeSrc,
      isDragOver,
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
    },
  },
};
</script>
