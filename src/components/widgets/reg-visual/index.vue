<style lang="stylus" scoped>
.reg-visual
  background #2196f3
  display flex
  flex-direction column
  align-items center
  justify-content center
  height 100%
.main-text
  height 10px
  flex-grow 1
  display flex
  flex-direction column
  justify-content center
  align-items center
  .title
    margin-bottom 6px
    line-height 26px
    letter-spacing 2px
    font-weight bold
    font-size 20px
    color #fff
  .desc
    padding 0 10px
    line-height 16px
    letter-spacing 1px
    text-align center
    font-size 13px
    color #9ed1fa
    span
      display inline-block
.input-group
  position relative
  display flex
  width 100%
  height 44px
  border-top 1px solid #0b75cb
  background #177fd3
  &:before,
  &:after
    content '/'
    position absolute
    top 0
    width 20px
    height 44px
    text-align center
    line-height 44px
    font-size 16px
    color #c9d5e8
  &:before
    left 10px
  &:after
    right 90px
  input,
  button
    box-sizing border-box
    border none
    height 44px
    line-height 44px
    font-size 14px
    background transparent
    transition .2s
    &:active,
    &:focus
      outline none
      background #0b75cb
  input
    padding 0 28px
    flex-grow 1
    color #fff
    &::-webkit-input-placeholder
      color rgba(255, 255, 255, .5)
  button
    width 80px
    text-align center
    cursor pointer
    color #c9d5e8
    &:hover
      background #0b75cb
      color #fff
.reg-visual-small,
.reg-visual-medium
  color #fff
  cursor pointer
  transition .2s
  &:hover
    background #1571bc
</style>

<template>
  <div
    :class="{
      'reg-visual': true,
      'reg-visual-small': widgetsSize === BookmarkSize.small,
      'reg-visual-medium': widgetsSize === BookmarkSize.medium,
      'reg-visual-large': widgetsSize === BookmarkSize.large,
    }"
    @click="handleClick"
  >
    <v-mdi
      v-if="widgetsSize === BookmarkSize.small"
      name="mdi-regex"
    />
    <div
      v-else
      class="main-text"
    >
      <div class="title">
        正则可视化
      </div>
      <div class="desc">
        <span>让晦涩的正则</span><span>生动起来</span>
      </div>
    </div>
    <div
      v-if="widgetsSize === BookmarkSize.large"
      class="input-group"
    >
      <input
        v-model="quickInput"
        type="text"
        placeholder="(?:http(?:|s):|)\/\/(?:[a-zA-Z0-9-]){1,26}(\.[a-zA-Z0-9-]+)+"
        @keydown.enter="showRegVisual"
      >
      <button @click="showRegVisual">
        查看
      </button>
    </div>
  </div>
</template>

<script lang="ts">
import { ref, computed } from 'vue'
import { Bookmark, BookmarkSize } from '@database/entity/bookmark'
import { replaceRouter } from '@/assets/ts/router'
export default {
  name: 'RegVisualWidgetsButton',
  props: {
    data: {
      type: Bookmark,
      default() {
        return new Bookmark({})
      },
    },
  },
  setup(props: { data: Bookmark }) {
    const quickInput = ref('')
    const widgetsSize = computed(() => props.data.size)
    function showRegVisual() {
      setTimeout(() => {
        replaceRouter('widgets', 'reg-visual', {
          regText: quickInput.value,
        })
        quickInput.value = ''
      })
    }
    return {
      BookmarkSize,
      widgetsSize,
      quickInput,
      showRegVisual,
      handleClick() {
        if (widgetsSize.value === BookmarkSize.large) {
          return
        }
        showRegVisual()
      },
    }
  },
}
</script>
