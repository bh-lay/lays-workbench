<style lang="stylus" scoped>
.settings-btn
  width 36px
  height 36px
  display flex
  align-items center
  justify-content center
  cursor pointer
  border 1px solid rgba(255, 255, 255, .1)
  border-radius 4px
  transition .2s ease-in-out
  color rgba(255, 255, 255, .7)
  &:hover
    border-color rgba(255, 255, 255, .5)
    background rgba(255, 255, 255, .2)
    color #fff
  &:active
    border-color #fff
    background rgba(255, 255, 255, .35)
.group-list
  width 340px
  margin-top 10px
.setting-group
  padding 18px 20px
  background #3e4451
.label
  margin-bottom 15px
  font-size 14px
  color #949eb3
</style>

<template>
  <dropdown
    class="settings-btn"
    undercoat="tranparent"
    placement="bottom-right"
    type="plain"
  >
    <v-mdi
      name="mdi-tune"
      size="18"
    />
    <template #body>
      <div class="group-list">
        <div class="setting-group">
          <div class="label">
            壁纸设置
          </div>
          <wallpaper @next="settingWallpaper" />
        </div>
        <div class="setting-group">
          <div class="label">
            布局
          </div>
          <layout />
        </div>
        <div class="setting-group">
          <div class="label">
            数据管理
          </div>
          <data-io />
        </div>
      </div>
    </template>
  </dropdown>
</template>

<script lang="ts">
import { replaceRouter } from '@/assets/ts/router'
import Layout from './layout.vue'
import Wallpaper from './wallpaper.vue'
import DataIo from './data-io.vue'

export default {
  components: { Layout, Wallpaper, DataIo },
  setup() {
    return {
      settingWallpaper() {
        replaceRouter('settings', 'wallpaper')
      },
    }
  },
}
</script>
