<style lang="stylus" scoped>
@import '../../assets/stylus/functions/scrollbar.styl'
.container
  position relative
  min-height 260px
  max-height 400px
  padding 40px
  overflow auto
  scrollbar #26262c
@media screen and (max-width: 770px)
  .container
    flex-shrink 1
    margin 20px
</style>

<template>
  <div class="container">
    <name-editor
      :model-value="name"
      @update:model-value="handleNameChange"
    />
    <div class="btn-list">
      <bookmark-list
        :parent-id="id"
        @after-drop-to-desktop="$emit('after-drop-to-desktop', $event)"
      />
    </div>
  </div>
</template>

<script lang="ts">
import NameEditor from './name-editor.vue'
import BookmarkList from './bookmark-list.vue'

export default {
  name: 'BookmarkFolderLayer',
  components: { NameEditor, BookmarkList },
  props: {
    id: {
      type: String,
      default: '',
    },
    name: {
      type: String,
      default: '',
    },
  },
  emits: ['name-change', 'after-drop-to-desktop'],
  setup(props, context) {
    return {
      handleNameChange(newValue: string) {
        context.emit('name-change', newValue)
      },
    }
  },
}
</script>
