<style lang="stylus" scoped>
.group-list
  padding 10px 20px 50px
.setting-group
  padding 18px 20px
  background #3e4451
.label
  margin-bottom 15px
  font-size 14px
  color #949eb3

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
  <br />
  <div class="setting-group">
    <div class="label">数据管理</div>
    <data-io />
  </div>
  
</div>
</template>

<script>
import { ref, watch } from 'vue';
import { replaceRouter } from '@/assets/ts/router'
import Layout from './layout.vue'
import Wallpaper from './wallpaper.vue'
import DataIo from './data-io.vue'

export default {
  emits: ['wallpaper-setting'],
  components: { Layout, Wallpaper, DataIo },
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
