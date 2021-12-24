<template>
  <div class="dropdown-item" @click="closeDropdown"><slot /></div>
</template>

<script lang="ts">
function tryToCloseDropdown(vm: any, maxDeep: number, deep?: number) {
  deep = deep || 1
  if (vm.$options.name === 'dropdown') {
    vm.visible = false
  } else if (deep <= maxDeep) {
    deep++
    tryToCloseDropdown(vm.$parent, maxDeep, deep)
  }
}
export default {
  methods: {
    closeDropdown() {
      tryToCloseDropdown(this.$parent, 10)
    },
  },
};
</script>
