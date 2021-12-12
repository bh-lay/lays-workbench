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
      backgroundImage: `url(${usedUrl})`
    }"
  >
    <v-button @click="$emit('next')">修改</v-button>
  </div>
</template>

<script>
import { ref, watch } from 'vue';
import imgRobber from '@/assets/ts/img-robber'
import { getAppConfigItem } from '@/assets/ts/app-config'

export default {
  emits: ['next'],
  setup() {
    const usedUrl = imgRobber(getAppConfigItem('wallpaper'))
    return {
      usedUrl,
    };
  },
};
</script>
