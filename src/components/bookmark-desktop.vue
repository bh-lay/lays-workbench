<style lang="stylus" scoped>
.bookmark-map
  display grid
  grid-template-columns repeat(auto-fill, var(--grid-size))
  grid-template-rows repeat(auto-fill, var(--grid-size))
  grid-auto-flow dense
  justify-content center
  padding 40px 0
  .bookmark-item
    transition opacity, transform .2s
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
      :data="bookmarkItem"
      :class="{
        draged: isStartDrag && selectedBookmarkItem.id === bookmarkItem.id,
        selected: isContextmenuVisible && selectedBookmarkItem.id === bookmarkItem.id
      }"
      :data-id="bookmarkItem.id"
      @next="openItem"
    />
    <bookmark-item :data="addData">
      <template #body>
        <add-bookmark @success="refreshList" />
      </template>
    </bookmark-item>
  </div>
  <v-contextmenu
    ref="menu"
    @before-visible="isContextmenuVisible = true"
    @after-close="isContextmenuVisible = false"
  >
    <v-contextmenu-item
      v-if="selectedBookmarkItem.type === BookmarkType.link"
      @click="openEditModal"
    >
      编辑
    </v-contextmenu-item>
    <v-contextmenu-item @click="handleRemove">
      删除
    </v-contextmenu-item>
  </v-contextmenu>
  <v-modal
    v-model="editModalVisible"
    :width="800"
  >
    <div style="padding: 20px">
      <custom-link
        :data="selectedBookmarkItem"
        @confirm="handleConfirmEdit"
      />
    </div>
  </v-modal>
  <draged-layer
    v-if="willStartDrag"
    :event="dragEvent"
    :draged-bookmark="selectedBookmarkItem"
    :disabled-desktop="true"
    @before-drag="handleBeforeDrag"
    @drag-end="handleDragEnd"
  />
  <FocalPlane
    v-model="folderLayerVisible"
    :width="780"
    :close-on-press-escape="true"
    :action-block-classes="['folder-name-editor', 'bookmark-item']"
    @after-close="afterFolderClose"
  >
    <folder-layer
      :id="selectedBookmarkItem.id"
      :name="selectedBookmarkItem.name"
      @name-change="handleFolderNameChange"
      @after-drop-to-desktop="handleDropToDesktop"
    />
  </FocalPlane>
</template>

<script lang="ts">
import {
  ref,
  Ref,
  shallowRef,
  inject,
  watch,
} from 'vue'
import {
  Bookmark,
  BookmarkType,
  BookmarkSize,
} from '@database/entity/bookmark'
import {
  bookmarkInsertService,
  bookmarkRemoveService,
  bookmarkUpdateService,
  bookmarkResortService,
  bookmarkListService,
} from '@database/services/bookmark-service'
import { openBookmark } from '@/assets/ts/bookmark-utils'
import { Message } from '@/ui-lib/message/index'
import { FocalPlane } from  '@/ui-lib/index'
import BookmarkItem from './bookmark-item.vue'
import AddBookmark from './add-bookmark/index.vue'
import CustomLink from './add-bookmark/custom-link.vue'
import DragedLayer from './draged-layer.vue'
import FolderLayer from './folder-layer/index.vue'

function moveIndexTo(list: Bookmark[], fromIndex: number, toIndex: number) {
  if (fromIndex > toIndex) {
    list.splice(toIndex, 0, list[fromIndex])
    list.splice(fromIndex + 1, 1)
  } else {
    list.splice(toIndex, 0, list[fromIndex])
    list.splice(fromIndex, 1)
  }
}
function mouseIntractive({
  setSelectedBookmarkItem,
  onDragEnd,
}: {
    setSelectedBookmarkItem: (a: Bookmark) => void,
    onDragEnd: (from: string, to: string, method: string, size: BookmarkSize) => void
  }
) {
  const editModalVisible = ref(false)
  const folderLayerVisible = ref(false)
  const willStartDrag = ref(false)
  const isStartDrag = ref(false)
  const isContextmenuVisible = ref(false)

  function openEditModal() {
    editModalVisible.value = true
  }
  function closeEditModal() {
    editModalVisible.value = false
  }
  function closeFolderLayer() {
    folderLayerVisible.value = false
  }

  let needForbiddenClick = false
  const dragEvent: Ref<MouseEvent | TouchEvent | null> = shallowRef(null)
  return {
    folderLayerVisible,
    willStartDrag,
    isStartDrag,
    isContextmenuVisible,
    dragEvent,
    editModalVisible,
    openEditModal,
    closeEditModal,
    closeFolderLayer,
    openItem(data: Bookmark) {
      if (needForbiddenClick) {
        return
      }
      willStartDrag.value = false
      openBookmark(data, {
        handleFolder() {
          folderLayerVisible.value = true
        },
      })
    },
    dragStartHandle(event: MouseEvent | TouchEvent, bookmarkItem: Bookmark) {
      setSelectedBookmarkItem(bookmarkItem)
      dragEvent.value = event
      willStartDrag.value = true
    },
    handleBeforeDrag() {
      needForbiddenClick = true
      isStartDrag.value = true
    },
    handleDragEnd({ type, from, to, size}: {
      type: string,
      from: string,
      to: string,
      size: BookmarkSize
    }) {
      willStartDrag.value = false
      isStartDrag.value = false
      needForbiddenClick = false
      if (type === 'cancel') {
        return
      }
      onDragEnd(from, to, type, size)
    },
  }
}
export default {
  components: { FocalPlane, BookmarkItem, AddBookmark, CustomLink, DragedLayer, FolderLayer },
  setup() {
    let bookmarkList: Ref<Bookmark[]> = ref([])
    const activeDesktopId = inject<Ref<string>>('activeDesktopId')

    const selectedBookmarkItem: Ref<Bookmark> = ref(new Bookmark({}))
    const getList = function () {
      const usedDesktopId = activeDesktopId?.value || ''
      if (!usedDesktopId) {
        bookmarkList.value = []
        return
      }
      bookmarkListService({
        parent: usedDesktopId,
      }).then((list) => {
        bookmarkList.value = list
      })
    }
    watch(
      () => activeDesktopId?.value,
      () => {
        getList()
      },
      {
        immediate: true,
      }
    )
    function triggerFolderIconChange(bookmarkItem: Bookmark) {
      // 用 value 触发重绘
      bookmarkItem.value = bookmarkItem.value === '1' ? '2' : '1'
    }
    function handleDragEnter(list: Bookmark[], fromIndex: number, targetIndex: number){
      const fromBookmark = list[fromIndex]
      const targetBookmark = list[targetIndex]
      // 找不到拖拽元素，或目标元素，退出
      if (!targetBookmark || !fromBookmark) {
        return
      }
      // 拖拽元素是组，退出
      if (fromBookmark.type === BookmarkType.folder) {
        // FIXME:组合并
        new Message({
          message: '暂不支持组合并，后续会支持的呦～',
        })
        return
      }
      if (targetBookmark.type === BookmarkType.folder) {
        // 目标是目录，直接移入
        // 删除被拖拽的元素
        list.splice(fromIndex, 1)

        // 标记 parent
        fromBookmark.parent = targetBookmark.id
        return Promise.all([
          bookmarkUpdateService(fromBookmark),
          bookmarkUpdateService(targetBookmark),
        ]).then(() => {
          triggerFolderIconChange(targetBookmark)
        })
      } else {
        // 目标是链接或组件，先排个序，再合并，最后插入
        const idList = list.map(item => item.id)
        return bookmarkResortService(idList)
          .then(idSortMap => {
            const targetSortValue = idSortMap.get(targetBookmark.id)
            const item = new Bookmark({
              name: '自定义组',
              // 和目标排序值相同
              sort: targetSortValue,
              // 和目标同 parent
              parent: targetBookmark.parent,
              type: BookmarkType.folder,
              size: BookmarkSize.medium,
              undercoat: '#2196f3',
            })
            return bookmarkInsertService(item)
          })
          .then((folderBookmark: Bookmark) => {
            // 拖拽与目标元素的父级都标记为新的组
            fromBookmark.parent = folderBookmark.id
            targetBookmark.parent = folderBookmark.id

            return Promise.all([
              bookmarkUpdateService(fromBookmark),
              bookmarkUpdateService(targetBookmark),
            ])
              .then(() => {
              // 用新的组替换掉 target 元素
                list.splice(targetIndex, 1, folderBookmark)
                // 删除被拖拽的元素
                list.splice(fromIndex, 1)
              })
          })
      }

    }
    function handleDragMove(list: Bookmark[], fromIndex: number, targetIndex: number){
      moveIndexTo(list, fromIndex, targetIndex)
      const idList = list.map(item => item.id)
      bookmarkResortService(idList)
    }

    function handleRemove() {
      bookmarkRemoveService(selectedBookmarkItem.value.id).then(() => {
        for (let i = 0; i < bookmarkList.value.length; i++) {
          if (bookmarkList.value[i].id === selectedBookmarkItem.value.id) {
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
    function handleSetSize(bookmarkItem: Bookmark, size: BookmarkSize) {
      bookmarkItem.size = size
      bookmarkUpdateService(bookmarkItem)
        .catch(e => {
          new Message({
            message: e.message || '设置尺寸失败',
          })
        })
    }
    const mouseHandle = mouseIntractive({
      setSelectedBookmarkItem(item: Bookmark) {
        selectedBookmarkItem.value = item
      },
      // 处理拖拽完成
      onDragEnd(from: string, to: string, method: string, size: BookmarkSize) {
        // 找到拖放元素和目标元素的位置
        let fromIndex = -1
        let targetIndex = -1
        const list: Bookmark[] = bookmarkList.value
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
        if (method === 'enter') {
          handleDragEnter(list, fromIndex, targetIndex)
        } else if (method === 'before') {
          handleDragMove(list, fromIndex, targetIndex)
        } else if (method === 'delete') {
          handleRemove()
        } else if (method === 'size') {
          handleSetSize(list[fromIndex], size)
        }
      },
    })
    return {
      activeDesktopId,
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
      handleConfirmEdit(newBookmark: Bookmark) {
        bookmarkUpdateService(newBookmark).then(() => {
          mouseHandle.closeEditModal()
          for (let i = 0; i < bookmarkList.value.length; i++) {
            if (bookmarkList.value[i].id === newBookmark.id) {
              // 更新书签数据
              bookmarkList.value[i].fill(newBookmark)
              break
            }
          }
        })
      },
      refreshList() {
        getList()
      },
      handleDropToDesktop() {
        getList()
      },
      triggerFolderIconChange,
      handleFolderNameChange(newName: string) {
        selectedBookmarkItem.value.name = newName
        bookmarkUpdateService(selectedBookmarkItem.value)
      },
      afterFolderClose() {
        const opendFolderId: string = selectedBookmarkItem.value.id
        for (let i = 0; i < bookmarkList.value.length; i++) {
          if (bookmarkList.value[i].id === opendFolderId) {
            triggerFolderIconChange(bookmarkList.value[i])
            break
          }
        }
      },
      ...mouseHandle,
    }
  },
}
</script>
