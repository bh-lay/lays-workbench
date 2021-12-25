<style lang="stylus" scoped>
.list
  display flex
  flex-wrap wrap
.item
  position relative
  width 300px
  height 200px
  flex-grow 1
  background no-repeat center #000
  background-size cover
  cursor pointer
  z-index 0
  transition .2s
  &:hover
    transform scale(1.1)
    box-shadow 1px 1px 3px rgba(0, 0, 0, .4), 1px 1px 10px rgba(0, 0, 0, .7)
    z-index 2
.empty
  width 300px
  height 0
  flex-grow 1
  overflow hidden
</style>

<template>
  <div class="list">
    <wallpaper-item
      v-for="item in wallpaperList"
      :key="item.url"
      :url="item.thumb"
      class="item"
      @click="applyWallpaper(item.url)"
    />
    <div class="empty" />
    <div class="empty" />
    <div class="empty" />
    <div class="empty" />
    <div class="empty" />
    <div class="empty" />
    <div class="empty" />
  </div>
</template>

<script lang="ts">
import { setAppConfigItem } from '@/assets/ts/app-config'
import WallpaperItem from './wallpaper-item.vue'
import wallpaperList from './wallpaper-list'
export default {
  components: { WallpaperItem },
  setup() {
    return {
      wallpaperList,
      applyWallpaper(url: string) {
        setAppConfigItem('wallpaper', url)
      },
    }
  },
}
</script>
