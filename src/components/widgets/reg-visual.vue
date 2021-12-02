<style lang="stylus" scoped>
.reg-visual-small
  background #2196f3
  display flex
  align-items center
  justify-content center
  height 100%
  color #fff
  cursor pointer
  transition .2s
  &:hover
    background #2d77b4
.reg-visual-medium
  height 100%
  background #2196f3
  cursor pointer
  text-align center
  transition .2s
  .title
    padding-top 38px
    line-height 26px
    letter-spacing 2px
    font-weight bold
    font-size 18px
    color #fff
  .desc
    padding-top 6px
    line-height 16px
    letter-spacing 1px
    font-size 12px
    color #9ed1fa
  &:hover
    background #2d77b4

.reg-visual-widgets
  height 100%
  background #2196f3
  text-align center
  .title
    padding-top 18px
    line-height 26px
    letter-spacing 2px
    font-weight bold
    font-size 20px
    color #fff
  .desc
    padding-top 6px
    line-height 16px
    letter-spacing 1px
    font-size 13px
    color #9ed1fa
.input-group
  display flex
  width 240px
  height 30px
  margin 18px auto 0
  background: #fff
  input,
  button
    box-sizing border-box
    border none
    height 30px
    line-height 30px
    font-size 12px
    transition .15s
    &:active,
    &:focus
      outline none
  input
    padding 0 15px
    flex-grow 1
  button
    width 60px
    background #fff
    text-align center
    color #555
    cursor pointer
    &:hover
      background #eee
iframe
  width 100%
  height 100%
  border none
</style>

<template>
  <div class="reg-visual-small" v-if="widgetsSize === BookmarkSize.small" @click="showRegVisual">
    <v-mdi name="mdi-regex" />
  </div>
  <div class="reg-visual-medium" v-else-if="widgetsSize === BookmarkSize.medium" @click="showRegVisual" >
    <div class="title">正则可视化</div>
    <div class="desc">让晦涩的正则<br/>生动起来</div>
  </div>
  <div class="reg-visual-widgets" v-else>
    <div class="title">正则可视化</div>
    <div class="desc"><span>让晦涩的正则</span><span>生动起来</span></div>
    <div class="input-group">
      <input type="text" placeholder="输入正则表达式" v-model="quickInput" @keydown.enter="showRegVisual">
      <button @click="showRegVisual">查看</button>
    </div>
  </div>
  <modal v-model="regVisualVisible" width="80%" height="80%">
    <iframe :src="iframeSrc" visible="0"></iframe>
  </modal>
</template>

<script>
import { ref, computed } from "vue";
import { Bookmark, BookmarkSize } from '../../database/entity/bookmark.ts';
export default {
  props: {
    data: {
      type: Bookmark,
      default() {
        return new Bookmark({})
      },
    }
  },
  setup(props) {
    const regVisualVisible = ref(false)
    const quickInput = ref('')
    const iframeSrc = ref('')
    const widgetsSize = computed(() => props.data.size)
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
      BookmarkSize,
      widgetsSize,
      regVisualVisible,
      quickInput,
      showRegVisual,
      iframeSrc,
    };
  },
};
</script>
