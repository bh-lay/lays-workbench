<style lang="stylus" scoped>
.bookmark-wrapper
  display flex
  padding 8px
  border-radius 14px
  background #eee
.key-button
  position relative
  width 55px
  height 55px
  border-radius 10px
  background #000
  line-height 55px
  text-align center
  font-size 24px
  color #fff
  &.mini-text
    font-size 15px
  & + .key-button
    margin-left 8px
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
  width 70px
  svg
    position absolute
    top 7px
    right 7px
    width 14px
    height 14px
  &:after
    content 'command'
    position absolute
    left 5px
    bottom 7px
    line-height 16px
    font-size 13px
</style>

<template>
  <div class="bookmark-wrapper">
    <template v-if="isMac">
      <div class="key-button mac-option"></div>
      <div class="key-button mac-command">
        <v-mdi name="mdi-apple-keyboard-command" />
      </div>
      <div class="key-button">B</div>
    </template>
    <template v-else>
      <div class="key-button mini-text">Ctrl</div>
      <div class="key-button mini-text">Shift</div>
      <div class="key-button">O</div>
    </template>
  </div>
</template>

<script>
import RegVisual from './reg-visiual.vue'

export default {
  components: { RegVisual },
  setup() {
    var isMac = /macintosh|mac os x/i.test(navigator.userAgent)
    return {
      isMac,
    };
  },
};
</script>
