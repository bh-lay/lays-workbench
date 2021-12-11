<style lang="stylus" scoped>
.bookmark-directory
  display flex
  height 100%
  background #26262c
.category-list
  width 280px
  flex-shrink 0
  padding 30px 0 60px
  overflow auto
  &::-webkit-scrollbar
    width 0
    height 0
</style>
<template>
  <div class="bookmark-directory">
    <div class="category-list">
      <folder-item
        :data="{
          id: 'root',
          name: '我的书签'
        }"
        :deep="1"
        :active="activeId"
        :expand="true"
        :changed-parent-id="changedParentId"
        @select="handleSelect"
        @create="handleCreate"
      >
      </folder-item>
    </div>
    <main-list
      :parent="activeId"
      :changed-parent-id="changedParentId"
      @open-folder="handleSelect"
      @after-remove="handleMainListRemove"
      @after-insert="handleMainListInsert"
    />
  </div>
</template>

<script>
import { ref } from "vue";
import {
  Bookmark,
  BookmarkType,
  BookmarkSize,
} from '@database/entity/bookmark';
import { bookmarkInsertService } from '@database/services/bookmark-service';
import FolderItem from './folder-item.vue'
import MainList from './main-list.vue'
export default {
  components: { FolderItem, MainList },
  setup(props) {
    const activeId = ref('root')
    const changedParentId = ref('')
    
    return {
      activeId,
      changedParentId,
      handleSelect(selectedId) {
        activeId.value = selectedId
      },
      handleCreate(parentId) {
        // console.log('handleCreate', parentId)
        // const item = new Bookmark({
        //   name: '自定义组-' + new Date().getSeconds(),
        //   sort: 0,
        //   type: BookmarkType.folder,
        //   parent: parentId,
        //   value: '',
        // })
        // bookmarkInsertService(item)
        // .then(() => {
        //   changedParentId.value = parentId
        //   setTimeout(() => {
        //     changedParentId.value = ''
        //   }, 200)
        // })
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
    };
  },
};
</script>
