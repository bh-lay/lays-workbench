<style lang="stylus" scoped></style>

<template>
  <div>
    <p style="padding: 24px 50px;font-size:24px">
    设置功能正在开发中<br/>
    包含背景图设置、图标管理等功能
    </p>
    <v-slider v-model="containerWidth" :min="500" :max="windowWidth - 40" />
  </div>
</template>

<script>
import { ref, watch } from 'vue';
import { getAppConfigItem, setAppConfigItem } from '@/assets/js/app-config'

export default {
  setup() {
    const settingVisible = ref(false);
    const containerWidth = ref(getAppConfigItem('maxContainerWidth'))
    const windowWidth = window.innerWidth
    watch(containerWidth, value => {
      setAppConfigItem('maxContainerWidth', value)
    })
    return {
      settingVisible,
      containerWidth,
      windowWidth,
      handleClickoutSide() {
        this.settingVisible = false
      },
    };
  },
};
</script>
