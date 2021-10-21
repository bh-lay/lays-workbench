<style lang="stylus" scoped>
.modal-mask
  position fixed
  width 100%
  height 100%
  top 0
  left 0
  z-index 100
  background: rgba(0, 0, 0, .5)
  backdrop-filter blur(2px)
.modal-close
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
.modal-body
  box-sizing border-box
  position fixed
  top 10%
  left 10%
  width 80%
  height: 80%
  background #fff
  z-index 101
@media screen and (max-width:600px)
  .modal-close
    top 0
    left auto
    right 0
    border none
    svg
      fill #333
  .modal-mask
    transition 0s !important
  .modal-body
    top 0
    left 0
    width 100%
    height 100%
</style>

<template>
  <transition name="fade-slow">
    <div v-if="visible" class="modal-mask"></div>
  </transition>
  <transition name="flip">
    <div class="modal-body" v-if="visible">
       <slot/>
    </div>
  </transition>
  <transition name="fade-slow">
    <div v-if="visible" class="modal-close" @click="$emit('update:visible', false)">
      <v-mdi name="mdi-close" />
    </div>
  </transition>
</template>

<script>
export default {
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
  },
};
</script>
