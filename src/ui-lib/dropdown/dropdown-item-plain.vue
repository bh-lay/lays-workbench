<template>
  <div class="dropdown-item" @click="closeDropdown"><slot /></div>
</template>

<script>
function tryToCloseDropdown(vm, maxDeep, deep) {
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
