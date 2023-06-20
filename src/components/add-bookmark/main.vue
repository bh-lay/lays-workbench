<style lang="stylus" scoped>
.add-bookmark-modal
  padding 20px
</style>

<template>
  <div class="add-bookmark-modal">
    <tab v-model="activeCreateType" />
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
import Tab from './tab.vue'
import CustomLink from './custom-link.vue'
import WidgetsSelector from './widgets-selector.vue'
import { Bookmark } from '@/database/entity/bookmark'

const emits = defineEmits(['success'])
const activeCreateType = ref('custom')
const activeDesktopId = inject<Ref<string>>('activeDesktopId')

function handleConfirm(data: Bookmark) {
  data.parent = activeDesktopId?.value || ''
  bookmarkInsertService(data)
    .then(() => {
      emits('success')
    })
}
</script>
