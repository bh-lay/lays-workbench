<style lang="stylus" scoped>
.group-list
  padding 10px 10px 50px
.setting-group
  margin-bottom 10px
  padding 18px 20px
  background #fff
.label
  margin-bottom 15px
  font-size 14px
</style>

<template>
<div class="group-list">
  <div class="setting-group">
    <div class="label">壁纸设置</div>
    <wallpaper @next="settingWallpaper" />
  </div>
  <div class="setting-group">
    <div class="label">布局</div>
    <layout />
  </div>
  <div class="setting-group">
    <div class="label">小书房</div>
    <bookmarks-entrance />
  </div>
</div>
</template>

<script>
import { ref, watch } from 'vue';
import { replaceRouter } from '@/assets/ts/router'
import BookmarksEntrance from './bookmarks-entrance.vue'
import Layout from './layout.vue'
import Wallpaper from './wallpaper.vue'

export default {
  emits: ['wallpaper-setting'],
  components: { BookmarksEntrance, Layout, Wallpaper },
  setup(props, context) {
    return {
      settingWallpaper() {
        context.emit('wallpaper-setting')
        replaceRouter('settings', 'wallpaper')
      }
    }
  }
};
</script>
