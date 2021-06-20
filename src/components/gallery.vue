<style lang="stylus" scoped>
.gallery
  position absolute
  width 100%
  height 100%
  background url('http://bh-lay.com/topic/me/imgs/xunfei.jpg') no-repeat center #444
  background-size cover
.mask
  position relative
  height 100%
  transition backdrop-filter .1s ease-out, background .6s ease-in
  background rgba(0, 0, 0, .1)
  &.defocus
    background rgba(0, 0, 0, .5)
    backdrop-filter blur(4px)
    transition backdrop-filter .15s ease-out, background 1s ease-out
</style>

<template>
  <div class="gallery">
    <div :class="['mask', defocus ? 'defocus' : '']"></div>
  </div>
</template>

<script>

export default {
  props: {
    defocus: {
      type: Boolean,
      default: false,
    }
  },
};
</script>
