<template>
  <div
    class="contextmenu-item"
    @click="handleClick"
  >
    <slot />
  </div>
</template>

<script lang="ts">
import { ComponentPublicInstance, inject } from 'vue'
// 自定义组件类型
type customComponent = ComponentPublicInstance<{visible?: boolean}>

export default {
  name: 'ContextmenuItem',
  setup() {
    const closeDropdown = inject('close-dropdown', () => {}, false)
    return {
      handleClick() {
        closeDropdown()
      },
    }
  },
}
</script>
