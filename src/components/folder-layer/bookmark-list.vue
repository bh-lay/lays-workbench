<style lang="stylus" scoped>
.bookmark-map
  display grid
  grid-template-columns repeat(auto-fill, var(--grid-size))
  grid-template-rows repeat(auto-fill, var(--grid-size))
  grid-auto-flow dense
  justify-content center
  padding-top 30px
</style>

<template>
<div class="bookmark-map">
  <bookmark-item
    v-for="bookmarkItem in bookmarkList"
    :key="bookmarkItem.id"
    :data="bookmarkItem"
    :data-id="bookmarkItem.id"
    @next="openItem(bookmarkItem)"
    @mousedown="handleDrag($event, bookmarkItem)"
    v-contextmenu:menu="{
      onVisible() {
        selectedBookmarkItem = bookmarkItem
      }
    }"
  />
  <contextmenu ref="menu">
    <contextmenu-item
      v-if="selectedBookmarkItem.type === BookmarkType.link"
      @click="$emit('open-bookmark-editor', selectedBookmarkItem)"
    >
      编辑
    </contextmenu-item>
    <contextmenu-item @click="handleRemove">删除</contextmenu-item>
  </contextmenu>
  <draged-layer
    v-if="willStartDrag"
    :event="dragEvent"
    :draged-bookmark="selectedBookmarkItem"
    :disabled-enter="true"
    @beforeDrag="handleBeforeDrag"
    @dragEnd="handleDragEnd"
  />
</div>
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
  bookmarkListService,
  bookmarkRemoveService,
  bookmarkResortService,
  bookmarkUpdateService,
} from '@database/services/bookmark-service';
import { Message } from '@/ui-lib/message/index'
import BookmarkItem from '../bookmark-item.vue';
import AddBookmark from '../add-bookmark/index.vue';
import CustomLink from '../add-bookmark/custom-link.vue';
import DragedLayer from '../draged-layer.vue';
function moveIndexTo(list, fromIndex, toIndex) {
  if (fromIndex > toIndex) {
    list.splice(toIndex, 0, list[fromIndex]);
    list.splice(fromIndex + 1, 1);
  } else {
    list.splice(toIndex, 0, list[fromIndex]);
    list.splice(fromIndex, 1);
  }
}
export default {
  emits: ['open-bookmark-editor'],
  props: {
    parentId: {
      type: String,
      default: ''
    },
  },
  components: { BookmarkItem, AddBookmark, CustomLink, DragedLayer, DragedLayer },
  setup(props, context) {
    let bookmarkList = ref([]);
    const selectedBookmarkItem = ref(null)
    const getList = function () {
      bookmarkListService({
        parent: props.parentId
      }).then((list) => {
        bookmarkList.value = list;
      });
    };
    onMounted(() => {
      getList();
    });
    let needForbiddenClick = false;
    const willStartDrag = ref(false)
    const isStartDrag = ref(false)

    function handleSetSize(bookmarkItem, size) {
      if (
        bookmarkItem.type === BookmarkType.folder &&
        size === BookmarkSize.large
      ) {
        new Message({
          message: '目录不允许设置为最大模式！'
        })
        return
      }
      bookmarkItem.size = size
      bookmarkUpdateService(bookmarkItem)
        .catch(e => {
          new Message({
            message: e.message || '设置尺寸失败！'
          })
        });
    }
    return {
      dragEvent: null,
      willStartDrag,
      isStartDrag,
      bookmarkList,
      BookmarkType,
      BookmarkSize,
      selectedBookmarkItem,
      refreshList() {
        getList();
      },
      openItem(data) {
        if (needForbiddenClick) {
          return;
        }
        willStartDrag.value = false;
        if (data.type === BookmarkType.link) {
          if (data.value && data.value.match(/^#/)) {
            location.hash = data.value
          } else {
            window.open(data.value, '_blank');
          }
        }
      },
      handleDrag(event, bookmarkItem) {
        // 非左键不处理
        if (event.button !== 0) {
          return
        }
        selectedBookmarkItem.value = bookmarkItem;
        this.dragEvent = event
        willStartDrag.value = true;
      },
      handleBeforeDrag() {
        needForbiddenClick = true;
        isStartDrag.value = true
      },
      handleDragEnd({ type, from, to, size}) {
        willStartDrag.value = false;
        isStartDrag.value = false
        needForbiddenClick = false;
        if (type === 'cancel' || type === 'enter') {
          return
        }
        if (type === 'before') {
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
          moveIndexTo(list, fromIndex, targetIndex)
          const idList = list.map(item => item.id)
          bookmarkResortService(idList)
        } else if (type === 'delete') {
          bookmarkRemoveService(selectedBookmarkItem.value.id).then(() => {
            for (let i = 0; i < bookmarkList.value.length; i++) {
              if (bookmarkList.value[i].id === selectedBookmarkItem.value.id) {
                bookmarkList.value.splice(i, 1);
                break;
              }
            }
          }).catch(e => {
            new Message({
              message: e.message || '删除失败！'
            })
          });
        } else if (type === 'size') {
          handleSetSize(selectedBookmarkItem.value, size)
        }
      },
      handleRemove() {
        bookmarkRemoveService(selectedBookmarkItem.value.id).then(() => {
          for (let i = 0; i < bookmarkList.value.length; i++) {
            if (bookmarkList.value[i].id === selectedBookmarkItem.value.id) {
              bookmarkList.value.splice(i, 1);
              break;
            }
          }
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
