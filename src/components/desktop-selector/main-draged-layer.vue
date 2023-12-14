<style lang="stylus" scoped>
.private-draged-layer
  position fixed
  top 0
  left 0
  width 100%
  height 100%
  z-index 10000
.target-shadow
  position relative
  box-sizing border-box
  border 0 solid #3d4c5c
  background rgba(3, 169, 244, .5)
  border-radius 2px
  transition .2s
.draged-shadow
  position absolute
  min-width 120px
  max-width 300px
  height 40px
  margin -20px 0 0 -50px
  padding 0 15px
  border-radius 4px
  background #1679ca
  box-shadow 1px 1px 2px rgba(0, 0, 0, 0.2),2px 2px 20px rgba(0, 0, 0, 0.2)
  overflow hidden
  line-height 40px
  font-size 12px
  color #fff
.trash-area
  position absolute
  left 50%
  top 0
  margin-left -160px
  width 50px
  height 50px
  display flex
  align-items center
  justify-content center
  background #26262c
  border-radius 0 0 8px 8px
  transform-origin center top
  transition .2s
  color #666
  &.active
    background red
    transform scale(1.25)
    color #fff
</style>

<template>
  <teleport to="#v-ui">
    <transition name="fade-fast">
      <div
        v-if="isStableStart"
        class="private-draged-layer"
      >
        <div
          :class="['trash-area', triggeredType === 'delete' ? 'active' : '']"
        >
          <v-mdi
            name="mdi-trash-can-outline"
            size="20"
          />
        </div>
        <transition name="fade-fast">
          <div
            v-if="triggeredType === 'enter' || triggeredType === 'enter-side' || triggeredType === 'before'"
            class="target-shadow"
            :style="shadowRectStyle"
          />
        </transition>
        <div
          class="draged-shadow"
          :style="{
            top: clientY + 'px',
            left: clientX + 'px',
            background: dragedBookmark.undercoat,
          }"
        >
          {{ dragedBookmark.name }}
        </div>
      </div>
    </transition>
  </teleport>
</template>

<script setup lang="ts">
import { ref, inject } from 'vue'
import dragHandle from '@/assets/ts/drag-handle'
import { Bookmark } from '@database/entity/bookmark'
type mapItem = {
  id: string,
  top: number,
  left: number,
  right: number,
  bottom: number,
}
type mousePoint = {
  clientY: number,
  clientX: number
}
function getRectMapFromNodeList(node: HTMLElement[]): mapItem[] {
  const mapList: mapItem[] = []
  Array.prototype.map.call(node, (bookmarkItemNode) => {
    const bookmarkId = bookmarkItemNode.dataset.id
    if (!bookmarkId) {
      return
    }
    const nodeBCR = bookmarkItemNode.getBoundingClientRect()
    mapList.push({
      id: bookmarkId,
      top: nodeBCR.top,
      left: nodeBCR.left,
      right: nodeBCR.right,
      bottom: nodeBCR.bottom,
    })
  })
  return mapList
}
const getDesktopNodeList = inject('getDesktopNodeList', (): HTMLElement[] => {
  return []
}, false)

function getMouseTriggered(
  {
    clientY,
    clientX,
  }: mousePoint,
  currentMap: mapItem[]
): {
  type: string,
  target?: mapItem,
} {
  // 是否拖拽移动
  for (let t = 0; t < currentMap.length; t++) {
    let mapItem = currentMap[t]
    if (
      clientX > mapItem.left &&
      clientX < mapItem.right &&
      mapItem.top + 11 > clientY &&
      mapItem.top - 11 < clientY
    ) {
      return {
        type: 'before',
        target: mapItem,
      }
    }
  }
  // 是否拖拽删除
  const winWidth = window.innerWidth
  if (
    clientX > winWidth / 2 - 170 &&
    clientX < winWidth / 2 - 90 &&
    clientY < 90
  ) {
    return {
      type: 'delete',
    }
  }

  // 拖拽取消
  return {
    type: 'cancel',
  }
}

const props = defineProps({
  event: {
    type: [MouseEvent, TouchEvent],
    default() {
      return {}
    },
  },
  dragedBookmark: {
    type: Bookmark,
    default() {
      return new Bookmark({})
    },
  },
})

const emits = defineEmits(['beforeDrag', 'dragEnd'])

const isStableStart = ref(false)
const clientX = ref(0)
const clientY = ref(0)
const shadowRectStyle = ref({
  top: '',
  left: '',
  width: '',
  height: '',
})
const triggeredType = ref('')
let currentRectList: mapItem[] = []

dragHandle(props.event, {
  start() {
    emits('beforeDrag')
    isStableStart.value = true
    const itemEls = getDesktopNodeList ? getDesktopNodeList() : []
    currentRectList = getRectMapFromNodeList(itemEls)
  },
  move(params) {
    const triggered = getMouseTriggered(
      {
        clientY: params.clientY,
        clientX: params.clientX,
      },
      currentRectList
    )

    triggeredType.value = triggered.type
    clientX.value = params.clientX
    clientY.value = params.clientY

    let triggeredTarget = triggered.target
    if (triggered.type === 'before') {
      if (triggeredTarget) {
        shadowRectStyle.value = {
          top: triggeredTarget.top + 'px',
          left: triggeredTarget.left + 'px',
          width: triggeredTarget.right -
            triggeredTarget.left +
            'px',
          height: '4px',
        }
      }
    }
  },
  end(params) {
    const triggered = getMouseTriggered(
      {
        clientY: params.clientY,
        clientX: params.clientX,
      },
      currentRectList
    )
    const dragData = {
      type: triggered.type,
      from: props.dragedBookmark.id,
      to: triggered.target ? triggered.target.id : null,
    }
    if (dragData.from === dragData.to) {
      dragData.type = 'cancel'
    }
    emits('dragEnd', dragData)
  },
  cancel() {
    emits('dragEnd', {
      type: 'cancel',
    })
  },
})
</script>
