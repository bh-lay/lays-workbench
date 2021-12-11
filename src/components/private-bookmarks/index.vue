<style lang="stylus" scoped>
.bookmark-directory
  display flex
  height 100%
  background #3a3a40
.category-list
  width 280px
  flex-shrink 0
  padding 30px 0 60px
  background #4a4a50
  overflow auto
  &::-webkit-scrollbar
    width 0
    height 0
.bookmark-container
  padding 30px 50px
</style>
<template>
  <div class="bookmark-directory">
    <div class="category-list">
      <folder-item
        :data="{
          id: 'root',
          name: '我的书签'
        }"
        :deep="0.5"
        :active="activeId"
        :expand="true"
        :changed-id="changedParentId"
        @select="handleSelect"
        @create="handleCreate"
      >
      </folder-item>
    </div>
    <div class="bookmark-container">
      <link-list :parent="activeId" />
    </div>
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
import LinkList from './link-list.vue'
export default {
  components: { FolderItem, LinkList },
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
        console.log('handleCreate', parentId)
        const item = new Bookmark({
          name: '自定义组-' + new Date().getSeconds(),
          sort: 0,
          type: BookmarkType.folder,
          parent: parentId,
          value: '',
        })
        bookmarkInsertService(item)
        .then(() => {
          changedParentId.value = parentId
          setTimeout(() => {
            changedParentId.value = ''
          }, 200)
        })
      }
    };
  },
};
</script>
