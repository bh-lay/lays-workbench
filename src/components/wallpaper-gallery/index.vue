<style lang="stylus" scoped>
.wallpaper-gallery
  display flex
  height 100%
.side
  width 140px
  margin-right 10px
.main
  width 100px
  flex-grow 1
  margin-right 50px
  background rgba(0, 0, 0, .2)
  overflow auto
  &::-webkit-scrollbar
    width 0
    height 0
</style>

<template>
  <div class="wallpaper-gallery">
    <div class="side">
      <category v-model="activeCategory" />
    </div>
    <div class="main">
      <custom v-if="activeCategory === 'define'"/>
      <gallery v-else-if="activeCategory === 'gallery'" />
      <color v-else />
    </div>
  </div>
</template>

<script>
import { ref } from 'vue';
import Category from './category.vue'
import Custom from './custom.vue'
import Color from './color.vue'
import Gallery from './gallery.vue'
export default {
  components: { Category, Custom, Color, Gallery },
  setup() {
    const activeCategory = ref('gallery');
    return {
      activeCategory,
    };
  },
};
</script>
