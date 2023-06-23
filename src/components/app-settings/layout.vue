<style lang="stylus" scoped>
.item
  margin-bottom 10px
.label
  height 14px
  line-height 14px
  font-size 12px
  color #8f96a3
</style>

<template>
  <div>
    <div class="item">
      <div class="label">
        页面最大宽度
      </div>
      <v-slider
        v-model="maxContainerWidth"
        :min="500"
        :max="windowWidth - 40"
        :marks="[
          {
            value: appConfigDefault.maxContainerWidth,
            label: '',
          },
        ]"
      />
    </div>
    <div class="item">
      <div class="label">
        界面缩放
      </div>
      <v-slider
        v-model="desktopZoom"
        :min="0.7"
        :max="1.5"
        :marks="[
          {
            value: appConfigDefault.desktopZoom,
            label: '',
          },
        ]"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { ref, watch } from 'vue'
import { getAppConfig, getAppConfigDefault } from '@/assets/ts/app-config'

export default {
  name: 'SettingsLayout',
  setup() {
    const appConfig = getAppConfig()
    const desktopZoom = ref(appConfig.desktopZoom)
    const maxContainerWidth = ref(appConfig.maxContainerWidth)
    const windowWidth = window.innerWidth
    const appConfigDefault = getAppConfigDefault()
    watch(maxContainerWidth, (value) => {
      appConfig.maxContainerWidth = value
    })
    watch(desktopZoom, (value) => {
      appConfig.desktopZoom = value
    })
    return {
      appConfigDefault,
      desktopZoom,
      maxContainerWidth,
      windowWidth,
    }
  },
}
</script>
