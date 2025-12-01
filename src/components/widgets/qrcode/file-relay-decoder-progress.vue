<style lang="less" scoped>
.decoder-pregress {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  span {
    width: 40px;
    padding: 4px o;
    border-radius: 2px;
    line-height: 20px;
    text-align: center;
    font-size: 14px;
    color: rgba(255, 255, 255, .7);
    &.empty {
      background: rgba(0, 0, 0, .4);
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

