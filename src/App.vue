<style lang="stylus">
html, body
  position relative
  height 100%
  margin 0
  padding 0
  -webkit-touch-callout none
  -webkit-user-select none
  -khtml-user-select none
  -moz-user-select none
  -ms-user-select none
  user-select none
  #app
    position relative
    height 100%
    perspective 800px
</style>
<style lang="stylus" scoped>
.frame
  position relative
  display flex
  flex-direction column
  justify-content center
  align-items center
  height 100%
.pager
  height 100px
</style>

<template>
  <gallery :defocus="focused" />
  <div class="frame">
    <search-entrance @focus="focused = true" @blur="focused = false" />
    <div class="pager">
      <transition name="fade-fast">
        <quick-entry v-if="!focused" />
      </transition>
    </div>
  </div>
  <settings />
</template>

<script>
import Gallery from './components/gallery.vue';
import SearchEntrance from './components/search-entrance.vue';
import QuickEntry from './components/quick-entry.vue';
import Settings from './components/settings.vue';

export default {
  components: { Gallery, SearchEntrance, QuickEntry, Settings },
  data() {
    return {
      focused: false,
    };
  },
};
</script>
