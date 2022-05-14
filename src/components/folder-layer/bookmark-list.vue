<style lang="stylus" scoped>
.bookmark-map
  display grid
  grid-template-columns repeat(auto-fill, var(--grid-size))
  grid-template-rows repeat(auto-fill, var(--grid-size))
  grid-auto-flow dense
  justify-content center
  padding-top 30px
  .bookmark-item
    transition .2s
  .draged
    opacity 0
  .selected
    transform scale(0.9)
</style>

<template>
  <div class="bookmark-map">
    <bookmark-item
      v-for="bookmarkItem in bookmarkList"
      :key="bookmarkItem.id"
      v-contextmenu:menu="{
        beforeVisible() {
          selectedBookmarkItem = bookmarkItem
        }
      }"
      v-drag-start="(event) => {
        dragStartHandle(event, bookmarkItem)
      }"
      :class="{
        draged: isStartDrag && selectedBookmarkItem.id === bookmarkItem.id,
        selected: isContextmenuVisible && selectedBookmarkItem.id === bookmarkItem.id
      }"
      :data="bookmarkItem"
      :data-id="bookmarkItem.id"
      @next="openItem($event)"
    />
    <v-contextmenu
      ref="menu"
      @before-visible="isContextmenuVisible = true"
      @after-close="isContextmenuVisible = false"
    >
      <v-contextmenu-item
        v-if="selectedBookmarkItem.type === BookmarkType.link"
        @click="$emit('open-bookmark-editor', selectedBookmarkItem)"
      >
        编辑
      </v-contextmenu-item>
      <v-contextmenu-item @click="handleSetToDesktop">
        放回桌面
      </v-contextmenu-item>
      <v-contextmenu-item @click="handleRemove">
        删除
      </v-contextmenu-item>
    </v-contextmenu>
    <draged-layer
      v-if="willStartDrag"
      :event="dragEvent"
      :draged-bookmark="selectedBookmarkItem"
      :disabled-enter="true"
      :disabled-size="true"
      @before-drag="handleBeforeDrag"
      @drag-end="handleDragEnd"
    />
  </div>
</template>

<script lang="ts">
import {
  ref,
  Ref,
  shallowRef,
  onMounted,
} from 'vue'
import {
  Bookmark,
  BookmarkType,
  BookmarkSize,
} from '@database/entity/bookmark'
import {
  bookmarkListService,
  bookmarkRemoveService,
  bookmarkResortService,
  bookmarkUpdateService,
} from '@database/services/bookmark-service'
import { Message } from '@/ui-lib/message/index'
import BookmarkItem from '../bookmark-item.vue'
import DragedLayer from '../draged-layer.vue'
function moveIndexTo(list: Bookmark[], fromIndex: number, toIndex: number) {
  if (fromIndex > toIndex) {
    list.splice(toIndex, 0, list[fromIndex])
    list.splice(fromIndex + 1, 1)
  } else {
    list.splice(toIndex, 0, list[fromIndex])
    list.splice(fromIndex, 1)
  }
}
export default {
  components: { BookmarkItem, DragedLayer },
  props: {
    parentId: {
      type: String,
      default: '',
    },
  },
  emits: ['open-bookmark-editor', 'after-drop-to-desktop'],
  setup(props, context) {
    let bookmarkList: Ref<Bookmark[]> = ref([])
    const selectedBookmarkItem: Ref<Bookmark | null> = ref(null)
    const getList = function () {
      bookmarkListService({
        parent: props.parentId,
      }).then((list) => {
        // 强制更改为小组件模式
        list.forEach(item => {
          item.size = BookmarkSize.small
        })
        bookmarkList.value = list
      })
    }
    onMounted(() => {
      getList()
    })
    let needForbiddenClick = false
    const willStartDrag = ref(false)
    const isStartDrag = ref(false)
    const isContextmenuVisible = ref(false)

    function handleSetToDesktop() {
      const selectedBookmark = selectedBookmarkItem.value
      if (!selectedBookmark) {
        return
      }
      selectedBookmark.parent = ''
      bookmarkUpdateService(selectedBookmark)
        .then(() => {
          for (let i = 0; i < bookmarkList.value.length; i++) {
            if (bookmarkList.value[i].id === selectedBookmark.id) {
              bookmarkList.value.splice(i, 1)
              break
            }
          }
          context.emit('after-drop-to-desktop')
        })
        .catch(e => {
          new Message({
            message: e.message || '放回桌面失败',
          })
        })
    }
    function handleRemove() {
      const selectedBookmark = selectedBookmarkItem.value
      if (!selectedBookmark) {
        return
      }
      bookmarkRemoveService(selectedBookmark.id).then(() => {
        for (let i = 0; i < bookmarkList.value.length; i++) {
          if (bookmarkList.value[i].id === selectedBookmark.id) {
            bookmarkList.value.splice(i, 1)
            break
          }
        }
      }).catch(e => {
        new Message({
          message: e.message || '删除失败',
        })
      })
    }

    const dragEvent: Ref<MouseEvent | TouchEvent | null> = shallowRef(null)
    return {
      dragEvent,
      willStartDrag,
      isStartDrag,
      isContextmenuVisible,
      bookmarkList,
      BookmarkType,
      BookmarkSize,
      selectedBookmarkItem,
      refreshList() {
        getList()
      },
      openItem(data: Bookmark) {
        if (needForbiddenClick) {
          return
        }
        willStartDrag.value = false
        if (data.type === BookmarkType.link) {
          const bookmarkValue = data.value
          if (typeof bookmarkValue !== 'string') {
            return
          }
          if (bookmarkValue && bookmarkValue.match(/^#/)) {
            location.hash = bookmarkValue
          } else {
            window.open(bookmarkValue, '_blank')
          }
        }
      },
      dragStartHandle(event: MouseEvent | TouchEvent, bookmarkItem: Bookmark) {
        selectedBookmarkItem.value = bookmarkItem
        dragEvent.value = event
        willStartDrag.value = true
      },
      handleBeforeDrag() {
        needForbiddenClick = true
        isStartDrag.value = true
      },
      handleDragEnd({ type, from, to }: {
        type: string,
        from: string,
        to: string,
        size: BookmarkSize
      }) {
        willStartDrag.value = false
        isStartDrag.value = false
        needForbiddenClick = false
        if (type === 'cancel' || type === 'enter' || type === 'size') {
          return
        }
        if (type === 'before') {
          let fromIndex = -1
          let targetIndex = -1
          const list = bookmarkList.value
          for (let i = 0; i < list.length; i++) {
            let id = list[i].id
            if (id === from) {
              fromIndex = i
            }
            if (to) {
              if (id === to) {
                targetIndex = i
              }
              if (fromIndex >= 0 && targetIndex >= 0) {
                break
              }
            } else {
              if (fromIndex >= 0) {
                break
              }
            }
          }
          moveIndexTo(list, fromIndex, targetIndex)
          const idList = list.map(item => item.id)
          bookmarkResortService(idList)
        } else if (type === 'delete') {
          handleRemove()
        } else if (type === 'desktop') {
          handleSetToDesktop()
        }
      },
      handleRemove,
      handleSetToDesktop,
    }
  },
}
</script>
