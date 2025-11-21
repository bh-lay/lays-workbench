<style lang="less" scoped>
.selected-label {
  display: inline-block;
  vertical-align: top;
  max-width: 180px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  line-height: 24px;
  font-size: 12px;
}
</style>
<template>
  <v-dropdown
    placement="bottom-right"
    arrow
  >
    <span class="selected-label">{{ selectedCameraLabel }}</span>
    <template #body>
      <v-dropdown-item
        v-for="camera in cameraList"
        :key="camera.id"
        :active="modelValue === camera.id"
        @click="$emit('update:model-value', camera.id)"
      >{{ camera.label }}</v-dropdown-item>
    </template>
  </v-dropdown>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
const props = defineProps({
  modelValue: {
    type: String,
    default: undefined,
  },
})
const cameraList = ref<{
  id: string,
  label: string
}[]>([])

const initCameras = async (): Promise<void> => {
  if (!navigator.mediaDevices?.enumerateDevices) return
  const devices = await navigator.mediaDevices.enumerateDevices()
  const cams = devices.filter((d) => d.kind === 'videoinput')
  cameraList.value = []
  cams.forEach((c, index) => {
    cameraList.value.push({
      id: c.deviceId,
      label: c.label || `camera ${index + 1}`,
    })
  })
}
const selectedCameraLabel = computed(() => {
  if (!props.modelValue) {
    return '默认摄像头'
  }
  const matchedCamera = cameraList.value.find((camera) => {
    return camera.id === props.modelValue
  })
  return matchedCamera?.label || '默认摄像头'
})
defineEmits(['update:model-value'])

onMounted(() => {
  if (navigator.mediaDevices && typeof navigator.mediaDevices.getUserMedia === 'function') {
    initCameras().catch(() => {
      // 用户未授权时忽略
    })
  }
})
</script>

