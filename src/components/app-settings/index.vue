<style lang="stylus" scoped>
.settings-btn
  position relative
  cursor pointer
  transition .2s ease-in-out
  background #333b4d
  &:before
    position absolute
    top 0
    right -8px
    content ''
    width 0
    height 0
    border-style solid
    border-width 17px 0 17px 8px
    border-color transparent transparent transparent #333b4d
    transition .2s ease-in-out
  &:hover
    background #252b37
    &:before
      border-left-color #252b37
  &:active,
  &.active
    background #181d25
    &:before
      border-left-color #181d25
.app-name
  max-width 10em
  padding 0 10px 0 15px
  white-space nowrap
  text-overflow ellipsis
  overflow hidden
  line-height 34px
  font-size 14px
  color #c2c9d6
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
    placement="bottom-left"
    @visible-before="handleDropdownVisible"
  >
    <div class="app-name">{{ userName }}</div>
    <template #body>
      <div class="group-list">
        <div class="setting-group">
          <div class="label">
            称呼
          </div>
          <v-input
            v-model="userNameInEdit"
            v-focus
            type="text"
            placeholder="怎么称呼你 ？"
            @keydown.enter="userNameConfirm"
          />
          <div v-if="userNameInEdit !== userName" style="padding-top: 10px;">
            <v-button
              type="primary"
              @click="userNameConfirm"
              style="margin-right: 10px;"
            >
              修改
            </v-button>
            <v-button
              type="secondary"
              @click="userNameCancel"
            >
              取消
            </v-button>
          </div>
        </div>
        <div class="setting-group">
          <div class="label">
            壁纸设置
          </div>
          <wallpaper :src="activeWallpaper" @next="settingWallpaper" />
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

<script setup lang="ts">
import { replaceRouter } from '@/assets/ts/router'
import { getAppConfigItem, setAppConfigItem } from '@/assets/ts/app-config'
import Layout from './layout.vue'
import Wallpaper from './wallpaper.vue'
import DataIo from './data-io.vue'
import { ref } from 'vue'

const props = defineProps({
  activeWallpaper: {
    type: String,
    default: ''
  },
})
const userNameInEdit = ref('')
const userName = ref(getAppConfigItem('userName') as string || '')
function userNameCancel() {
  userNameInEdit.value = userName.value
}
function handleDropdownVisible() {
  userNameInEdit.value = userName.value
}
function userNameConfirm() {
  userName.value = userNameInEdit.value
  setAppConfigItem('userName', userNameInEdit.value)
}

function settingWallpaper() {
  replaceRouter('settings', 'wallpaper')
}
</script>
