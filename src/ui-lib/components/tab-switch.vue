
<style scoped lang="stylus">
.v-tab-switch
  display flex
  padding 0 10px
  border-bottom 1px solid #3b3b44
.tab-item
  position relative
  margin-right 2px
  padding 8px 18px
  font-size 14px
  color #adadb8
  cursor pointer
  transition .15s
  --line-color transparent
  &:after
    content ''
    position absolute
    bottom -1px
    left 0
    width 100%
    height 2px
    background-color var(--line-color)
    transition .2s
  &:hover
    --line-color #1e5f97
  &.active,
  &:active
    --line-color #289cff
    color #fff
</style>


<template>
  <div class="v-tab-switch">
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
