<style lang="stylus" scoped>
.img-container
  position relative
  height 100%
  background no-repeat center #444
  background-size cover
</style>

<template>
  <div>
    <transition name="fade-slow">
      <div
        v-if="isImageLoaded"
        class="img-container"
        :style="styleValue"
      ></div>
    </transition>
  </div>
</template>

<script>
import { ref } from 'vue';
import loadImage from '@/assets/ts/load-image'
import imgRobber from '@/assets/ts/img-robber'

export default {
  props: {
    url: {
      type: String,
      default: '',
    }
  },
  setup(props) {
    const usedUrl = imgRobber(props.url)
    const isImageLoaded = ref(false)
    
    loadImage(usedUrl)
      .then(() => {
        isImageLoaded.value = true
      })

    return {
      isImageLoaded,
      styleValue: {
        backgroundImage: `url(${usedUrl})`
      },
    }
  },
};
</script>
