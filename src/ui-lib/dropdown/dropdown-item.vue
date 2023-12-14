<style lang="stylus" scoped>
.v-dropdown-item
  padding 0 20px
  line-height 42px
  font-size 14px
  color #555
  cursor pointer
  transition .15s
  color #bdbdc7
  &:hover
    background #26262c
  &:active,
  &.active
    background #202228
</style>
<template>
  <div
    :class="{
      'v-dropdown-item': true,
      active: active,
    }"
    @click="closeDropdown"
  >
    <slot />
  </div>
</template>

<script setup lang="ts">
import { inject } from 'vue'
// 自定义组件类型
const closeDropdown = inject('close-dropdown', () => {
  // console.log('do nothing')
}, false)

defineProps({
  active: {
    type: Boolean,
    default: false,
  },
})
</script>
