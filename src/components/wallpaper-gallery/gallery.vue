<style lang="stylus" scoped>
.gallery-list
  display flex
  flex-wrap wrap
  padding 10px 18px

.empty
  width 280px
  height 0
  flex-grow 1
  overflow hidden
</style>

<template>
  <div class="gallery-list">
    <wallpaper-item
      v-for="item in wallpaperList"
      :key="item.url"
      :url="item.thumb"
      :from="item.from"
      @selected="applyWallpaper(item.url)"
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

<script setup lang="ts">
import WallpaperItem from './wallpaper-item.vue'
import wallpaperList from './wallpaper-list'

const emits = defineEmits(['selected'])

function applyWallpaper(url: string) {
  emits('selected', url)
}
</script>
