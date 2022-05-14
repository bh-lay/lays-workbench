<style lang="stylus" scoped>
@import '../../assets/stylus/functions/scrollbar.styl'
.bookmark-container
  width 100px
  flex-grow 1
  padding 30px 50px
  overflow auto
  scrollbar #26262c
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
.draged
  opacity 0
</style>
<template>
  <div
    v-contextmenu:listMenu
    class="bookmark-container"
  >
    <div class="header">
      <v-button @click="handleCreateLink">
        添加链接
      </v-button>
      <v-button @click="handleCreateFolder">
        添加文件夹
      </v-button>
    </div>
    <div
      v-if="bookmarkList.length === 0"
      class="empty"
    >
      万物皆空
    </div>
    <div
      v-else
      class="link-list-body"
    >
      <main-item
        v-for="item in bookmarkList"
        :key="item.id"
        v-contextmenu:itemMenu="{
          beforeVisible() {
            selectedBookmark = item
          }
        }"
        v-drag-start="(event) => {
          dragStartHandle(event, item)
        }"
        :class="{
          draged: isDraging && selectedBookmark.id === item.id,
        }"
        :data="item"
        :active="selectedBookmark.id === item.id"
        @click="selectedBookmark = item"
        @dblclick="handleOpen(item)"
      />
    </div>
  </div>
  <v-contextmenu ref="itemMenu">
    <v-contextmenu-item @click="handleEdit">
      编辑
    </v-contextmenu-item>
    <v-contextmenu-item @click="handleRemove">
      删除
    </v-contextmenu-item>
  </v-contextmenu>
  <v-contextmenu ref="listMenu">
    <v-contextmenu-item @click="handleCreateLink">
      添加新书签
    </v-contextmenu-item>
    <v-contextmenu-item @click="handleCreateFolder">
      添加新文件夹
    </v-contextmenu-item>
  </v-contextmenu>
  <v-modal
    v-model="linkEditorConfig.visible"
    :width="440"
    :title="linkEditorConfig.type === 'edit' ? '修改书签' : '添加书签'"
    :close-on-click-modal="true"
    :close-on-press-escape="true"
  >
    <link-editor
      :type="linkEditorConfig.type"
      :link-name="selectedBookmark.name"
      :link-value="selectedBookmark.value"
      @cancel="linkEditorConfig.visible = false"
      @confirm="handleLinkEditorConfirm"
    />
  </v-modal>
  <v-modal
    v-model="folderEditorConfig.visible"
    :width="440"
    :title="folderEditorConfig.type === 'edit' ? '修改文件夹' : '添加文件夹'"
    :close-on-click-modal="true"
    :close-on-press-escape="true"
  >
    <folder-editor
      :type="folderEditorConfig.type"
      :folder-name="selectedBookmark.name"
      @cancel="folderEditorConfig.visible = false"
      @confirm="handleFolderEditorConfirm"
    />
  </v-modal>
  <main-draged-layer
    v-if="willStartDrag"
    :event="dragEvent"
    :draged-bookmark="selectedBookmark"
    @before-drag="handleBeforeDrag"
    @drag-end="handleDragEnd"
  />
</template>

<script lang="ts">
import { Ref, ref, watch, shallowRef } from 'vue'
import {
  Bookmark,
  BookmarkType,
} from '@database/entity/bookmark'
import {
  bookmarkListService,
  bookmarkInsertService,
  bookmarkUpdateService,
  bookmarkResortService,
  bookmarkRemoveService,
} from '@database/services/bookmark-service'
import { Message } from '@/ui-lib/message/index'
import MainItem from './main-item.vue'
import LinkEditor from './link-editor.vue'
import FolderEditor from './folder-editor.vue'
import MainDragedLayer from './main-draged-layer.vue'

// 加载数据处理方法
function loadListHandler(props: {
  parent: string,
  changedParentId: string
}, bookmarkList: Ref<Bookmark[]>) {
  const loadList = () => {
    bookmarkListService({
      parent: props.parent,
    }).then((list) => {
      list.sort((A, B) => {
        let aValue = (A.type === BookmarkType.folder ? 10000 : 0) + A.sort
        let bValue = (B.type === BookmarkType.folder ? 10000 : 0) + B.sort
        return bValue - aValue
      })
      bookmarkList.value = list
    })
  }
  loadList()
  watch(() => props.parent, loadList)
  watch(
    () => props.changedParentId,
    (changedParentId) => {
      if (changedParentId !== props.parent) {
        return
      }
      loadList()
    }
  )
}
// 找到拖放元素和目标元素的位置
function getFromTargetIndex(list: Bookmark[], from: string, to: string) {
  let fromIndex = -1
  let targetIndex = -1
  for (let i = 0; i < list.length; i++) {
    let id = list[i].id
    if (id === from) {
      fromIndex = i
    }
    if (id === to) {
      targetIndex = i
    }
    if (fromIndex >= 0 && targetIndex >= 0) {
      break
    }
  }
  return [fromIndex, targetIndex]
}

function moveIndexTo(list: Bookmark[], fromIndex: number, toIndex: number) {
  if (fromIndex > toIndex) {
    list.splice(toIndex, 0, list[fromIndex])
    list.splice(fromIndex + 1, 1)
  } else {
    list.splice(toIndex, 0, list[fromIndex])
    list.splice(fromIndex, 1)
  }
}
function handleDragEnter(list: Bookmark[], fromIndex: number, targetIndex: number): Promise<unknown>{
  const fromBookmark = list[fromIndex]
  const targetBookmark = list[targetIndex]
  // 找不到拖拽元素，或目标元素，退出
  if (!targetBookmark || !fromBookmark) {
    return Promise.reject(new Error('找不到源或目标书签！'))
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
    ])
  } else {
    // 目标是链接，先排个序，再合并，最后插入
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
function handleDragEnterSide(list: Bookmark[], fromIndex: number, targetId: string): Promise<unknown>{
  const fromBookmark = list[fromIndex]
  // 找不到拖拽元素，退出
  if (!fromBookmark) {
    return Promise.reject(new Error('找不到书签数据！'))
  }
  // 删除被拖拽的元素
  list.splice(fromIndex, 1)

  // 标记 parent
  fromBookmark.parent = targetId
  return bookmarkUpdateService(fromBookmark)
}
function handleDragMove(list: Bookmark[], fromIndex: number, targetIndex: number): Promise<unknown>{
  moveIndexTo(list, fromIndex, targetIndex)
  const idList = list.map(item => item.id)
  return bookmarkResortService(idList)
}
// 拖拽处理方法
function dragSetup(
  selectedBookmarkRef: Ref<Bookmark | null>,
  bookmarkListRef: Ref<Bookmark[]>,
  onDragSuccess: () => void,
  removeBookmark: (bookmarkID: string, bookmarkList: Bookmark[]) => void
) {
  const willStartDrag = ref(false)
  const isDraging = ref(false)
  const dragEvent: Ref<MouseEvent | TouchEvent | null> = shallowRef(null)
  let willSelectedBookmark: Bookmark | null = null
  function removeDragLayer() {
    isDraging.value = false
    willStartDrag.value = false
  }
  return {
    dragEvent,
    willStartDrag,
    isDraging,
    dragStartHandle(event: MouseEvent | TouchEvent, bookmark: Bookmark) {
      dragEvent.value = event
      willStartDrag.value = true
      willSelectedBookmark = bookmark
    },
    handleBeforeDrag() {
      selectedBookmarkRef.value = willSelectedBookmark
      isDraging.value = true
    },
    async handleDragEnd({ type, from, to }: {
      type: string,
      from: string,
      to: string,
    }) {
      removeDragLayer()
      if (type === 'cancel') {
        return
      }
      console.log(from, to, type)
      const bookmarkList = bookmarkListRef.value
      // 处理拖拽完成
      const [fromIndex, targetIndex] = getFromTargetIndex(bookmarkList, from, to)
      console.log('fromIndex, targetIndex', fromIndex, targetIndex)
      try {
        if (type === 'enter') {
          await handleDragEnter(bookmarkList, fromIndex, targetIndex)
        } else if (type === 'enter-side') {
          await handleDragEnterSide(bookmarkList, fromIndex, to)
        } else if (type === 'before') {
          await handleDragMove(bookmarkList, fromIndex, targetIndex)
        } else if (type === 'delete') {
          await removeBookmark(from, bookmarkList)
        }
        onDragSuccess()
      } catch (e) {
        console.log('drag error', e)
      }
    },
  }
}
export default {
  components: { MainItem, LinkEditor, FolderEditor, MainDragedLayer },
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
  emits: ['open-folder', 'after-insert', 'after-remove', 'after-drag'],
  setup(props, context) {
    const bookmarkList: Ref<Bookmark[]> = ref([])
    const selectedBookmark: Ref<Bookmark> = ref(new Bookmark({}))

    // 处理列表数据加载
    loadListHandler(props, bookmarkList)

    function removeBookmark(bookmarkID: string, bookmarkList: Bookmark[]) {
      bookmarkRemoveService(bookmarkID).then(() => {
        for (let i = 0; i < bookmarkList.length; i++) {
          if (bookmarkList[i].id === bookmarkID) {
            bookmarkList.splice(i, 1)
            break
          }
        }
        context.emit('after-remove')
      }).catch(e => {
        new Message({
          message: e.message || '删除失败，请重试',
        })
      })
    }
    const dragSetupReturns = dragSetup(
      selectedBookmark,
      bookmarkList, () => {
        context.emit('after-drag')
      },
      removeBookmark
    )
    const linkEditorConfig = ref({
      visible: false,
      type: 'create',
    })
    const folderEditorConfig = ref({
      visible: false,
      type: 'create',
    })
    const setupObject = {
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
      handleLinkEditorConfirm({ name, value }: { name: string, value: string }) {
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
          })
          bookmarkInsertService(item).then(() => {
            context.emit('after-insert')
          })
        }
        linkEditorConfig.value.visible = false
      },
      handleFolderEditorConfirm({ name }: {name: string}) {
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
          })
          bookmarkInsertService(item).then(() => {
            context.emit('after-insert')
          })
        }
        folderEditorConfig.value.visible = false
      },
      handleOpen(bookmark: Bookmark) {
        if (bookmark.type === BookmarkType.folder) {
          context.emit('open-folder', bookmark.id)
        } else if (bookmark.type === BookmarkType.link) {
          window.open(bookmark.value as string, '_blank')
        }
      },
      handleRemove() {
        removeBookmark(selectedBookmark.value.id, bookmarkList.value)
      },
    }
    return Object.assign(setupObject, dragSetupReturns)
  },
}
</script>
