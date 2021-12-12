<style lang="stylus" scoped>
.img-container
  display flex
  align-items center
  justify-content center
  height 180px
  background no-repeat center #444
  background-size cover
</style>

<template>
  <div
    class="img-container"
    :style="{
      backgroundImage: `url(${usedWallpaper})`
    }"
  >
    <v-button @click="handleEdit">修改</v-button>
  </div>
</template>

<script>
import { ref, watch } from 'vue';
import { getAppConfig, getAppConfigItem } from '@/assets/ts/app-config'

export default {
  setup() {
    const usedWallpaper = ref(getAppConfigItem('wallpaper'))
    return {
      usedWallpaper,
      handleEdit() {
        alert('壁纸库正在开发中，请稍等几天哦～')
      },
    };
  },
};
</script>
