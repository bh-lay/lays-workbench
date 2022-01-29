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
input,
textarea
  font-family inherit
</style>
<style lang="stylus" scoped>
.gallery
  position absolute
  width 100%
  height 100%
.pager
  position relative
  display flex
  flex-direction column
  height 100%
.pager-header
  height 60px
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
  height 60px
  display flex
  align-items center
  justify-content space-between
  padding 0 15px 0 10px
.scroll-body
  position relative
  display flex
  flex-direction column
  justify-content center
  align-items center
  min-height 100%
.fixed-height-pager
  width 90%
  max-width var(--max-container-width)
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
.screen-mask
  position fixed
  width 100%
  height 100%
  top 0
  left 0
  z-index 10
  background rgba(0, 0, 0, 0)
  pointer-events none
  transition backdrop-filter .4s ease-out, background .6s ease
  &.defocus
    background rgba(0, 0, 0, .6)
    backdrop-filter blur(2px)
    pointer-events all
    transition backdrop-filter .1s ease-out, background .15s ease
</style>

<template>
  <gallery />
  <div
    class="pager"
    @contextmenu.prevent
  >
    <div class="pager-header">
      <div class="pager-header-inner">
        <logo-about />
        <settings />
      </div>
    </div>
    <div class="pager-body">
      <div class="scroll-body">
        <div :class="['screen-mask', focused ? 'defocus' : '']" />
        <search-entrance
          @focus="focused = true"
          @blur="focused = false"
        />
        <div class="fixed-height-pager">
          <bookmark-desktop />
        </div>
      </div>
    </div>
    <div class="pager-footer">
      <div class="footer-copyright">
        by: <a
          href="http://bh-lay.com"
          target="_blank"
        >剧中人</a>
        <span>皖ICP备14001331号-1</span>
      </div>
    </div>
  </div>
  <https-upgrade-tips v-if="upgradeVisible" />
  <easy-router />
</template>

<script lang="ts">
import { ref } from 'vue'
import Gallery from '@/components/gallery.vue'
import SearchEntrance from '@/components/search-entrance.vue'
import BookmarkDesktop from '@/components/bookmark-desktop.vue'
import Settings from '@/components/settings/index.vue'
import LogoAbout from '@/components/logo-about/index.vue'

import EasyRouter from '@/components/easy-router.vue'
import httpsUpgradeTips from '@/components/https-upgrade-tips.vue'
import { bookmarkIsEmptyService } from '@database/services/bookmark-service'
export default {
  components: { Gallery, SearchEntrance, BookmarkDesktop, LogoAbout, Settings, EasyRouter, httpsUpgradeTips },
  setup() {
    const focused = ref(false)
    const upgradeVisible = ref(false)
    // 若当前为 http 协议，且为线上版本，则选择性跳转或提示用户
    if (location.protocol.indexOf('http:') >= 0 && import.meta.env.PROD) {
      bookmarkIsEmptyService().then(isEmpty => {
        if (isEmpty) {
          // 若当前用户数据为空，则直接跳转至 https 协议
          location.protocol = 'https'
        } else {
          // 否则显示升级指引
          upgradeVisible.value = true
        }
      })
    }
    return {
      focused,
      upgradeVisible,
    }
  },
}
</script>
