<template>
  <div class="tab-outer">
    <div
      v-for="item in options"
      :key="item.id"
      class="tab-item"
      :class="{ active: item.id === internalValue }"
      @click="handleSelect(item.id)"
    >
      <slot name="label" :item="item">
        {{ item.label }}
      </slot>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, PropType } from 'vue'

interface TabOption {
  id: string | number
  label: string
}

export default defineComponent({
  name: 'UiTabSwitch',
  props: {
    options: {
      type: Array as PropType<TabOption[]>,
      required: true,
    },
    modelValue: {
      type: [String, Number] as PropType<string | number | null>,
      default: null,
    },
  },
  emits: ['update:modelValue'],
  setup(props, { emit }) {
    const internalValue = computed({
      get: () => props.modelValue,
      set: (val: string | number | null) => {
        if (val !== null) {
          emit('update:modelValue', val)
        }
      },
    })

    const handleSelect = (id: string | number): void => {
      if (id !== internalValue.value) {
        internalValue.value = id
      }
    }

    return {
      options: props.options,
      internalValue,
      handleSelect,
    }
  },
})
</script>

<style scoped lang="stylus">
.tab-outer
  display flex
  border-bottom 1px solid #3b3b44
.tab-item
  margin-right 2px
  padding 8px 18px
  border-radius 4px 4px 0 0
  font-size 14px
  color #adadb8
  cursor pointer
  transition .15s
  &:hover
    background #2f2f37
  &.active,
  &:active
    background #2b2b31
    color #c1c5cd
</style>

