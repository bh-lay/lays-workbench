<style lang="stylus" scoped>
.label
  font-size 14px
  color #666
</style>

<template>
  <div>
    <div class="label">页面最大宽度</div>
    <v-slider
      v-model="maxContainerWidth"
      :min="500"
      :max="windowWidth - 40"
      :marks="[
        {
          value: appConfigDefault.maxContainerWidth,
          label: ''
        }
      ]"
    />
    
    <div class="label">区块大小</div>
    <v-slider
      v-model="gridSize"
      :min="70"
      :max="120"
      :marks="[
        {
          value: appConfigDefault.gridSize,
          label: ''
        }
      ]"
    />
    <div class="label">区块内间距</div>
    <v-slider
      v-model="gridGap"
      :min="0"
      :max="50"
      :marks="[
        {
          value: appConfigDefault.gridGap,
          label: ''
        }
      ]"
    />
  </div>
</template>

<script>
import { ref, watch } from 'vue';
import { getAppConfig, getAppConfigDefault } from '@/assets/js/app-config'

export default {
  setup() {
    const appConfig = getAppConfig()
    const settingVisible = ref(false);
    const gridSize = ref(appConfig.gridSize)
    const gridGap = ref(appConfig.gridGap)
    const maxContainerWidth = ref(appConfig.maxContainerWidth)
    const windowWidth = window.innerWidth
    const appConfigDefault = getAppConfigDefault()
    watch(maxContainerWidth, value => {
      appConfig.maxContainerWidth = value
    })
    watch(gridSize, value => {
      appConfig.gridSize = value
    })
    watch(gridGap, value => {
      appConfig.gridGap = value
    })
    return {
      appConfigDefault,
      settingVisible,
      gridSize,
      gridGap,
      maxContainerWidth,
      windowWidth,
      handleClickoutSide() {
        this.settingVisible = false
      },
    };
  },
};
</script>
