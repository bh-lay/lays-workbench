<style lang="stylus" scoped>
.draged-layer
  position fixed
  top 0
  left 0
  width 100%
  height 100%
  z-index 2000
.target-shadow
  position relative
  box-sizing border-box
  border 0 solid #3d4c5c
  background rgba(3, 169, 244, .5)
  border-radius 14px
  transition .2s
  &.line
    border 2px solid transparent
  &.block
    border 6px solid #3d4c5c
.draged-shadow
  position absolute
  width 40px
  height 40px
  transform translate(-50%, -50%)
  border-radius 4px
  background #2196f3
  box-shadow 1px 1px 2px rgba(0, 0, 0, 0.2),2px 2px 20px rgba(0, 0, 0, 0.2)
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
.size-area
  position absolute
  top 0
  left 50%
  margin-left -80px
  width 160px
  height 50px
  display flex
  align-items center
  justify-content center
  background #26262c
  border-radius 0 0 8px 8px
  &.disabled
    opacity .5
  .size
    border 1px dashed #666
    border-radius 4px
    transition .2s
    &.active
      background #3f3f46
      transform scale(1.25)
  .size-large
    width 60px
    height 30px
  .size-medium
    width 30px
    height 30px
  .size-small
    width 15px
    height 15px
    margin 0 15px
.back-to-desktop
  position absolute
  top 0
  left 50%
  width 140px
  height 50px
  margin-left 110px
  background #26262c
  border-radius 0 0 8px 8px
  line-height 50px
  text-align center
  font-size 14px
  color #888
  transform-origin center top
  transition .2s
  &:before
    content '放回桌面'
  &.active
    transform scale(1.25)
    background #4d636f
    color #bac8cf
.touch-mode
  .draged-shadow
    width 80px
    height 80px
    border-radius 20px
    opacity .5
</style>

<template>
  <teleport to="#v-ui">
    <transition name="fade-fast">
      <div
        v-if="isStableStart"
        :class="['draged-layer', supportTouch ? 'touch-mode' : '']"
      >
        <div
          :class="{
            'size-area': true,
            disabled: disabledSize
          }"
        >
          <div
            v-for="size in sizeList"
            :key="size.value"
            :class="[
              'size',
              'size-' + size.class,
              triggeredType === 'size' && activeSize === size.value ? 'active' : ''
            ]"
          />
        </div>
        <div
          :class="['trash-area', triggeredType === 'delete' ? 'active' : '']"
        >
          <v-mdi
            name="mdi-trash-can-outline"
            size="20"
          />
        </div>
        <div
          v-if="!disabledDesktop"
          :class="['back-to-desktop', triggeredType === 'desktop' ? 'active' : '']"
        />
        <transition name="fade-fast">
          <div
            v-if="triggeredType === 'enter' || triggeredType === 'before'"
            :class="[
              'target-shadow',
              triggeredType === 'enter' ? 'block' : 'line',
            ]"
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
        />
        <!-- <div
          v-for="item in gridTestData"
          :key="item.id"
          :style="{
            position: 'absolute',
            top: item.top + 'px',
            left: item.left + 'px',
            width: (item.right - item.left) + 'px',
            height: item.bottom - item.top + 'px',
            border: '1px solid red',
          }"
        /> -->
      </div>
    </transition>
  </teleport>
</template>

<script lang="ts">
import { ref, getCurrentInstance, Ref, ComponentInternalInstance } from 'vue'
import { getAppConfigItem } from '@/assets/ts/app-config'
import { getGridSize } from '@/assets/ts/css-variables'
import dragHandle, { supportTouch } from '@/assets/ts/drag-handle'
import { Bookmark, BookmarkSize } from '@database/entity/bookmark'
type mapItem = {
  id: string,
  top: number,
  left: number,
  right: number,
  bottom: number,
}
function getItemListMap(internalInstance: ComponentInternalInstance | null): mapItem[] {
  if (!internalInstance) {
    return []
  }
  const thisVm = internalInstance.proxy
  const parentVm = thisVm ? thisVm.$parent : null
  if (!parentVm) {
    return []
  }
  const parentEl = parentVm.$el
  if (!parentEl) {
    return []
  }
  const itemEls = parentEl.parentNode.querySelectorAll('.bookmark-item')
  const mapList: mapItem[] = []
  Array.prototype.forEach.call(itemEls, (bookmarkItemNode) => {
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
function getMouseTriggered(
  {
    clientY,
    clientX,
  }:
  {
    clientY: number,
    clientX: number
  },
  map: mapItem[]
): {
  type: string,
  target?: mapItem,
  size?: BookmarkSize,
} { 
  const gridGap = getGridSize() * 0.4
  // 是否拖拽合并
  for (let i = 0; i < map.length; i++) {
    let mapItem = map[i]
    if (
      mapItem.left + gridGap / 2 <= clientX &&
      mapItem.right - gridGap / 2 >= clientX &&
      mapItem.top <= clientY &&
      mapItem.bottom - gridGap >= clientY
    ) {
      return {
        type: 'enter',
        target: mapItem,
      }
    }
  }
  // 是否拖拽移动
  for (let t = 0; t < map.length; t++) {
    let mapItem = map[t]
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
  // 是否是调整大小
  if (
    clientX > winWidth / 2 - 75 &&
    clientX < winWidth / 2 + 75 &&
    clientY < 90
  ) {
    let size = BookmarkSize.small
    if (clientX < winWidth / 2 - 25) {
      size = BookmarkSize.medium
    } else if (clientX > winWidth / 2 + 10) {
      size = BookmarkSize.large
    }
    return {
      type: 'size',
      size,
    }
  }
  // 是否拖拽回桌面
  if (
    clientX > winWidth / 2 + 80 &&
    clientX < winWidth / 2 + 260 &&
    clientY < 90
  ) {
    return {
      type: 'desktop',
    }
  }
  // 拖拽取消
  return {
    type: 'cancel',
  }
}
export default {
  props: {
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
    disabledEnter: {
      type: Boolean,
      default: false,
    },
    disabledSize: {
      type: Boolean,
      default: false,
    },
    disabledDesktop: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['beforeDrag', 'dragEnd'],
  setup(props: {
    event: MouseEvent | TouchEvent,
    dragedBookmark: Bookmark,
    disabledEnter: boolean,
    disabledSize: boolean,
    disabledDesktop: boolean,
  }, context) {
    const isStableStart = ref(false)
    const clientX = ref(0)
    const clientY = ref(0)
    // const gridTestData: Ref<mapItem[]> = ref([])
    const gridGap = getGridSize() * 0.4
    const shadowRectStyle = ref({
      top: '',
      left: '',
      width: '',
      height: '',
    })
    const internalInstance = getCurrentInstance()
    const triggeredType = ref('')
    const activeSize: Ref<BookmarkSize | undefined> = ref(undefined)
    let itemSizeAndPositionMap: mapItem[] = []

    dragHandle(props.event, {
      start() {
        context.emit('beforeDrag')
        isStableStart.value = true
        itemSizeAndPositionMap = getItemListMap(internalInstance)
        // gridTestData.value = itemSizeAndPositionMap
      },
      move(params) {
        const triggered = getMouseTriggered(
          {
            clientY: params.clientY,
            clientX: params.clientX,
          },
          itemSizeAndPositionMap
        )
        // 增加 enter 禁用检测
        if (props.disabledEnter && triggered.type === 'enter') {
          triggered.type = 'cancel'
        }
        // 增加 size 禁用检测
        if (props.disabledSize && triggered.type === 'size') {
          triggered.type = 'cancel'
        }
        // 增加放回桌面禁用检测
        if (props.disabledDesktop && triggered.type === 'desktop') {
          triggered.type = 'cancel'
        }

        triggeredType.value = triggered.type
        clientX.value = params.clientX
        clientY.value = params.clientY

        const enterPadding = 3
        const beforeMarging = -4

        let triggeredTarget = triggered.target
        if (triggered.type === 'enter' && triggeredTarget) {
          shadowRectStyle.value = {
            top: triggeredTarget.top - enterPadding + 'px',
            left: triggeredTarget.left - enterPadding + gridGap / 2 + 'px',
            width:
              triggeredTarget.right -
              triggeredTarget.left +
              enterPadding * 2 -
              gridGap +
              'px',
            height:
              triggeredTarget.bottom -
              triggeredTarget.top +
              enterPadding * 2 -
              gridGap +
              'px',
          }
        } else if (triggered.type === 'before') {
          if (triggeredTarget) {
            shadowRectStyle.value = {
              top: triggeredTarget.top + beforeMarging + 'px',
              left: triggeredTarget.left + 3 + 'px',
              width: 8 + 'px',
              height:
                triggeredTarget.bottom -
                triggeredTarget.top -
                beforeMarging * 2 -
                gridGap +
                'px',
            }
          }
        } else if (triggered.type === 'size') {
          activeSize.value = triggered.size
        }
      },
      end(params) {
        const triggered = getMouseTriggered(
          {
            clientY: params.clientY,
            clientX: params.clientX,
          },
          itemSizeAndPositionMap
        )
        // 增加 enter 禁用检测
        if (props.disabledEnter && triggered.type === 'enter') {
          triggered.type = 'cancel'
        }
        // 增加 size 禁用检测
        if (props.disabledSize && triggered.type === 'size') {
          triggered.type = 'cancel'
        }
        // 增加放回桌面禁用检测
        if (props.disabledDesktop && triggered.type === 'desktop') {
          triggered.type = 'cancel'
        }
        const dragData = {
          type: triggered.type,
          from: props.dragedBookmark.id,
          to: triggered.target ? triggered.target.id : null,
          size: triggered.size,
        }
        if (dragData.from === dragData.to) {
          dragData.type = 'cancel'
        }
        context.emit('dragEnd', dragData)
      },
      cancel() {
        context.emit('dragEnd', {
          type: 'cancel',
        })
      },
    })
    return {
      // gridTestData,
      supportTouch,
      clientX,
      clientY,
      isStableStart,
      triggeredType,
      shadowRectStyle,
      activeSize,
      sizeList: [
        {
          value: BookmarkSize.medium,
          class: 'medium',
        },
        {
          value: BookmarkSize.small,
          class: 'small',
        },
        {
          value: BookmarkSize.large,
          class: 'large',
        },
      ],
    }
  },
}
</script>
