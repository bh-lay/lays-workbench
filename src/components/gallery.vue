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
  height 100%
  background rgba(0, 0, 0, .2)
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
      ><div class="mask"></div></div>
    </transition>
  </div>
</template>

<script>
import { ref } from 'vue';
import loadImage from '@/assets/js/load-image'
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
