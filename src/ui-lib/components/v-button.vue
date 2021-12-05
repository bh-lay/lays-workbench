<style lang="stylus" scoped>
.v-button
  padding 8px 20px
  background #f4f4f4
  border 1px solid #ddd
  border-radius 4px
  line-height 16px
  font-size 14px
  color #333
  cursor pointer
  transition .15s
.v-button-default
  background #f4f4f4
  border 1px solid #ddd
  color #333
  &:hover
    background #eee
    border-color #ccc
  &:active
    background #ddd
    border-color #ccc
.v-button-dark
  background #444
  border 1px solid #000
  color #eee
  &:hover
    background #333
  &:active
    background #111
</style>

<template>
  <button :class="['v-button', 'v-button-' + type]">
    <slot />
  </button>
</template>

<script>
export default {
  props: {
    type: {
      type: String,
      default: 'default'
    }
  },
};
</script>
