<template>
  <div
    class="contextmenu-item"
    @click="handleClick"
  >
    <slot />
  </div>
</template>

<script lang="ts">
import { getCurrentInstance, ComponentPublicInstance } from 'vue'
// 自定义组件类型
type customComponent = ComponentPublicInstance<{visible?: boolean}>
function tryToCloseParent(
  vm: customComponent,
  maxDeep: number,
  deep?: number
) {
  deep = deep || 1
  if (vm.$options.name === 'VContextmenu') {
    vm.visible = false
  } else if (deep <= maxDeep) {
    deep++
    if (vm.$parent) {
      tryToCloseParent(vm.$parent as customComponent, maxDeep, deep)
    }
  }
}
export default {
  name: 'ContextmenuItem',
  setup() {
    const internalInstance = getCurrentInstance()
    return {
      handleClick() {
        if (!internalInstance || !internalInstance.proxy) {
          return
        }
        tryToCloseParent(internalInstance.proxy.$parent as customComponent, 10)
      },
    }
  },
}
</script>
