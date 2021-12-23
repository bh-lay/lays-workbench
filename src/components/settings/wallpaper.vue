<style lang="stylus" scoped>
.gallery
  height 180px
  background #333
  .v-button
    position absolute
    top 50%
    left 50%
    transform translate(-50%, -50%)
</style>

<template>
  <gallery>
    <v-button type="white" @click="$emit('next')">修改</v-button>
  </gallery>
</template>

<script>
import { ref, watch } from 'vue';
import imgRobber from '@/assets/ts/img-robber'
import { getAppConfigItem } from '@/assets/ts/app-config'
import Gallery from '@/components/gallery.vue'

export default {
  emits: ['next'],
  components: { Gallery },
  setup() {
    const usedUrl = imgRobber(getAppConfigItem('wallpaper'))
    return {
      usedUrl,
    };
  },
};
</script>
