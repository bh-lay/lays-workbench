<style lang="stylus" scoped>
.settings-btn
  width 36px
  height 36px
  display flex
  align-items center
  justify-content center
  cursor pointer
  border-radius 4px
  transition .2s ease-in-out
  background #333b4d
  color #c2c9d6
  &:hover
    background #252b37
  &:active,
  &.active
    background #181d25
.group-list
  width 340px
  margin-top 5px
  background #3e4451
.setting-group
  padding 18px 20px
.label
  margin-bottom 15px
  font-size 14px
  color #949eb3
</style>

<template>
  <v-dropdown
    class="settings-btn"
    type="plain"
    placement="bottom-right"
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
  </v-dropdown>
</template>

<script lang="ts">
import { replaceRouter } from '@/assets/ts/router'
import Layout from './layout.vue'
import Wallpaper from './wallpaper.vue'
import DataIo from './data-io.vue'

export default {
  name: 'SettingsCenter',
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
