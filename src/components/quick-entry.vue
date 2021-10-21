<style lang="stylus" scoped>
.btn-list
  display flex
  justify-content space-around
  padding-top 20px
.item
  position relative
  width 90px
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
    text-shadow 1px 1px 1px rgba(0, 0, 0, .4), 1px 1px 4px rgba(0, 0, 0, .4)
  .popover
    position absolute
    bottom 110%
    left 50%
    width auto
    z-index 20
    opacity 0
    transform translateX(-50%) scale(.9)
    visibility hidden
    transition .15s
  &:hover
    .icon
      box-shadow 2px 2px 8px rgba(0, 0, 0, 0.1), 0 0 2px rgba(0, 0, 0, 0.3)
    .popover
      visibility visible
      transform translateX(-50%) scale(1)
      opacity 1
      transition .15s .3s ease-out
@media screen and (max-width:600px)
  .btn-list
    flex-wrap wrap
</style>

<template>
  <div class="btn-list">
    <div class="item">
      <div class="popover">
        <bookmark-shortcut />
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
    <div class="item" @click="jsonFormatterVisible = true">
      <div class="icon" style="background: #f44336">
        <v-mdi name="mdi-code-json" />
      </div>
      <div class="title">JSON 格式化</div>
    </div>
    <div class="item">
      <div class="icon" style="background: #607d8b"></div>
      <div class="title">开发中...</div>
    </div>
    <modal v-model:visible="regVisualVisible" >
      <reg-visual />
    </modal>
    <modal v-model:visible="jsonFormatterVisible" >
      <json-formatter />
    </modal>
  </div>
</template>

<script>
import { ref } from "vue";
import RegVisual from './reg-visiual.vue'
import BookmarkShortcut from './bookmark-shortcut.vue'
import JsonFormatter from './json-formatter.vue'

export default {
  components: { RegVisual, BookmarkShortcut, JsonFormatter },
  setup() {
    const regVisualVisible = ref(false)
    const jsonFormatterVisible = ref(false)
    return {
      regVisualVisible,
      jsonFormatterVisible,
    };
  },
};
</script>
