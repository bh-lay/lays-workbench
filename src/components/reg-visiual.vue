<style lang="stylus" scoped>
.reg-mask
  position fixed
  width 100%
  height 100%
  top 0
  left 0
  z-index 100
  background: rgba(0, 0, 0, .5)
  backdrop-filter blur(2px)
.reg-close
  position fixed
  top 10%
  left 90%
  width 40px
  height 40px
  line-height 40px
  text-align center
  z-index 102
  transition-delay .2s
  cursor pointer
  margin-left 5px
  border-radius 100%
  border 1px solid rgba(255, 255, 255, .2)
  transition .2s
  svg
    vertical-align text-bottom
    fill #fff
  &:hover
    background rgba(255, 255, 255, .2)
    border-color rgba(255, 255, 255, .5)
.reg-modal
  box-sizing border-box
  position fixed
  top 10%
  left 10%
  width 80%
  height: 80%
  background #fff
  z-index 101
  iframe
    width 100%
    height 100%
    border none
</style>

<template>
  <transition name="fade-slow">
    <div v-if="visible" class="reg-mask"></div>
  </transition>
  <transition name="flip">
    <div class="reg-modal" v-if="visible">
      <iframe src="/regulex-legacy/" visible="0"></iframe>
    </div>
  </transition>
  <transition name="fade-slow">
    <div v-if="visible" class="reg-close" @click="$emit('update:visible', false)">
      <v-mdi name="mdi-close"></v-mdi>
    </div>
  </transition>
</template>

<script>
// import { ref } from 'vue';
export default {
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
  },
  setup() {
    return {
    };
  },
};
</script>
