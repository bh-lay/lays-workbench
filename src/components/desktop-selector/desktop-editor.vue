<style lang="stylus" scoped>
.desktop-editor
  padding 0 20px 30px
</style>

<template>
  <div
    ref="editRootNode"
    class="desktop-editor"
  >
    <desktop-item-editor
      v-for="desktop in desktopList"
      :key="desktop.id"
      v-drag-start="(event: MouseEvent | TouchEvent) => {
        dragStartHandle(event, desktop)
      }"
      :data-id="desktop.id"
      :desktop="desktop"
      class="desktop-item"
      @after-update="handleDesktopChanged"
    />

    <desktop-create-editor @after-create="handleDesktopChanged" />
    <main-draged-layer
      v-if="willStartDrag"
      :event="dragEvent"
      :draged-bookmark="selectedDesktop"
      @before-drag="handleBeforeDrag"
      @drag-end="handleDragEnd"
    />
  </div>
</template>

<script setup lang="ts">
import { PropType, Ref, provide, ref, shallowRef } from 'vue'
import { Bookmark } from '@/database/entity/bookmark'
import MainDragedLayer from './main-draged-layer.vue'
import DesktopCreateEditor from './desktop-create-editor.vue'
import DesktopItemEditor from './desktop-item-editor.vue'
import { bookmarkRemoveService, bookmarkResortService } from '@/database/services/bookmark-service'
import { Message } from '@/ui-lib/message'


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
function handleDragMove(list: Bookmark[], fromIndex: number, targetIndex: number): Promise<unknown>{
  moveIndexTo(list, fromIndex, targetIndex)
  const idList = list.map(item => item.id)
  return bookmarkResortService(idList)
}
function removeBookmark(bookmarkID: string, bookmarkList: Bookmark[]) {
  return bookmarkRemoveService(bookmarkID).then(() => {
    for (let i = 0; i < bookmarkList.length; i++) {
      if (bookmarkList[i].id === bookmarkID) {
        bookmarkList.splice(i, 1)
        break
      }
    }
    // emits('after-remove')
  }).catch(e => {
    new Message({
      message: e.message || '删除失败，请重试',
    })
  })
}

const props = defineProps({
  desktopList: {
    type: Object as PropType<Bookmark[]>,
    default() {
      return []
    },
  },
})
const emits = defineEmits(['after-desktop-changed'])

const editRootNode: Ref<HTMLElement | undefined> = ref()
provide('getDesktopNodeList', () => {
  return editRootNode.value?.getElementsByClassName('desktop-item')
})

let willSelectedBookmark: Bookmark | undefined = undefined
const selectedDesktop: Ref<Bookmark | undefined> = ref(undefined)
const willStartDrag = ref(false)
const isDraging = ref(false)

const dragEvent: Ref<MouseEvent | TouchEvent | undefined> = shallowRef(undefined)
function dragStartHandle(event: MouseEvent | TouchEvent, desktop: Bookmark) {
  willSelectedBookmark = desktop
  dragEvent.value = event
  willStartDrag.value = true
}

function handleBeforeDrag() {
  selectedDesktop.value = willSelectedBookmark
  isDraging.value = true
}
function removeDragLayer() {
  isDraging.value = false
  willStartDrag.value = false
}
async function handleDragEnd({ type, from, to }: {
  type: string,
  from: string,
  to: string,
}) {
  removeDragLayer()
  if (type === 'cancel') {
    return
  }
  const desktopList = props.desktopList
  // 处理拖拽完成
  const [fromIndex, targetIndex] = getFromTargetIndex(desktopList, from, to)
  try {
    if (type === 'before') {
      await handleDragMove(desktopList, fromIndex, targetIndex)
    } else if (type === 'delete') {
      await removeBookmark(from, desktopList)
    }
    handleDesktopChanged()
  } catch (e) {
    console.log('drag error', e)
  }
}

function handleDesktopChanged() {
  emits('after-desktop-changed')
}
</script>
