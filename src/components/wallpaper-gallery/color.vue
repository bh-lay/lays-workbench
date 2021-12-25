<style lang="stylus" scoped>
.list
  display flex
  flex-wrap wrap
.item
  position relative
  width 180px
  height 120px
  flex-grow 1
  background no-repeat center #000
  background-size cover
  overflow hidden
  cursor pointer
  z-index 0
  transition .8s
  .label
    position absolute
    top 0
    left 20px
    width 30px
    height 48px
    padding-top 5px
    background #fff
    writing-mode vertical-lr
    text-align center
    line-height 30px
    font-size 12px
    font-size 13px
    color #333
    opacity 0
    transform translateY(-10px)
    transition .5s
    &:after
      content ''
      position absolute
      top 100%
      left 0
      width 0
      height 0
      border-width 15px 15px 0
      border-style solid
      border-color #fff transparent transparent transparent
  &:hover
    box-shadow 1px 1px 3px rgba(0, 0, 0, .4), 1px 1px 10px rgba(0, 0, 0, .7)
    z-index 2
    .label
      transform translateY(0)
      opacity 1
.empty
  width 180px
  height 0
  flex-grow 1
  overflow hidden
</style>

<template>
  <div class="list">
    <div
      v-for="item in colorList"
      :key="item.value"
      :class="['item']"
      :style="{
        background: item.value
      }"
      @click="applyWallpaper(item.value)"
    >
      <div class="label">
        {{ item.label }}
      </div>
    </div>
    <div class="empty" />
    <div class="empty" />
    <div class="empty" />
    <div class="empty" />
    <div class="empty" />
  </div>
</template>

<script lang="ts">
import colorList from '@/assets/ts/color-list'
import { setAppConfigItem } from '@/assets/ts/app-config'
export default {
  setup() {
    return {
      colorList,
      applyWallpaper(url: string) {
        setAppConfigItem('wallpaper', url)
      },
    }
  },
}
</script>
