<style lang="stylus" scoped>
.v-button
  padding 8px 20px
  border-radius 4px
  line-height 16px
  font-size 14px
  cursor pointer
  transition .15s
  &:focus
    outline none
.v-button-default
  background #2f2f37
  border 1px solid #1c1c21
  color #bdbdc7
  &:hover
    background #3a3a40
  &:active
    background #212126
  &:focus
    border-color #2154ba
.v-button-primary
  background #2196f3
  border 1px solid #2196f3
  color #fff
  &:hover
    background #0b75cb
    border-color #0b75cb
  &:active
    background #0961aa
    border-color #0961aa
  &:focus
    border-color #2154ba
.v-button-secondary
  background transparent
  border 1px solid #1c1c21
  color #bdbdc7
  &:hover
    background #3a3a40
  &:active
    background #212126
  &:focus
    border-color #2154ba
</style>

<template>
  <button :class="['v-button', 'v-button-' + type]">
    <slot />
  </button>
</template>

<script setup lang="ts">
defineProps({
  type: {
    type: String,
    default: 'default',
  },
})
</script>
