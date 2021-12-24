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

<script lang="ts">
import {
  ref,
  Ref,
  shallowRef,
  onMounted,
  ShallowUnwrapRef,
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
function moveIndexTo(list: Bookmark[], fromIndex: number, toIndex: number) {
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
  components: { BookmarkItem, AddBookmark, CustomLink, DragedLayer },
  setup(props, context) {
    let bookmarkList: Ref<Bookmark[]> = ref([]);
    const selectedBookmarkItem: Ref<Bookmark | null> = ref(null)
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

    function handleSetSize(bookmarkItem: Bookmark, size: BookmarkSize) {
      if (
        bookmarkItem.type === BookmarkType.folder &&
        size === BookmarkSize.large
      ) {
        new Message({
          message: '目录不允许设置为最大模式'
        })
        return
      }
      bookmarkItem.size = size
      bookmarkUpdateService(bookmarkItem)
        .catch(e => {
          new Message({
            message: e.message || '设置尺寸失败'
          })
        });
    }
    // : ShallowRef<MouseEvent | null>
    const dragEvent: Ref<MouseEvent | null> = shallowRef(null)
    return {
      dragEvent,
      willStartDrag,
      isStartDrag,
      bookmarkList,
      BookmarkType,
      BookmarkSize,
      selectedBookmarkItem,
      refreshList() {
        getList();
      },
      openItem(data: Bookmark) {
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
      handleDrag(event: MouseEvent, bookmarkItem: Bookmark) {
        // 非左键不处理
        if (event.button !== 0) {
          return
        }
        selectedBookmarkItem.value = bookmarkItem;
        dragEvent.value = event
        willStartDrag.value = true;
      },
      handleBeforeDrag() {
        needForbiddenClick = true;
        isStartDrag.value = true
      },
      handleDragEnd({ type, from, to, size}: {
        type: string,
        from: string,
        to: string,
        size: BookmarkSize
      }) {
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
          const selectedBookmark = selectedBookmarkItem.value
          bookmarkRemoveService(selectedBookmark!.id).then(() => {
            for (let i = 0; i < bookmarkList.value.length; i++) {
              if (bookmarkList.value[i].id === selectedBookmark!.id) {
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
          const selectedBookmark = selectedBookmarkItem.value
          selectedBookmark && handleSetSize(selectedBookmark, size)
        }
      },
      handleRemove() {
        const selectedBookmark = selectedBookmarkItem.value
        if (!selectedBookmark) {
          return
        }
        bookmarkRemoveService(selectedBookmark.id).then(() => {
          for (let i = 0; i < bookmarkList.value.length; i++) {
            if (bookmarkList.value[i].id === selectedBookmark.id) {
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
