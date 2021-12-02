<style lang="stylus" scoped>
.add-bookmark-modal
  padding 20px
</style>

<template>
  <div class="add-bookmark-modal">
    <tab v-model="activeCreateType" />
    <custom-link v-if="activeCreateType === 'custom'" @confirm="handleConfirm"/>
    <widgets-selector v-else />
  </div>
</template>

<script>
import { ref } from 'vue';
import { bookmarkInsertService } from '../../database/services/bookmark-service.ts'
import Tab from './tab.vue'
import CustomLink from './custom-link.vue'
import WidgetsSelector from './widgets-selector.vue'
export default {
  emits: ['success'],
  components: { Tab, CustomLink, WidgetsSelector },
  setup(props, context) {
    const activeCreateType = ref('custom')
    return {
      activeCreateType,
      handleConfirm(data) {
        bookmarkInsertService(data)
        .then(() => {
          context.emit('success')
        })
      },
    }
  },
};
</script>
