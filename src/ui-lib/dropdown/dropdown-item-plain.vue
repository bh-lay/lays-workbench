<template>
  <div
    class="v-dropdown-item"
    @click="closeDropdown"
  >
    <slot />
  </div>
</template>

<script lang="ts">
import { ComponentPublicInstance } from 'vue'
// 自定义组件类型
type customComponent = ComponentPublicInstance<{visible?: boolean}>
// TODO: 项目中有多个类似的定义，可能的话合并
function tryToCloseDropdown(vm: customComponent, maxDeep: number, deep?: number) {
  deep = deep || 1
  if (vm.$options.name === 'VDropdown') {
    vm.visible = false
  } else if (deep <= maxDeep) {
    deep++
    if (vm.$parent) {
      tryToCloseDropdown(vm.$parent as ComponentPublicInstance, maxDeep, deep)
    }
  }
}
export default {
  methods: {
    closeDropdown() {
      tryToCloseDropdown(this.$parent as ComponentPublicInstance, 10)
    },
  },
}
</script>
