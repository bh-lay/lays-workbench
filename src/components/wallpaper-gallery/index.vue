<style lang="stylus" scoped>
@import '../../assets/stylus/functions/scrollbar.styl'
.wallpaper-gallery
  display flex
  height 100%
.side
  width 140px
  padding 10px 0 10px 10px
.main
  width 100px
  flex-grow 1
  padding 10px 50px 10px 10px
  overflow auto
  scrollbar #26262c
</style>

<template>
  <div class="wallpaper-gallery">
    <div class="side">
      <category v-model="activeCategory" />
    </div>
    <div class="main">
      <custom v-if="activeCategory === 'define'" />
      <gallery v-else-if="activeCategory === 'gallery'" />
      <color v-else />
    </div>
  </div>
</template>

<script lang="ts">
import { ref } from 'vue'
import Category from './category.vue'
import Custom from './custom.vue'
import Color from './color.vue'
import Gallery from './gallery.vue'
export default {
  name: 'SettingsWallpaperCenter',
  components: { Category, Custom, Color, Gallery },
  setup() {
    const activeCategory = ref('gallery')
    return {
      activeCategory,
    }
  },
}
</script>
