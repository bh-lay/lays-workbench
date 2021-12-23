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
  background #2f2f37
  border 1px solid #1c1c21
  color #bdbdc7
  &:hover
    background #3a3a40
  &:active
    background #212126
.v-button-white
  background #f4f4f4
  border 1px solid #ddd
  color #333
  &:hover
    background #eee
    border-color #ccc
  &:active
    background #ddd
    border-color #ccc
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
