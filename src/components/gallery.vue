<style lang="stylus" scoped>
.gallery
  position relative
  min-width 100px
  min-height 100px
  background #333
.img-container
  position relative
  height 100%
  background no-repeat center #444
  background-size cover
  &:before
    content ''
    display block
    height 100%
  &.pure-color:before
    background url('/images/paper-texture.png')
    background-size 250px auto
  &.image:before
    background rgba(0, 0, 0, .3)
</style>

<template>
  <div class="gallery">
    <transition name="fade-slow">
      <div
        v-if="isImageLoaded"
        :class="['img-container', isPureColor ? 'pure-color' : 'image']"
        :style="styleValue"
      />
    </transition>
    <slot />
  </div>
</template>

<script lang="ts">
import { ref, nextTick } from 'vue'
import loadImage from '@/assets/ts/load-image'
import imgRobber from '@/assets/ts/img-robber'
import { getAppConfigItem, onAppConfigChange } from '@/assets/ts/app-config'

export default {
  name: 'GalleryFrame',
  props: {
    defocus: {
      type: Boolean,
      default: false,
    },
  },
  setup() {
    const isImageLoaded = ref(false)
    const styleValue = ref({})
    const isPureColor = ref(false)
    let lastWallpaperValue: string | null = null
    const loadWallpaper = () => {
      const currentUrl = getAppConfigItem('wallpaper') as string
      isImageLoaded.value = false
      // 长度小于17，认定为是颜色值
      // http://a.cn/1.jpg
      if (currentUrl.length < 17) {
        isPureColor.value = true
        styleValue.value = {
          backgroundColor: currentUrl,
        }
        nextTick(() => {
          isImageLoaded.value = true
        })
      } else {
        isPureColor.value = false
        const usedUrl = imgRobber(currentUrl)
        styleValue.value = {
          backgroundImage: `url(${usedUrl})`,
        }
        loadImage(usedUrl)
          .then(() => {
            isImageLoaded.value = true
          })
      }

      return currentUrl
    }

    // 当 APP 配置数据发生变动，重载
    onAppConfigChange(() => {
      const currentUrl = getAppConfigItem('wallpaper')
      // 数值未发生变化，不重新加载数据
      if (lastWallpaperValue === currentUrl) {
        return
      }

      lastWallpaperValue = loadWallpaper()
    })
    lastWallpaperValue = loadWallpaper()

    return {
      isImageLoaded,
      styleValue,
      isPureColor,
    }
  },
}
</script>
