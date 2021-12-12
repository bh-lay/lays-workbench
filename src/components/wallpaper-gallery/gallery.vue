<style lang="stylus" scoped>
.list
  display flex
  flex-wrap wrap
.item
  position relative
  width 200px
  height 140px
  flex-grow 1
  background no-repeat center #000
  background-size cover
  cursor pointer
  z-index 0
  opacity .7
  transition .2s
  &:hover
    opacity 1
    box-shadow 1px 1px 3px rgba(0, 0, 0, .4), 1px 1px 10px rgba(0, 0, 0, .7)
    z-index 2
.empty
  width 200px
  height 0
  flex-grow 1
  overflow hidden
</style>

<template>
  <div class="list">
    <div
      v-for="item in wallpaperList"
      :key="item.url"
      :class="['item']"
      :style="{
        backgroundImage: `url(${item.thumb})`
      }"
      @click="applyWallpaper(item.url)"
    ></div>
    <div class="empty"></div>
    <div class="empty"></div>
    <div class="empty"></div>
    <div class="empty"></div>
    <div class="empty"></div>
  </div>
</template>

<script>
import { ref } from 'vue';
import { setAppConfigItem } from '@/assets/ts/app-config'
import wallpaperList from './wallpaper-list'
export default {
  setup() {
    return {
      wallpaperList,
      applyWallpaper(url) {
        setAppConfigItem('wallpaper', url)
      }
    };
  },
};
</script>
