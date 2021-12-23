<style lang="stylus" scoped>
.bookmark-container
  width 100px
  flex-grow 1
  padding 30px 50px
  overflow auto
  &::-webkit-scrollbar
    width 0
    height 0
.link-list-body
  border-radius 4px
  background #2f2f37
  overflow hidden
  box-shadow 1px 1px 3px rgba(0, 0, 0, .3), 1px 1px 10px rgba(0, 0, 0, .1)
.header
  margin-bottom 15px
  .v-button
    margin-right 15px
.empty
  padding 100px 20px
  text-align center
  color #545463
</style>
<template>
  <div class="bookmark-container" v-contextmenu:listMenu>
    <div class="header">
      <v-button @click="handleCreateLink">添加链接</v-button>
      <v-button @click="handleCreateFolder">添加文件夹</v-button>
    </div>
    <div v-if="bookmarkList.length === 0" class="empty">
      万物皆空
    </div>
    <div v-else class="link-list-body">
      <main-item
        v-for="item in bookmarkList"
        :key="item.id" :data="item"
        :active="selectedBookmark.id === item.id"
        v-contextmenu:itemMenu="{
          onVisible() {
            selectedBookmark = item
          }
        }"
        @click="selectedBookmark = item"
        @dblclick="handleOpen(item)"
      />
    </div>
  </div>
  <contextmenu ref="itemMenu">
    <contextmenu-item @click="handleEdit">编辑</contextmenu-item>
    <contextmenu-item @click="handleRemove">删除</contextmenu-item>
  </contextmenu>
  <contextmenu ref="listMenu">
    <contextmenu-item @click="handleCreateLink">添加新书签</contextmenu-item>
    <contextmenu-item @click="handleCreateFolder">添加新文件夹</contextmenu-item>
  </contextmenu>
  <modal v-model="linkEditorConfig.visible" :width="440">
    <link-editor
      :type="linkEditorConfig.type"
      :link-name="selectedBookmark.name"
      :link-value="selectedBookmark.value"
      @cancel="linkEditorConfig.visible = false"
      @confirm="handleLinkEditorConfirm"
    />
  </modal>
  <modal v-model="folderEditorConfig.visible" :width="440">
    <folder-editor
      :type="folderEditorConfig.type"
      :folder-name="selectedBookmark.name"
      @cancel="folderEditorConfig.visible = false"
      @confirm="handleFolderEditorConfirm"
    />
  </modal>
</template>

<script>
import { ref, watch } from 'vue';
import {
  Bookmark,
  BookmarkType,
  BookmarkSize,
} from '@database/entity/bookmark';
import {
  bookmarkListService,
  bookmarkInsertService,
  bookmarkUpdateService,
  bookmarkRemoveService,
} from '@database/services/bookmark-service';
import { Message } from '@/ui-lib/message/index'
import MainItem from './main-item.vue';
import LinkEditor from './link-editor.vue'
import FolderEditor from './folder-editor.vue'
export default {
  components: { MainItem, LinkEditor, FolderEditor },
  emits: ['select', 'create', 'open-folder', 'after-insert', 'after-remove'],
  props: {
    parent: {
      type: String,
      default: '',
    },
    changedParentId: {
      type: String,
      default: '',
    },
  },
  setup(props, context) {
    const bookmarkList = ref([]);
    const selectedBookmark = ref({})
    const loadList = () => {
      bookmarkListService({
        parent: props.parent,
      }).then((list) => {
        list.sort((A, B) => {
          let aValue = (A.type === BookmarkType.folder ? 10000 : 0) + A.sort
          let bValue = (B.type === BookmarkType.folder ? 10000 : 0) + B.sort
          return bValue - aValue
        })
        bookmarkList.value = list;
      });
    };
    loadList();
    watch(() => props.parent, loadList);
    watch(
      () => props.changedParentId,
      (changedParentId) => {
        if (changedParentId !== props.parent) {
          return;
        }
        loadList();
      }
    );
    const linkEditorConfig = ref({
      visible: false,
      type: 'create'
    })
    const folderEditorConfig = ref({
      visible: false,
      type: 'create'
    })
    return {
      selectedBookmark,
      bookmarkList,
      linkEditorConfig,
      folderEditorConfig,
      handleCreateLink() {
        const linkEditorConfigValue = linkEditorConfig.value
        linkEditorConfigValue.visible = true
        linkEditorConfigValue.type = 'create'
      },
      handleCreateFolder() {
        const folderEditorConfigValue = folderEditorConfig.value
        folderEditorConfigValue.visible = true
        folderEditorConfigValue.type = 'create'
      },
      handleEdit() {
        if (selectedBookmark.value.type === BookmarkType.folder) {
          const folderEditorConfigValue = folderEditorConfig.value
          folderEditorConfigValue.visible = true
          folderEditorConfigValue.type = 'edit'
        } else {
          const linkEditorConfigValue = linkEditorConfig.value
          linkEditorConfigValue.visible = true
          linkEditorConfigValue.type = 'edit'
        }
      },
      handleLinkEditorConfirm({ name, value }) {
        if (linkEditorConfig.value.type === 'edit') {
          const bookmarkItem = selectedBookmark.value
          bookmarkItem.name = name
          bookmarkItem.value = value
          bookmarkUpdateService(bookmarkItem)
        } else {
          const item = new Bookmark({
            name,
            sort: 0,
            type: BookmarkType.link,
            parent: props.parent,
            value,
          });
          bookmarkInsertService(item).then(() => {
            context.emit('after-insert')
          });
        }
        linkEditorConfig.value.visible = false
      },
      handleFolderEditorConfirm({ name }) {
        if (folderEditorConfig.value.type === 'edit') {
          const bookmarkItem = selectedBookmark.value
          bookmarkItem.name = name
          bookmarkUpdateService(bookmarkItem)
        } else {
          const item = new Bookmark({
            name,
            sort: 0,
            type: BookmarkType.folder,
            parent: props.parent,
          });
          bookmarkInsertService(item).then(() => {
            context.emit('after-insert')
          });
        }
        folderEditorConfig.value.visible = false
      },
      handleOpen(bookmark) {
        if (bookmark.type === BookmarkType.folder) {
          context.emit('open-folder', bookmark.id)
        } else if (bookmark.type === BookmarkType.link) {
          window.open(bookmark.value, '_blank')
        }
      },
      handleRemove() {
        bookmarkRemoveService(selectedBookmark.value.id).then(() => {
          for (let i = 0; i < bookmarkList.value.length; i++) {
            if (bookmarkList.value[i].id === selectedBookmark.value.id) {
              bookmarkList.value.splice(i, 1);
              break;
            }
          }
          context.emit('after-remove')
        }).catch(e => {
          new Message({
            message: e.message || '删除失败！'
          })
        });
      },
    };
  },
};
</script>
