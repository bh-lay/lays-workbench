<style lang="stylus" scoped>
.btn-list
  display grid
  grid-template-columns repeat(auto-fill, var(--grid-size))
  grid-auto-flow dense
  justify-content center
  padding-top 40px
  .draged
    opacity 0
.contextmenu-body
  position fixed
  width 120px
  padding 15px 0
  border-radius 4px
  background #fff
  box-shadow 2px 2px 10px rgba(0, 0, 0, .2), 1px 1px 3px rgba(0, 0, 0, .2)
  overflow hidden
  z-index 1000
.contextmenu-item
  padding 0 20px
  line-height 34px
  font-size 14px
  color #555
  cursor pointer
  transition .15s
  &:hover
    background: #f4f4f4
</style>

<template>
  <div class="btn-list">
    <bookmark-item
      v-for="bookmarkItem in bookmarkList"
      :key="bookmarkItem.id"
      :data="bookmarkItem"
      :ref="setItemRef"
      :class="{
        draged: dragTriggerBlock.isDraging && selectedBookmarkItem.id === bookmarkItem.id
      }"
      @next="openItem(bookmarkItem)"
      @contextmenu="openContextMenu($event, bookmarkItem)"
      @mousedown="handleDrag($event, bookmarkItem)"
    />
    <bookmark-item :data="addData">
      <template v-slot:body>
        <add-bookmark @success="refreshList" />
      </template>
    </bookmark-item>
    <transition name="slidedown">
      <div
        v-if="contextmenuConfig.visible"
        class="contextmenu-body"
        v-clickoutside="handleClickOutside"
        :style="{
          top: contextmenuConfig.right + 'px',
          left: contextmenuConfig.left + 'px',
        }"
      >
        <div
          v-if="selectedBookmarkItem.type === BookmarkType.link"
          class="contextmenu-item"
          @click="handleEdit"
        >
          编辑
        </div>
        <div class="contextmenu-item" @click="handleRemove">删除</div>
      </div>
    </transition>
  </div>
  <modal v-model="editModalVisilbe" :width="400">
    <div style="padding: 20px">
      <custom-link
        :data="selectedBookmarkItem"
        @confirm="handleConfirmEdit"
      />
    </div>
  </modal>
  <draged-layer v-if="dragTriggerBlock.isDraging" :data="dragTriggerBlock" />
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
} from '../database/entity/bookmark.ts';
import {
  bookmarkInsertService,
  bookmarkRemoveService,
  bookmarkUpdateService,
  bookmarkResortService,
} from '../database/services/bookmark-service.ts';
import { bookmarkListService } from '../database/services/bookmark-service.ts';
import dragHandle from '../assets/js/drag-handle.ts';
import { getVariables } from '../assets/js/css-variables.ts';
import BookmarkItem from './bookmark-item.vue';
import AddBookmark from './add-bookmark/index.vue';
import CustomLink from './add-bookmark/custom-link.vue';
import DragedLayer from './draged-layer.vue';

function moveIndexTo(list, fromIndex, toIndex) {
  if (fromIndex > toIndex) {
    list.splice(toIndex, 0, list[fromIndex]);
    list.splice(fromIndex + 1, 1);
  } else {
    list.splice(toIndex, 0, list[fromIndex]);
    list.splice(fromIndex, 1);
  }
}
class BookmarkMapItem {
  constructor(bookmarkItemVm) {
    const nodeBCR = bookmarkItemVm.$el.getBoundingClientRect();
    this.id = bookmarkItemVm.data.id;
    this.type = bookmarkItemVm.data.type;
    this.top = nodeBCR.top;
    this.left = nodeBCR.left;
    this.right = nodeBCR.right;
    this.bottom = nodeBCR.bottom;
  }
}
function getMouseTriggered({ clientY, clientX, bookmarkType }, map) {
  const { gridGap } = getVariables();
  if (bookmarkType !== BookmarkType.widgets) {
    for (let i = 0; i < map.length; i++) {
      let mapItem = map[i];
      if (
        mapItem.left + gridGap / 2 <= clientX &&
        mapItem.right - gridGap / 2 >= clientX &&
        mapItem.top <= clientY &&
        mapItem.bottom - gridGap >= clientY
      ) {
        // 命中 widgets，则忽略
        if (mapItem.type === BookmarkType.widgets) {
          return
        }
        return {
          type: 'enter',
          target: mapItem,
        };
      }
    }
  }
  for (let t = 0; t < map.length; t++) {
    let mapItem = map[t];
    if (
      // 鼠标在当前卡片同水平线
      mapItem.top < clientY &&
      mapItem.bottom - gridGap > clientY &&
      // 鼠标在卡片左侧 34 像素内
      clientX < mapItem.left + gridGap / 2 &&
      mapItem.left + gridGap / 2 - clientX < gridGap * 2
    ) {
      return {
        type: 'before',
        target: mapItem,
      };
    }
  }
}
function mouseIntractive({ setSelectedBookmarkItem, handleDragEnd }) {
  const editModalVisilbe = ref(false);
  const contextmenuConfig = ref({
    visible: false,
    left: 0,
    right: 0,
  });
  const dragTriggerBlock = ref({
    // null\enter\before
    isDraging: false,
    type: null,
    undercoat: '#333',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    clientX: 0,
    clientY: 0,
  });
  const bookmarkItemVm = [];
  // 确保在每次更新之前重置ref
  onBeforeUpdate(() => {
    bookmarkItemVm.value = [];
  });

  function closeContextMenu() {
    contextmenuConfig.value.visible = false;
  }
  function closeEditModal() {
    editModalVisilbe.value = false;
  }
  var needForbiddenClick = false;
  return {
    dragTriggerBlock,
    editModalVisilbe,
    contextmenuConfig,
    closeContextMenu,
    closeEditModal,
    setItemRef(el) {
      bookmarkItemVm.value.push(el);
    },
    handleClickOutside() {
      closeContextMenu();
    },
    handleEdit() {
      closeContextMenu();
      editModalVisilbe.value = true;
    },
    openItem(data) {
      if (needForbiddenClick) {
        return;
      }
      if (data.type === BookmarkType.link) {
        window.open(data.value, '_blank');
      } else if (data.type === BookmarkType.folder) {
        alert('打开组')
      }
    },
    openContextMenu(event, item) {
      closeContextMenu();
      setSelectedBookmarkItem(item);
      event.preventDefault();
      nextTick(() => {
        contextmenuConfig.value.left = event.clientX;
        contextmenuConfig.value.right = event.clientY;
        contextmenuConfig.value.visible = true;
      });
    },
    handleDrag(event, bookmarkItem) {
      setSelectedBookmarkItem(bookmarkItem);
      needForbiddenClick = false;
      const itemSizeAndPositionMap = []
      dragHandle(event, {
        stableDistance: 20,
        stableStart() {
          bookmarkItemVm.value.forEach(bookmarkItemVm => {
            if (!bookmarkItemVm) {
              return
            }
            itemSizeAndPositionMap.push(new BookmarkMapItem(bookmarkItemVm))
          });
          dragTriggerBlock.value.isDraging = true;
          dragTriggerBlock.value.undercoat = bookmarkItem.undercoat
          needForbiddenClick = true;
        },
        move(params) {
          const triggered = getMouseTriggered(
            {
              bookmarkType: bookmarkItem.type,
              clientY: params.clientY,
              clientX: params.clientX,
            },
            itemSizeAndPositionMap
          );
          const value = dragTriggerBlock.value;
          value.clientX = params.clientX
          value.clientY = params.clientY
          if (triggered) {
            let triggeredTarget = triggered.target;
            value.type = triggered.type;
            value.top = triggeredTarget.top;
            value.left = triggeredTarget.left;
            value.right = triggeredTarget.right;
            value.bottom = triggeredTarget.bottom;
          } else {
            value.type = null;
          }
        },
        end(params) {
          const triggered = getMouseTriggered(
            {
              clientY: params.clientY,
              clientX: params.clientX,
              bookmarkType: bookmarkItem.type,
            },
            itemSizeAndPositionMap
          );
          dragTriggerBlock.value.isDraging = false;
          if (!triggered) {
            return
          }
          if (bookmarkItem.id === triggered.target.id) {
            return;
          }
          handleDragEnd(
            bookmarkItem.id,
            triggered.target.id,
            triggered.type
          );
        },
      });
    },
  };
}
export default {
  components: { BookmarkItem, AddBookmark, CustomLink, DragedLayer },
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
    function handleDragEnter(fromIndex, targetIndex){
      const list = bookmarkList.value;
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
      // 拖拽元素本身是组，退出
      if (fromBookmark.parent) {
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
    function handleDragMove(fromIndex, targetIndex){
      moveIndexTo(list, fromIndex, targetIndex)
      const idList = list.map(item => item.id)
      bookmarkResortService(idList)
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
          if (id === to) {
            targetIndex = i;
          }
          if (fromIndex >= 0 && targetIndex >= 0) {
            break;
          }
        }
        if (method === 'enter') {
          handleDragEnter(fromIndex, targetIndex)
          return;
        } else if (method === 'before') {
          handleDragMove(fromIndex, targetIndex)
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

      handleRemove() {
        mouseHandle.closeContextMenu();
        bookmarkRemoveService(selectedBookmarkItem.value.id).then(() => {
          for (let i = 0; i < bookmarkList.value.length; i++) {
            if (bookmarkList.value[i].id === selectedBookmarkItem.value.id) {
              bookmarkList.value.splice(i, 1);
              break;
            }
          }
        }).catch(e => alert(e.message || '删除失败！'));
      },
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
      ...mouseHandle,
    };
  },
};
</script>
