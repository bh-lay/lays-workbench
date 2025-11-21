<style lang="less" scoped>
.decoder-pregress {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  span {
    width: 24px;
    height: 24px;
    border-radius: 2px;
    line-height: 24px;
    text-align: center;
    font-size: 12px;
    color: rgba(255, 255, 255, .7);
    &.empty {
      background: #888;
    }
    &.scaned {
      background: #2a782a;
    }
  }
}
</style>
<template>
  <div class="decoder-pregress">
    <span
      v-for="(isScaned, index) in progressList"
      :key="index"
      :class="isScaned ? 'scaned' : 'empty'"
    >{{ index + 1 }}</span>
  </div>
</template>

<script setup lang="ts">
import { PropType, computed } from 'vue'
import { DecoderState } from './file-relay-helpers'

const props = defineProps({
  decoderState: {
    type: Object as PropType<DecoderState>,
    required: true,
  },
})
const progressList = computed(() => {
  if (!props.decoderState.total) {
    return []
  }
  const frameList: boolean[] = []
  for (let i = 0; i < props.decoderState.total; i++) {
    frameList[i] = !!props.decoderState.parts[i + 1]
  }
  return frameList
})
</script>

