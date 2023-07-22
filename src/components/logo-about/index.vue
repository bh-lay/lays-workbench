<style lang="stylus" scoped>
@import '../../assets/stylus/vars/colors.styl'
.page-title-button
  background transparent
  border none
  color rgba(255, 255, 255, .6)
.intro-header
  padding 24px 26px 30px
  background rgba(255, 255, 255, .1)
  border-radius 10px 10px 0 0
  h1
    margin 0
    font-size 30px
    color #cdd5e4
    small
      display block
      margin-bottom 10px
      font-weight normal
      font-size 14px
.about-layer
  padding 20px 26px 50px
  background $card-bg-color
  color #949eb3
  .features
    display flex
    flex-wrap wrap
    margin-bottom 30px
    padding 10px 0
    gap 10px
    .feature
      width 200px
      flex-grow 1
      padding 15px
      border 1px dashed #49505f
    .feature-name
      margin-bottom 10px
      font-size 20px
      color #cdd5e4
    .feature-desc
      font-size 14px
    strong
      padding 0 .2em
      color #2196f3
      font-weight bolder
  .more-intro
    font-size 15px
  a
    padding 0 2px
    font-weight bold
    color inherit
    &:hover
      color #33a3ff
.wechat-title
  margin 40px 0 12px
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
  <v-button class="page-title-button" @click="visilbe = true">小剧起始页</v-button>

  <FocalPlane v-model="visilbe" :width="780" :close-on-press-escape="true" :action-block-classes="['about-layer', 'intro-header']">
    <div class="intro-header">
      <h1><small>小剧起始页</small>更适合前端的上网首页</h1>
    </div>
    <div class="about-layer">
      <p>基于 Vite + Vue3 + TypeScript + IndexedDB 开发。</p>
      <div class="features">
        <div class="feature">
          <div class="feature-name">更安全</div>
          <div class="feature-desc">基于浏览器<strong>IndexedDB</strong>持久化，数据存储更安全</div>
        </div>
        <div class="feature">
          <div class="feature-name">更流畅</div>
          <div class="feature-desc">借助<strong>Vite</strong>高效的开发时，和<strong>Vue3</strong>高效的运行时效率，更新迭代更流畅</div>
        </div>
        <div class="feature">
          <div class="feature-name">更轻松</div>
          <div class="feature-desc">逐步开发中的前端工具箱，辅助前端更轻松地工作</div>
        </div>
      </div>
      <p>PC 优先的模式开发，移动设备可正常使用，但体验不佳。</p>
      <p class="more-intro">
        点击<a target="_blank" href="http://bh-lay.com/blog?tag=%E5%B0%8F%E5%89%A7%E8%B5%B7%E5%A7%8B%E9%A1%B5">这个链接</a>，查看小剧起始页更多介绍。
      </p>
      <p class="wechat-title">
        作者微信<small>请注明：来自小剧起始页</small>
      </p>
      <div class="qrcode" :style="{ backgroundImage: `url(${wechatQrCode})` }">
        <span>剧</span>
      </div>
    </div>
  </FocalPlane>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { FocalPlane } from '@/ui-lib/index'
// import imgRobber from '@/assets/ts/img-robber'

// const wechatQrCode = imgRobber('https://api.qrserver.com/v1/create-qr-code/?data=https://u.wechat.com/ELEgl9SCdqLRb0m3ZXzfct4')
const wechatQrCode = 'https://api.qrserver.com/v1/create-qr-code/?data=https://u.wechat.com/ELEgl9SCdqLRb0m3ZXzfct4'
const visilbe = ref(false)
</script>
