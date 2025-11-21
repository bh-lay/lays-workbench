<template>
  <v-slider
    :model-value="selectedValue"
    :min="0"
    :max="3"
    :step="1"
    :marks="[
      {
        value: 0,
        label: '低',
      },
      {
        value: 1,
        label: '中',
      },
      {
        value: 2,
        label: '高',
      },
      {
        value: 3,
        label: '最高',
      },
    ]"
    @update:model-value="handleUpdate"
  />
</template>

<script setup lang="ts">
import { computed, PropType } from 'vue'
import {
  errorCorrectionLevels,
  ErrorCorrectionLevel,
} from './file-relay-helpers'

const props = defineProps({
  modelValue: {
    type: String as PropType<ErrorCorrectionLevel>,
    default: errorCorrectionLevels[0],
  },
})
const emits = defineEmits(['update:model-value'])
const selectedValue = computed(() => {
  return errorCorrectionLevels.indexOf(props.modelValue)
})
function handleUpdate(newNumber: number) {
  const newValue = errorCorrectionLevels[newNumber]
  emits('update:model-value', newValue)
}
</script>

