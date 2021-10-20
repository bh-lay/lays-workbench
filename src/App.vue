<style lang="stylus">
html, body
  position relative
  height 100%
  margin 0
  padding 0
  overflow hidden
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
.page-title
  position fixed
  top 15px
  left 25px
  height 40px
  svg
    height 34px
    vertical-align middle
    margin-right 6px
    fill #fff
  span
    display inline-block
    vertical-align middle
    height 20px
    line-height 20px
    font-size 15px
    color rgba(255, 255, 255, .6)
.pager
  height 100px
.footer-copyright
  position fixed
  left 0
  bottom 0
  width 100%
  height: 40px
  line-height 40px
  text-align center
  color rgba(255, 255, 255, .4)
  font-size 12px
  a
    margin-right 10px
    color rgba(255, 255, 255, .6)
    text-decoration none
    &:hover
      text-decoration underline
</style>

<template>
  <gallery :defocus="focused" />
  <div class="frame">
    <transition name="fade-fast">
      <div class="page-title" v-show="!focused">
        <v-mdi name="mdi-hail" />
        <span>小剧的上网首页</span>
      </div>
    </transition>
    <search-entrance @focus="focused = true" @blur="focused = false" />
    <div class="pager">
      <transition name="fade-fast">
        <quick-entry v-show="!focused" />
      </transition>
    </div>
    <transition name="fade-fast">
      <div class="footer-copyright" v-show="!focused">
        by：<a href="http://bh-lay.com" target="_blank">剧中人</a>
        <span>皖ICP备14001331号-1</span>
      </div>
    </transition>
  </div>
  <transition name="fade-fast">
    <settings v-if="!focused" />
  </transition>
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
