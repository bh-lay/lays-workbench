<style lang="stylus" scoped>
@import '../../assets/stylus/functions/scrollbar.styl'
.wallpaper-gallery
  display flex
  height 100%
.side
  width 140px
  padding 0 10px
.main
  width 100px
  flex-grow 1
  overflow-x hidden
  overflow-y auto
  scrollbar #26262c
</style>

<template>
  <div class="wallpaper-gallery">
    <div class="side">
      <category v-model="activeCategory" />
    </div>
    <div class="main">
      <custom
        v-if="activeCategory === 'define'"
        @selected="setWallpaper"
      />
      <gallery
        v-else-if="activeCategory === 'gallery'"
        @selected="setWallpaper"
      />
      <color
        v-else
        @selected="setWallpaper"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, Ref, inject } from 'vue'
import { bookmarkDesktopWallpaperUpdateService } from '@/database/services/bookmark-service'
import Category from './category.vue'
import Custom from './custom.vue'
import Color from './color.vue'
import Gallery from './gallery.vue'

const activeCategory = ref('gallery')
const activeDesktopId = inject<Ref<string>>('activeDesktopId')
const changeWallpaper = inject('changeWallpaper', (src: string) => {}, false)
function setWallpaper(wallpaperUrl: string) {
  bookmarkDesktopWallpaperUpdateService(activeDesktopId?.value || '', wallpaperUrl)
    .then(() => {
      changeWallpaper(wallpaperUrl)
    })
}
  
</script>
