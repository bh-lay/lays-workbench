<style lang="stylus" scoped>
.icon
  font-size 12px
</style>
<template>
  <bookmark-icon
    class="icon"
    icon="mdi:plus"
    undercoat="#000"
    @click="addBookmarkVisible = true"
  />
  <v-modal
    v-model="addBookmarkVisible"
    :width="400"
  >
    <main-function @success="handleCreateSuccess" />
  </v-modal>
</template>

<script lang="ts">
import { ref } from 'vue'
import MainFunction from './main.vue'
import BookmarkIcon from '../bookmark-icon.vue'
export default {
  name: 'AddBookmarkIndex',
  components: { BookmarkIcon, MainFunction },
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
