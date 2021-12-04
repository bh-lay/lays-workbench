<style lang="stylus" scoped>
.bookmark-map
  display grid
  grid-template-columns repeat(auto-fill, var(--grid-size))
  grid-template-rows repeat(auto-fill, var(--grid-size))
  grid-auto-flow dense
  justify-content center
  padding-top 40px
  .draged
    opacity 0
</style>

<template>
  <div class="bookmark-map">
    <bookmark-item
      v-for="bookmarkItem in bookmarkList"
      :key="bookmarkItem.id"
      :data="bookmarkItem"
      :ref="setItemRef"
      :class="{
        draged: isStartDrag && selectedBookmarkItem.id === bookmarkItem.id
      }"
      v-contextmenu:menu="{
        onVisible() {
          selectedBookmarkItem = bookmarkItem
        }
      }"
      @next="openItem(bookmarkItem)"
      @mousedown="handleDrag($event, bookmarkItem)"
    />
    <bookmark-item :data="addData">
      <template v-slot:body>
        <add-bookmark @success="refreshList" />
      </template>
    </bookmark-item>
  </div>
  <contextmenu ref="menu">
    <contextmenu-item
      v-if="selectedBookmarkItem.type === BookmarkType.link"
      @click="openEditModal"
    >
      编辑
    </contextmenu-item>
    <contextmenu-item @click="handleRemove">删除</contextmenu-item>
  </contextmenu>
  <modal v-model="editModalVisible" :width="400">
    <div style="padding: 20px">
      <custom-link
        :data="selectedBookmarkItem"
        @confirm="handleConfirmEdit"
      />
    </div>
  </modal>
  <draged-layer
    v-if="willStartDrag"
    :event="dragEvent"
    :bookmark-item-vm-list="bookmarkItemVm"
    :draged-bookmark="selectedBookmarkItem"
    @beforeDrag="handleBeforeDrag"
    @dragEnd="handleDragEnd"
  />
  <folder-layer
    v-model:visible="folderLayerVisible"
    :id="selectedBookmarkItem.id"
    :name="selectedBookmarkItem.name"
    @name-change="handleFolderNameChange"
    @open-bookmark-editor="handleEditSubFolderBookmark"
  />
</template>

<script>
import {
  ref,
  nextTick,
  onMounted,
  onBeforeUpdate,
} from 'vue';
import {
  Bookmark,
  BookmarkType,
  BookmarkSize,
} from '@database/entity/bookmark';
import {
  bookmarkInsertService,
  bookmarkRemoveService,
  bookmarkUpdateService,
  bookmarkResortService,
} from '@database/services/bookmark-service';
import { bookmarkListService } from '@database/services/bookmark-service';
import { getAppConfigItem } from '@/assets/js/app-config';
import BookmarkItem from './bookmark-item.vue';
import AddBookmark from './add-bookmark/index.vue';
import CustomLink from './add-bookmark/custom-link.vue';
import DragedLayer from './draged-layer.vue';
import FolderLayer from './folder-layer/index.vue'

function moveIndexTo(list, fromIndex, toIndex) {
  if (fromIndex > toIndex) {
    list.splice(toIndex, 0, list[fromIndex]);
    list.splice(fromIndex + 1, 1);
  } else {
    list.splice(toIndex, 0, list[fromIndex]);
    list.splice(fromIndex, 1);
  }
}
function mouseIntractive({ setSelectedBookmarkItem, handleDragEnd }) {
  const editModalVisible = ref(false);
  const folderLayerVisible = ref(false)
  let dragEvent = null
  const willStartDrag = ref(false);
  const isStartDrag = ref(false)
  const bookmarkItemVm = [];
  // 确保在每次更新之前重置ref
  onBeforeUpdate(() => {
    bookmarkItemVm.splice(0, bookmarkItemVm.length);
  });

  function openEditModal() {
    editModalVisible.value = true;
  }
  function closeEditModal() {
    editModalVisible.value = false;
  }
  function closeFolderLayer() {
    folderLayerVisible.value = false;
  }
  
  var needForbiddenClick = false;
  return {
    folderLayerVisible,
    willStartDrag,
    isStartDrag,
    dragEvent,
    editModalVisible,
    openEditModal,
    closeEditModal,
    closeFolderLayer,
    bookmarkItemVm,
    setItemRef(el) {
      bookmarkItemVm.push(el);
    },
    openItem(data) {
      if (needForbiddenClick) {
        return;
      }
      if (data.type === BookmarkType.link) {
        window.open(data.value, '_blank');
      } else if (data.type === BookmarkType.folder) {
        folderLayerVisible.value = true
      }
    },
    handleDrag(event, bookmarkItem) {
      // 非左键不处理
      if (event.button !== 0) {
        return
      }
      setSelectedBookmarkItem(bookmarkItem);
      this.dragEvent = event
      willStartDrag.value = true;
    },
    handleBeforeDrag() {
      needForbiddenClick = true;
      isStartDrag.value = true
    },
    handleDragEnd({ type, from, to}) {
      willStartDrag.value = false;
      isStartDrag.value = false
      needForbiddenClick = false;
      if (type === 'cancel') {
        return
      }
      handleDragEnd(from, to, type)
    },
  };
}
export default {
  components: { BookmarkItem, AddBookmark, CustomLink, DragedLayer, FolderLayer },
  setup(props, context) {
    let bookmarkList = ref([]);

    const selectedBookmarkItem = ref({});
    const getList = function () {
      bookmarkListService({
        parent: null
      }).then((list) => {
        bookmarkList.value = list;
      });
    };
    onMounted(() => {
      getList();
    });
    function handleDragEnter(list, fromIndex, targetIndex){
      const fromBookmark = list[fromIndex]
      const targetBookmark = list[targetIndex]
      // 找不到拖拽元素，或目标元素，退出
      if (!targetBookmark || !fromBookmark) {
        return
      }
      // 拖拽元素或目标元素是组件，退出
      if (
        fromBookmark.type === BookmarkType.widgets ||
        targetBookmark.type === BookmarkType.widgets
      ) {
        return
      }
      // 拖拽元素是组，退出
      if (fromBookmark.type === BookmarkType.folder) {
        return
      }
      if (targetBookmark.type === BookmarkType.folder) {
        // 目标是目录，直接移入
        // 删除被拖拽的元素
        list.splice(fromIndex, 1)
        // 标记 parent
        fromBookmark.parent = targetBookmark.id
        // 追加图标颜色
        targetBookmark.value += '|' + fromBookmark.undercoat
        return Promise.all([
          bookmarkUpdateService(fromBookmark),
          bookmarkUpdateService(targetBookmark)
        ])
      } else {
        // 目标是链接，先排个序，再合并，最后插入
        const idList = list.map(item => item.id)
        return bookmarkResortService(idList)
          .then(idSortMap => {
            const targetSortValue = idSortMap.get(targetBookmark.id)
            console.log('idSortMap', idSortMap, targetSortValue)
            const item = new Bookmark({
              name: '自定义组',
              // 和目标排序值相同
              sort: targetSortValue,
              type: BookmarkType.folder,
              size: BookmarkSize.small,
              undercoat: '#2196f3',
              value: [targetBookmark.undercoat, fromBookmark.undercoat].join('|')
            })
            return bookmarkInsertService(item)
          })
          .then(folderBookmark => {
            console.log('folderBookmark', folderBookmark)
            // 用新的组替换掉 target 元素
            list.splice(targetIndex, 1, folderBookmark)
            // 删除被拖拽的元素
            list.splice(fromIndex, 1)

            // 拖拽与目标元素的父级都标记为新的组
            fromBookmark.parent = folderBookmark.id
            targetBookmark.parent = folderBookmark.id
            
            return Promise.all([
              bookmarkUpdateService(fromBookmark),
              bookmarkUpdateService(targetBookmark)
            ])
          })
      }
      
    }
    function handleDragMove(list, fromIndex, targetIndex){
      moveIndexTo(list, fromIndex, targetIndex)
      const idList = list.map(item => item.id)
      bookmarkResortService(idList)
    }

    function handleRemove() {
      bookmarkRemoveService(selectedBookmarkItem.value.id).then(() => {
        for (let i = 0; i < bookmarkList.value.length; i++) {
          if (bookmarkList.value[i].id === selectedBookmarkItem.value.id) {
            bookmarkList.value.splice(i, 1);
            break;
          }
        }
      }).catch(e => alert(e.message || '删除失败！'));
    }
    const mouseHandle = mouseIntractive({
      setSelectedBookmarkItem(item) {
        selectedBookmarkItem.value = item;
      },
      // 处理拖拽完成
      handleDragEnd(from, to, method) {
        // 找到拖放元素和目标元素的位置
        let fromIndex = -1;
        let targetIndex = -1;
        const list = bookmarkList.value;
        for (let i = 0; i < list.length; i++) {
          let id = list[i].id;
          if (id === from) {
            fromIndex = i;
          }
          if (to) {
            if (id === to) {
              targetIndex = i;
            }
            if (fromIndex >= 0 && targetIndex >= 0) {
              break;
            }
          } else {
            if (fromIndex >= 0) {
              break;
            }
          }
        }
        if (method === 'enter') {
          handleDragEnter(list, fromIndex, targetIndex)
          return;
        } else if (method === 'before') {
          handleDragMove(list, fromIndex, targetIndex)
        } else if (method === 'delete') {
          handleRemove()
        }
      },
    });
    return {
      bookmarkList,
      BookmarkType,
      BookmarkSize,
      addData: new Bookmark({
        name: '添加',
        type: BookmarkType.widgets,
        size: BookmarkSize.small,
        undercoat: '#2196f3',
      }),
      selectedBookmarkItem,
      handleRemove,
      handleConfirmEdit(bookmarkItem) {
        bookmarkUpdateService(bookmarkItem).then(() => {
          mouseHandle.closeEditModal();
          for (let i = 0; i < bookmarkList.value.length; i++) {
            if (bookmarkList.value[i].id === bookmarkItem.id) {
              bookmarkList.value[i] = bookmarkItem;
              break;
            }
          }
        });
      },
      refreshList() {
        getList();
      },
      handleFolderNameChange(newName) {
        selectedBookmarkItem.value.name = newName
        bookmarkUpdateService(selectedBookmarkItem.value)
      },
      handleEditSubFolderBookmark(bookmarkItem) {
        mouseHandle.closeFolderLayer()
        selectedBookmarkItem.value = bookmarkItem
        mouseHandle.openEditModal()
      },
      ...mouseHandle,
    };
  },
};
</script>
