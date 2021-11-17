<style lang="stylus">
html
  --grid-size 84px
  --grid-gap 34px
  --icon-radius 8px
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
.pager
  position relative
  display flex
  flex-direction column
  height 100%
.pager-header
  height 40px
  flex-shrink 0
.pager-body
  height 100px
  flex-grow 1
  overflow auto
  &::-webkit-scrollbar
    width 0
    height 0
.pager-footer
  height 40px
  flex-shrink 0

.pager-header-inner
  height 40px
  display flex
  align-items center
  justify-content space-between
  padding 0 20px
.scroll-body
  position relative
  display flex
  flex-direction column
  justify-content center
  align-items center
  min-height 100%
.page-title
  height 40px
  display flex
  align-items center
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
.fixed-height-pager
  width 90%
  max-width 1020px
  height 400px
.footer-copyright
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
.mobile-warning
  display none
  margin-top 20px
  padding 30px
  background rgba(255, 255, 255, .2)
  border-radius 4px
  text-align center
  .title
    font-size 14px
    color #fff
  svg
    width 120px
    height 120px
    fill #fff
</style>

<template>
  <gallery :defocus="focused" />
  <div class="pager">
    <div class="pager-header">
      <transition name="fade-fast">
        <div v-show="!focused" class="pager-header-inner">
          <div class="page-title">
            <v-mdi name="mdi-hail" />
            <span>小剧的上网首页</span>
          </div>
          <settings />
        </div>
      </transition>
    </div>
    <div class="pager-body">
      <div class="scroll-body">
        <search-entrance @focus="focused = true" @blur="focused = false" />
        <div class="fixed-height-pager">
          <transition name="fade-fast">
            <quick-entry v-show="!focused" />
          </transition>
        </div>
      </div>
    </div>
    <div class="pager-footer">
      <transition name="fade-fast">
        <div class="footer-copyright" v-show="!focused">
          by：<a href="http://bh-lay.com" target="_blank">剧中人</a>
          <span>皖ICP备14001331号-1</span>
        </div>
      </transition>
    </div>
  </div>
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
