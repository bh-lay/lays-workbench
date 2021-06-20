<style lang="stylus">
html, body
  position relative
  height 100%
  margin 0
  padding 0
  -webkit-touch-callout none /* iOS Safari */
  -webkit-user-select none /* Chrome/Safari/Opera */
  -khtml-user-select none /* Konqueror */
  -moz-user-select none /* Firefox */
  -ms-user-select none /* Internet Explorer/Edge */
  user-select none /* Non-prefixed version, currently */
  #app
    position relative
    height 100%
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
      <transition name="fade-slow">
        <quick-entry v-if="!focused" />
      </transition>
    </div>
  </div>
</template>

<script>
import Gallery from './components/gallery.vue';
import SearchEntrance from './components/search-entrance.vue';
import QuickEntry from './components/quick-entry.vue';

export default {
  components: { Gallery, SearchEntrance, QuickEntry },
  data() {
    return {
      focused: false,
    };
  },
};
</script>
