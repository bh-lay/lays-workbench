<style lang="stylus" scoped>
.icon
  font-size 12px
</style>
<template>
  <bookmark-icon-link
    class="icon"
    icon="mdi:plus"
    undercoat="#334"
    @click="addBookmarkVisible = true"
  />
  <v-modal
    v-model="addBookmarkVisible"
    :width="800"
    :close-on-click-modal="true"
    :close-on-press-escape="true"
  >
    <main-function @success="handleCreateSuccess" />
  </v-modal>
</template>

<script lang="ts">
import { ref } from 'vue'
import MainFunction from './main.vue'
import BookmarkIconLink from '../bookmark-icon-link.vue'
export default {
  name: 'AddBookmarkIndex',
  components: { BookmarkIconLink, MainFunction },
  emits: ['success'],
  setup(props, context) {
    const addBookmarkVisible = ref(false)
    return {
      addBookmarkVisible,
      handleCreateSuccess() {
        addBookmarkVisible.value = false
        context.emit('success')
      },
    }
  },
}
</script>
