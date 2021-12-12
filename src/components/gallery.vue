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
import { ref, onMounted } from 'vue';
import loadImage from '@/assets/ts/load-image'
import imgRobber from '@/assets/ts/img-robber'
import { getAppConfigItem, onAppConfigChange } from '@/assets/ts/app-config'

export default {
  props: {
    defocus: {
      type: Boolean,
      default: false,
    }
  },
  setup() {
    const bakgroundUrl = ref('')
    const isImageLoaded = ref(false)

    let lastWallpaperUrl = null
    const loadWallpaper = () => {
      const currentUrl = getAppConfigItem('wallpaper')
      const usedUrl = imgRobber(currentUrl)
      isImageLoaded.value = false
      bakgroundUrl.value = usedUrl
      loadImage(usedUrl)
        .then(() => {
          isImageLoaded.value = true
        })
      return currentUrl
    }
    
    // 当 APP 配置数据发生变动，重载
    onAppConfigChange(() => {
      const currentUrl = getAppConfigItem('wallpaper')
      // 数值未发生变化，不重新加载数据
      if (lastWallpaperUrl === currentUrl) {
        return
      }
      lastWallpaperUrl = loadWallpaper()
    })
    lastWallpaperUrl = loadWallpaper()

    return {
      isImageLoaded,
      bakgroundUrl,
    }
  },
};
</script>
