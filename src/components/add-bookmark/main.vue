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

<script lang="ts">
import { ref } from 'vue'
import { bookmarkInsertService } from '@database/services/bookmark-service'
import Tab from './tab.vue'
import CustomLink from './custom-link.vue'
import WidgetsSelector from './widgets-selector.vue'
import { Bookmark } from '@/database/entity/bookmark'
export default {
  components: { Tab, CustomLink, WidgetsSelector },
  emits: ['success'],
  setup(props, context) {
    const activeCreateType = ref('custom')
    return {
      activeCreateType,
      handleConfirm(data: Bookmark) {
        bookmarkInsertService(data)
          .then(() => {
            context.emit('success')
          })
      },
    }
  },
}
</script>
