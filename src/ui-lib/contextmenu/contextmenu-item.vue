<template>
  <div class="contextmenu-item" @click="handleClick">
    <slot />
  </div>
</template>

<script>
import { getCurrentInstance } from 'vue'

function tryToCloseParent(vm, maxDeep, deep) {
  deep = deep || 1
  if (vm.$options.name === 'contextmenu') {
    vm.visible = false
  } else if (deep <= maxDeep) {
    deep++
    tryToCloseParent(vm.$parent, maxDeep, deep)
  }
}
export default {
  name: 'contextmenu-item',
  setup(props, context) {
    const internalInstance = getCurrentInstance()
    return {
      handleClick() {
        tryToCloseParent(internalInstance.proxy.$parent, 10)
      }
    }
  },
};
</script>
