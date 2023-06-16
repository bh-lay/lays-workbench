<style lang="stylus" scoped>
@import '../../assets/stylus/functions/scrollbar.styl'
.bookmark-directory
  display flex
  height 100%
  background #26262c
.category-list
  width 280px
  flex-shrink 0
  padding 30px 0 60px
  overflow auto
  scrollbar #26262c
</style>
<template>
  <div class="bookmark-directory">
    <div class="category-list">
      <folder-item
        :data="rootFolder"
        :deep="1"
        :active="activeId"
        :expand="true"
        :changed-parent-id="changedParentId"
        @select="handleSelect"
        @create="handleCreate"
      />
    </div>
    <main-list
      :parent="activeId"
      :changed-parent-id="changedParentId"
      @open-folder="handleSelect"
      @after-remove="handleMainListRemove"
      @after-insert="handleMainListInsert"
      @after-drag="handleMainListDrag"
    />
  </div>
  <v-modal
    v-model="folderEditorConfig.visible"
    :width="440"
    title="添加文件夹"
    :close-on-click-modal="true"
    :close-on-press-escape="true"
  >
    <folder-editor
      :type="folderEditorConfig.type"
      :folder-name="folderEditorConfig.name"
      @cancel="folderEditorConfig.visible = false"
      @confirm="handleFolderCreateConfirm"
    />
  </v-modal>
</template>

<script lang="ts">
import { ref } from 'vue'
import FolderEditor from './folder-editor.vue'
import {
  Bookmark,
  BookmarkType,
} from '@database/entity/bookmark'
import { bookmarkInsertService } from '@database/services/bookmark-service'
import FolderItem from './folder-item.vue'
import MainList from './main-list.vue'
export default {
  name: 'PrivateBookmarkCenter',
  components: { FolderItem, MainList, FolderEditor },
  setup() {
    const activeId = ref('bookmark-collection')
    const changedParentId = ref('')

    const folderEditorConfig = ref({
      visible: false,
      type: 'create',
      parentId: '',
      id: null,
      name: '',
    })
    return {
      activeId,
      changedParentId,
      folderEditorConfig,
      rootFolder: new Bookmark({
        id: 'bookmark-collection',
        name: '我的书签',
      }),
      handleSelect(selectedId: string) {
        activeId.value = selectedId
      },
      handleCreate(parentId: string) {
        const folderEditorConfigValue = folderEditorConfig.value
        folderEditorConfigValue.visible = true
        folderEditorConfigValue.type = 'create'
        folderEditorConfigValue.parentId = parentId
      },
      handleFolderCreateConfirm({ name }: { name: string }){
        const folderEditorConfigValue = folderEditorConfig.value

        const item = new Bookmark({
          name,
          sort: 0,
          type: BookmarkType.folder,
          parent: folderEditorConfigValue.parentId,
        })
        bookmarkInsertService(item).then(() => {
          changedParentId.value = folderEditorConfigValue.parentId
          setTimeout(() => {
            changedParentId.value = ''
          }, 200)
        })
        folderEditorConfig.value.visible = false
      },
      handleMainListInsert() {
        changedParentId.value = activeId.value
        setTimeout(() => {
          changedParentId.value = ''
        }, 200)
      },
      handleMainListRemove() {
        changedParentId.value = activeId.value
        setTimeout(() => {
          changedParentId.value = ''
        }, 200)
      },
      handleMainListDrag() {
        changedParentId.value = '*'
        setTimeout(() => {
          changedParentId.value = ''
        }, 200)
      },
    }
  },
}
</script>
