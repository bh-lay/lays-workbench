<style lang="stylus" scoped>
.container
  position relative
  min-height 260px
  padding 40px
  overflow auto
  &::-webkit-scrollbar
    width 0
    height 0
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
        @open-bookmark-editor="$emit('open-bookmark-editor', $event)"
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
  emits: ['name-change', 'open-bookmark-editor', 'after-drop-to-desktop'],
  setup(props, context) {
    return {
      handleNameChange(newValue: string) {
        context.emit('name-change', newValue)
      },
    }
  },
}
</script>
