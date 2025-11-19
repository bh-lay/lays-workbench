<style lang="stylus" scoped>
.add-bookmark-modal
  padding 20px
</style>

<template>
  <div class="add-bookmark-modal">
    <VTabSwitch
      v-model="activeCreateType"
      :options="tabOptions"
    />
    <custom-link
      v-if="activeCreateType === 'custom'"
      @confirm="handleConfirm"
    />
    <widgets-selector
      v-else
      @confirm="handleConfirm"
    />
  </div>
</template>

<script setup lang="ts">
import { Ref, ref, inject } from 'vue'
import { bookmarkInsertService } from '@database/services/bookmark-service'
import CustomLink from './custom-link.vue'
import WidgetsSelector from './widgets-selector.vue'
import { Bookmark } from '@/database/entity/bookmark'

const emits = defineEmits(['success'])
const tabOptions = [
  { id: 'custom', label: '自定义链接' },
  { id: 'widgets', label: '小工具' },
]
const activeCreateType = ref<string>(tabOptions[0].id)
const activeDesktopId = inject<Ref<string>>('activeDesktopId')

function handleConfirm(data: Bookmark) {
  data.parent = activeDesktopId?.value || ''
  bookmarkInsertService(data)
    .then(() => {
      emits('success')
    })
}
</script>
