<template>
  <div
    class="v-dropdown-item-plain"
    @click="closeDropdown"
  >
    <slot />
  </div>
</template>

<script setup lang="ts">
import { inject } from 'vue'
// 自定义组件类型
const closeDropdown = inject('close-dropdown', () => {}, false)
</script>
