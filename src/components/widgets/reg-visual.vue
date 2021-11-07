<style lang="stylus" scoped>
.reg-visual-widgets
  background linear-gradient(180deg, #20b7f3, transparent, transparent)
  .title
    padding-top 18px
    line-height 26px
    letter-spacing 2px
    font-size 22px
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
    height: 30px
    padding 0 15px
    line-height 30px
    font-size 12px
    transition .15s
    &:active,
    &:focus
      outline none
  input
    flex-grow 1
  button
    background #fff
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
  <div class="reg-visual-widgets">
    <div class="title">正则可视化</div>
    <div class="desc">让晦涩的正则生动起来</div>
    <div class="input-group">
      <input type="text" placeholder="输入正则表达式" v-model="quickInput" @keydown.enter="showRegVisual">
      <button @click="showRegVisual">查看</button>
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
