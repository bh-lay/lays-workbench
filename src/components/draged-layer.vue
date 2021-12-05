<style lang="stylus" scoped>
.draged-layer
  position fixed
  top 0
  left 0
  width 100%
  height 100%
  z-index 1000
.shadow-rect
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
  margin -10px 0 0 -10px
  border-radius 4px
  background #333
  box-shadow 1px 1px 2px rgba(0, 0, 0, 0.2),2px 2px 20px rgba(0, 0, 0, 0.2)
.trash-area
  position absolute
  left 50%
  bottom 5px
  margin-left -20px
  width 40px
  height 40px
  display flex
  align-items center
  justify-content center
  background rgba(0, 0, 0, .2)
  border-radius 20px
  border 1px solid rgba(255, 255, 255, .5)
  transform-origin center bottom
  transition .2s
  color #fff
  &.active
    background red
    transform scale(1.5)
</style>

<template>
<teleport to="body">
  <div v-if="isStableStart" class="draged-layer">
    <div :class="['trash-area', triggeredType === 'delete' ? 'active' : '']">
      <v-mdi name="mdi-trash-can-outline" :size="20" />
    </div>
    <transition name="fade-fast">
      <div
        v-if="triggeredType === 'enter' || triggeredType === 'before'"
        :class="['shadow-rect', triggeredType === 'enter' ? 'block' : 'line']"
        :style="shadowRectStyle"
      ></div>
    </transition>
    <div class="draged-shadow" :style="{
      top: clientY + 'px',
      left: clientX + 'px',
      background: dragedBookmark.undercoat,
    }"></div>
  </div>
</teleport>
</template>

<script>
import { ref, getCurrentInstance } from 'vue'
import { getAppConfigItem } from '@/assets/js/app-config'
import dragHandle from '@/assets/js/drag-handle';
import { Bookmark } from '@database/entity/bookmark';

function getItemMap(internalInstance) {
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
  const mapList = []
  Array.prototype.forEach.call(itemEls, bookmarkItemNode => {
    const bookmarkId = bookmarkItemNode.dataset.id
    if (!bookmarkId) {
      return
    }
    const nodeBCR = bookmarkItemNode.getBoundingClientRect();
    mapList.push({
      id: bookmarkId,
      top: nodeBCR.top,
      left: nodeBCR.left,
      right: nodeBCR.right,
      bottom: nodeBCR.bottom,
    })
  });
  return mapList
}
function getMouseTriggered({ clientY, clientX }, map) {
  const gridGap = getAppConfigItem('gridGap')
  // 是否拖拽合并
  for (let i = 0; i < map.length; i++) {
    let mapItem = map[i];
    if (
      mapItem.left + gridGap / 2 <= clientX &&
      mapItem.right - gridGap / 2 >= clientX &&
      mapItem.top <= clientY &&
      mapItem.bottom - gridGap >= clientY
    ) {
      return {
        type: 'enter',
        target: mapItem,
      };
    }
  }
  // 是否拖拽移动
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
  // 是否拖拽删除
  const winWidth = window.innerWidth
  const winHeight = window.innerHeight
  if (clientX > winWidth / 2 - 50 && clientX < winWidth / 2 + 50 && clientY > winHeight - 100) {
    return {
      type: 'delete'
    }
  }
  // 拖拽取消
  return {
    type: 'cancel'
  }
}
export default {
  emits: ['beforeDrag', 'dragEnd'],
  props: {
    event: {
      type: MouseEvent,
      default() {
        return {}
      },
    },
    dragedBookmark: {
      type: Bookmark
    },
  },
  setup(props, context) {
    const isStableStart = ref(false)
    const clientX = ref(0)
    const clientY = ref(0)
    const gridGap = getAppConfigItem('gridGap')
    const shadowRectStyle = ref({
      top: 0,
      left: 0,
      width: 0,
      height: 0,
    })
    const internalInstance = getCurrentInstance()
    const triggeredType = ref('')
    let itemSizeAndPositionMap = []
    const dragedBookmark = props.dragedBookmark
    dragHandle(props.event, {
      stableDistance: 20,
      stableStart() {
        context.emit('beforeDrag')
        isStableStart.value = true
        itemSizeAndPositionMap = getItemMap(internalInstance)
      },
      move(params) {
        const triggered = getMouseTriggered(
          {
            clientY: params.clientY,
            clientX: params.clientX,
          },
          itemSizeAndPositionMap
        );
        triggeredType.value = triggered.type;
        clientX.value = params.clientX
        clientY.value = params.clientY

        const enterPadding = 3
        const beforeMarging = -4
      
        let triggeredTarget = triggered.target;
        if (triggered.type === 'enter' && triggeredTarget) {
          shadowRectStyle.value = {
            top: triggeredTarget.top - enterPadding + 'px',
            left: triggeredTarget.left - enterPadding + gridGap / 2 + 'px',
            width: triggeredTarget.right - triggeredTarget.left + enterPadding * 2 - gridGap + 'px',
            height: triggeredTarget.bottom - triggeredTarget.top + enterPadding * 2 - gridGap + 'px',
          }
        } else if (triggered.type === 'before') {
          shadowRectStyle.value = {
            top: triggeredTarget.top + beforeMarging + 'px',
            left: triggeredTarget.left + 3 + 'px',
            width: 8 + 'px',
            height: triggeredTarget.bottom - triggeredTarget.top - beforeMarging * 2 - gridGap + 'px',
          }
        }
      },
      end(params) {
        const triggered = getMouseTriggered(
          {
            clientY: params.clientY,
            clientX: params.clientX,
          },
          itemSizeAndPositionMap
        );
        const dragData = {
          type: triggered.type,
          from: dragedBookmark.id,
          to: triggered.target ? triggered.target.id : null
        }
        if (dragData.from === dragData.to) {
          dragData.type = 'cancel'
        }
        context.emit('dragEnd', dragData);
      },
    });
    return {
      clientX,
      clientY,
      isStableStart,
      triggeredType,
      shadowRectStyle,
    }
  },
};
</script>
