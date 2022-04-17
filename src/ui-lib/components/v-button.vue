<style lang="stylus" scoped>
.v-button
  padding 8px 20px
  background #f4f4f4
  border 1px solid #ddd
  border-radius 4px
  line-height 16px
  font-size 14px
  background #2f2f37
  border 1px solid #1c1c21
  color #bdbdc7
  cursor pointer
  transition .15s
  &:hover
    background #3a3a40
  &:active
    background #212126
  &:focus
    outline none
    border-color #2154ba
</style>

<template>
  <button :class="['v-button', 'v-button-' + type]">
    <slot />
  </button>
</template>

<script lang="ts">
export default {
  props: {
    type: {
      type: String,
      default: 'default',
    },
  },
}
</script>
