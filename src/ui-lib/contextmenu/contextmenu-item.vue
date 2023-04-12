<template>
  <div
    class="contextmenu-item"
    @click="closeDropdown"
  >
    <slot />
  </div>
</template>

<script setup lang="ts">
import { inject } from 'vue'
const closeDropdown = inject('close-dropdown', () => {}, false)
</script>
