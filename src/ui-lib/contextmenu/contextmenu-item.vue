<style lang="stylus" scoped>
.contextmenu-item
  padding 0 20px
  line-height 34px
  font-size 14px
  color #555
  cursor pointer
  transition .15s
  &:hover
    background: #f4f4f4
</style>

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
        console.log('internalInstance', internalInstance)
        context.emit('click')
        tryToCloseParent(internalInstance.proxy.$parent, 10)
      }
    }
  },
};
</script>
