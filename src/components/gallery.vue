<style lang="stylus" scoped>
.gallery
  position absolute
  width 100%
  height 100%
.img-container
  position relative
  height 100%
  background no-repeat center #444
  background-size cover
.mask
  position absolute
  width 100%
  height 100%
  top 0
  left 0
  transition backdrop-filter .1s ease-out, background .6s ease-in
  background rgba(0, 0, 0, .1)
  &.defocus
    background rgba(0, 0, 0, .5)
    backdrop-filter blur(4px)
    transition backdrop-filter .15s ease-out, background 1s ease-out
</style>

<template>
  <div class="gallery">
    <transition name="fade-slow">
      <div
        v-if="isImageLoaded"
        class="img-container"
        :style="{
          backgroundImage: `url(${bakgroundUrl})`
        }"
      >
        <div :class="['mask', defocus ? 'defocus' : '']" />
      </div>
    </transition>
  </div>
</template>

<script>
import { ref } from 'vue';
import loadImage from '../assets/js/load-image.js'
const bakgroundUrl = 'http://bh-lay.com/topic/me/imgs/xunfei.jpg'

export default {
  props: {
    defocus: {
      type: Boolean,
      default: false,
    }
  },
  setup() {
    const isImageLoaded = ref(false)
    return {
      isImageLoaded,
      bakgroundUrl,
    }
  },
  mounted() {
    const startTime = Date.now()
    loadImage(bakgroundUrl)
      .then(() => {
        const now = Date.now()
        const speedTime = now - startTime
        console.log('speedTime', speedTime)
        this.isImageLoaded = true
      })
  },
};
</script>
