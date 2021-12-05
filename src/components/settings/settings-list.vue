<style lang="stylus" scoped>
.group-list
  padding 15px
.setting-group
  margin-bottom 10px
  padding 24px 30px
  background #fff
.label
  margin-bottom 15px
  font-size 16px
</style>

<template>
<div class="group-list">
  <div class="setting-group">
    <div class="label">布局</div>
    <layout />
  </div>
  <div class="setting-group">
    <div class="label">壁纸设置</div>
    <wallpaper />
  </div>
</div>
</template>

<script>
import { ref, watch } from 'vue';
import Layout from './layout.vue'
import Wallpaper from './wallpaper.vue'

export default {
  components: { Layout, Wallpaper },
};
</script>
