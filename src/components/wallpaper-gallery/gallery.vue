<style lang="stylus" scoped>
.list
  display flex
  flex-wrap wrap
  padding 10px 18px
.item
  position relative
  width 280px
  aspect-ratio 2/1
  flex-grow 1

.empty
  width 280px
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
      :from="item.from"
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

<script setup lang="ts">
import WallpaperItem from './wallpaper-item.vue'
import wallpaperList from './wallpaper-list'

const emits = defineEmits(['selected'])

function applyWallpaper(url: string) {
  emits('selected', url)
}
</script>
