<style lang="stylus" scoped>
.btn-list
  display flex
  justify-content center
  padding-top 20px
.item
  width 100px
  height 90px
  cursor pointer
  .icon
    width 50px
    height 50px
    margin 0 auto 10px
    border-radius 8px
    background #333
    transition 0.15s
    img
      width 100%
  .title
    width 80px
    height 18px
    margin auto
    line-height 18px
    text-align center
    font-size 12px
  &:hover .icon
    box-shadow 2px 2px 8px rgba(0, 0, 0, 0.1), 0 0 2px rgba(0, 0, 0, 0.3)
.reg-mask
  position absolute
  width 100%
  height 100%
  top 0
  left 0
  z-index 100
  background: rgba(0, 0, 0, .5)
  backdrop-filter blur(2px)
</style>

<template>
  <div class="btn-list">
    <div class="item" @click="regVisualVisible = true" >
      <div class="icon" style="background: #2196f3">
        <img src="../img/magic-m1.png" alt="" />
      </div>
      <div class="title">H3C m1</div>
    </div>
    <div class="item">
      <div class="icon" style="background: #4caf50">
        <img src="../img/magic-m2.png" alt="" />
      </div>
      <div class="title">H3C m2</div>
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
