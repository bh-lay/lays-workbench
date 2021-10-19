<style lang="stylus" scoped>
.btn-list
  display flex
  justify-content center
  padding-top 20px
.item
  position relative
  width 100px
  height 90px
  cursor pointer
  .icon
    width 50px
    height 50px
    margin 0 auto 10px
    border-radius 8px
    background #333
    line-height 50px
    text-align center
    transition 0.15s
    svg
      vertical-align text-bottom
      fill #fff
    img
      width 100%
  .title
    width 80px
    height 18px
    margin auto
    line-height 18px
    text-align center
    font-size 12px
    color #fff
    background rgba(0, 0, 0, .2)
  .popover
    position absolute
    display flex
    bottom 110%
    left 50%
    width auto
    padding 16px
    border-radius 18px
    background #eee
    z-index 20
    opacity 0
    transform translateX(-50%) scale(.9)
    visibility hidden
    transition .1s .15s
  &:hover
    .icon
      box-shadow 2px 2px 8px rgba(0, 0, 0, 0.1), 0 0 2px rgba(0, 0, 0, 0.3)
    .popover
      visibility visible
      transform translateX(-50%) scale(1)
      opacity 1
.reg-mask
  position absolute
  width 100%
  height 100%
  top 0
  left 0
  z-index 100
  background: rgba(0, 0, 0, .5)
  backdrop-filter blur(2px)

.key-button
  position relative
  width 55px
  height 55px
  border-radius 10px
  background #000
  line-height 55px
  text-align center
  font-size 30px
  color #fff
  & + .key-button
    margin-left 10px
&.mac-option
  &:before
    content 'alt'
    position absolute
    top 7px
    left 7px
    line-height 12px
    font-size 12px
  &:after
    content 'option'
    position absolute
    left 7px
    bottom 7px
    line-height 16px
    font-size 13px
.mac-command
  svg
    position absolute
    top 7px
    right 7px
    width 14px
    height 14px
  &:after
    content 'option'
    position absolute
    left 7px
    bottom 7px
    line-height 16px
    font-size 13px
</style>

<template>
  <div class="btn-list">
    <div class="item">
      <div class="popover">
        <div class="key-button mac-option"></div>
        <div class="key-button mac-command">
          <v-mdi name="mdi-apple-keyboard-command" />
        </div>
        <div class="key-button">B</div>
      </div>
      <div class="icon" style="background: #4caf50">
        <v-mdi name="mdi-book" />
      </div>
      <div class="title">书签</div>
    </div>
    <div class="item" @click="regVisualVisible = true" >
      <div class="icon" style="background: #2196f3">
        <v-mdi name="mdi-regex" />
      </div>
      <div class="title">正则可视化</div>
    </div>
    <div class="item">
      <div class="icon" style="background: #f44336"></div>
      <div class="title">PLEX</div>
    </div>
    <div class="item">
      <div class="icon" style="background: #607d8b"></div>
      <div class="title"></div>
    </div>
    <div class="item">
      <div class="icon" style="background: #673ab7"></div>
      <div class="title"></div>
    </div>
    <reg-visual v-model:visible="regVisualVisible" />
  </div>
</template>

<script>
import { ref } from "vue";
import RegVisual from './reg-visiual.vue'

export default {
  components: { RegVisual },
  setup() {
    const regVisualVisible = ref(false)
    return {
      regVisualVisible,
    };
  },
};
</script>
