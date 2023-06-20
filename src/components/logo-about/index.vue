<style lang="stylus" scoped>
.page-title
  height 34px
  padding 0 16px
  display flex
  align-items center
  color #c2c9d6
  cursor pointer
  transition .15s
  line-height 20px
  font-size 12px
  &:hover
    background #3e4451
  &:active,
  &.active
    background #353a45
.about-layer
  width 260px
  padding 20px 26px 50px
  background #3e4451
  color #949eb3
  .sub-title
    margin-bottom 10px
    font-size 14px
  h1
    margin 12px 0 10px
    font-size 22px
    color #cdd5e4
  ul
    padding-left 1.5em
    text-align justify
    font-size 12px
    strong
      padding 0 .2em
  .more-intro
    font-size 12px
  a
    padding 0 2px
    color inherit
    &:hover
      color #33a3ff
.wechat-title
  margin 30px 0 12px
  font-size 16px
  color #cdd5e4
  small
    margin-left 10px
    font-size 12px
    color #586174
.qrcode
  width 150px
  height 150px
  border-radius 4px
  background no-repeat center #fff
  background-size 130px
  span
    position relative
    display block
    top 63px
    left 63px
    width 24px
    height 24px
    border-radius 4px
    box-shadow 1px 1px 1px 3px rgba(0, 0, 0, .1)
    text-align center
    line-height 24px
    font-size 16px
    color #829bc9
    background #fff
</style>

<template>
  <v-dropdown
    class="page-title"
    type="plain"
    placement="bottom-right"
  >
    <span>小剧起始页</span>
    <template #body>
      <div class="about-layer">
        <p class="sub-title">
          关于小剧起始页
        </p>
        <h1>更适合前端的上网首页</h1>
        <ul>
          <li>基于浏览器<strong>IndexedDB</strong>持久化，数据存储更安全</li>
          <li>借助<strong>Vue3</strong>高效的开发和运行时效率，更新迭代更流畅</li>
          <li>得益于<strong>CSS3</strong>最新特性，可视化的桌面混合排版更易实现</li>
          <li>逐步开发中的工具箱，辅助前端更轻松地工作</li>
        </ul>
        <p class="more-intro">
          点击<a
            target="_blank"
            href="http://bh-lay.com/blog?tag=%E5%B0%8F%E5%89%A7%E8%B5%B7%E5%A7%8B%E9%A1%B5"
          >这个链接</a>，查看小剧起始页更多介绍。
        </p>
        <p class="wechat-title">
          作者微信<small>请注明：来自小剧起始页</small>
        </p>
        <div class="qrcode" :style="{ backgroundImage: `url(${wechatQrCode})`}">
          <span>剧</span>
        </div>
      </div>
    </template>
  </v-dropdown>
</template>

<script setup lang="ts">
// import imgRobber from '@/assets/ts/img-robber'

// const wechatQrCode = imgRobber('https://api.qrserver.com/v1/create-qr-code/?data=https://u.wechat.com/ELEgl9SCdqLRb0m3ZXzfct4')
const wechatQrCode = 'https://api.qrserver.com/v1/create-qr-code/?data=https://u.wechat.com/ELEgl9SCdqLRb0m3ZXzfct4'
</script>
