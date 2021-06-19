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
  user-select none   /* Non-prefixed version, currently
  #app
    position relative
    height 100%
   */
</style>
<style lang="stylus" scoped>
.gallery
  position relative
  display flex
  flex-direction column
  justify-content center
  align-items center
  height 100%
  background #444
</style>

<template>
  <div class="gallery">
    <search-entrance />
    <quick-entry />
    <button @click="inc">Clicked {{ count }} times.</button>
  </div>
</template>

<script>
import { ref } from "vue";
import SearchEntrance from "./components/search-entrance.vue";
import QuickEntry from "./components/quick-entry.vue";

export default {
  components: { SearchEntrance, QuickEntry },
  setup() {
    const count = ref(0);
    const inc = () => {
      count.value++;
    };

    return {
      count,
      inc,
    };
  },
};
</script>
