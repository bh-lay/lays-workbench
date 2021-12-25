<style lang="stylus" scoped>
.gallery
  height 150px
  background #333
  .v-button
    position absolute
    top 50%
    left 50%
    transform translate(-50%, -50%)
</style>

<template>
  <gallery>
    <v-dropdown-item-plain>
      <v-button
        type="white"
        @click="$emit('next')"
      >
        修改
      </v-button>
    </v-dropdown-item-plain>
  </gallery>
</template>

<script lang="ts">
import imgRobber from '@/assets/ts/img-robber'
import { getAppConfigItem } from '@/assets/ts/app-config'
import Gallery from '@/components/gallery.vue'

export default {
  name: 'SettingsWallpaper',
  components: { Gallery },
  emits: ['next'],
  setup() {
    const wallpaper = getAppConfigItem('wallpaper')
    const usedUrl = imgRobber(wallpaper.toString())
    return {
      usedUrl,
    }
  },
}
</script>
