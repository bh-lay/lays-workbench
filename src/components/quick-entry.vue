<style lang="stylus" scoped>
.btn-list
  display grid
  grid-template-columns repeat(auto-fill, var(--grid-size))
  grid-auto-flow dense
  justify-content center
  padding-top 40px
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
        v-if="contextmenuVisible"
        class="contextmenu-body"
        v-clickoutside="handleClickOutside"
        :style="{
          top: contextmenuY + 'px',
          left: contextmenuX + 'px',
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
    <modal v-model="editModalVisilbe" :width="400">
      <div style="padding: 20px">
        <custom-link :data="selectedBookmarkItem" @confirm="handleConfirmEdit" />
      </div>
    </modal>
  </div>
</template>

<script>
import { ref, nextTick, onMounted } from 'vue';
import {
  Bookmark,
  BookmarkType,
  BookmarkSize,
} from '../database/entity/bookmark.ts';
import {
  bookmarkRemoveService,
  bookmarkUpdateService,
} from '../database/services/bookmark-service.ts';
import { bookmarkListService } from '../database/services/bookmark-service.ts';
import dragHandle from '../assets/js/drag-handle.ts';
import BookmarkItem from './bookmark-item.vue';
import AddBookmark from './add-bookmark/index.vue';
import CustomLink from './add-bookmark/custom-link.vue';

function mouseIntractive(selectedBookmarkItem) {
  const editModalVisilbe = ref(false);
  const contextmenuVisible = ref(false);
  const contextmenuX = ref(0);
  const contextmenuY = ref(0);
  function closeContextMenu() {
    contextmenuVisible.value = false;
  }
  function closeEditModal() {
    editModalVisilbe.value = false;
  }
  var needForbiddenClick = false
  return {
    editModalVisilbe,
    contextmenuVisible,
    contextmenuX,
    contextmenuY,
    closeContextMenu,
    closeEditModal,
    handleClickOutside() {
      closeContextMenu();
    },
    handleEdit() {
      closeContextMenu();
      editModalVisilbe.value = true;
    },
    openItem(data) {
      if (needForbiddenClick) {
        return
      }
      window.open(data.value, '_blank');
    },
    openContextMenu(event, item) {
      closeContextMenu();
      selectedBookmarkItem.value = item;
      event.preventDefault();
      nextTick(() => {
        contextmenuX.value = event.clientX;
        contextmenuY.value = event.clientY;
        contextmenuVisible.value = true;
      });
    },
    handleDrag(event, bookmarkItem) {
      needForbiddenClick = false
      console.log('bookmarkItem', bookmarkItem);
      dragHandle(event, {
        stableDistance: 20,
        stableStart() {
          console.log('拖动开始了');
          needForbiddenClick = true
          // targetMap = getTargetMap(data.parentFid)
          // shadowNode = new ShadowNode(data)
        },
        move(params) {
          console.log('动了动了', params);
          // shadowNode.updateDragedPosition(clientX, clientY)
          // matchedTarget = getMacthedTarget(targetMap, clientX, clientY)
          // shadowNode.highlight(matchedTarget)
        },
        end(params) {
          console.log('结束了结束了', params);

          // shadowNode.destroy()
          // onDragEnd && onDragEnd(matchedTarget ? matchedTarget.fid : null)
        },
      });
    },
  };
}
export default {
  components: { BookmarkItem, AddBookmark, CustomLink },
  setup() {
    let bookmarkList = ref([]);

    const selectedBookmarkItem = ref({});
    const getList = function () {
      bookmarkListService().then((list) => {
        console.log('list', list);
        bookmarkList.value = list;
      });
    };
    onMounted(() => {
      getList();
    });
    const mouseHandle = mouseIntractive(selectedBookmarkItem);
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
        });
      },
      handleConfirmEdit(bookmarkItem) {
        bookmarkUpdateService(bookmarkItem).then(() => {
          mouseHandle.closeEditModal()
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
