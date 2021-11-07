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
    span
      font-size 12px
      color #85e088
</style>

<template>
  <div class="imgtobase-widgets">
    <div class="side">
      <div class="title">图片base64</div>
      <div class="desc">小图嵌入更容易</div>
      <button>上传</button>
    </div>
    <div class="drag-area">
      <span>拖拽图片至此处</span>
    </div>
  </div>
  <modal v-model:visible="regVisualVisible" >
    <iframe :src="iframeSrc" visible="0"></iframe>
  </modal>
</template>

<script>
import { ref } from "vue";
export default {
  setup() {
    const regVisualVisible = ref(false)
    const quickInput = ref('')
    const iframeSrc = ref('')
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
    };
  },
};
</script>
