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
</style>

<template>
<teleport to="body">
  <div v-if="isStableStart" class="draged-layer">
    <transition name="fade-fast">
      <div v-if="triggeredType" :class="['shadow-rect', triggeredType === 'enter' ? 'block' : 'line']" :style="shadowRectStyle"></div>
    </transition>
    <div class="draged-shadow" :style="{
      top: clientY + 'px',
      left: clientX + 'px',
      background: undercoat,
    }"></div>
  </div>
</teleport>
</template>

<script>
import { computed, ref, onMounted } from 'vue'
import { getAppConfigItem } from '@/assets/js/app-config'
import dragHandle from '@/assets/js/drag-handle';
import {
  Bookmark,
  BookmarkType,
  BookmarkSize,
} from '@database/entity/bookmark';

class BookmarkMapItem {
  constructor(bookmarkItemVm) {
    const nodeBCR = bookmarkItemVm.$el.getBoundingClientRect();
    this.id = bookmarkItemVm.data.id;
    this.type = bookmarkItemVm.data.type;
    this.top = nodeBCR.top;
    this.left = nodeBCR.left;
    this.right = nodeBCR.right;
    this.bottom = nodeBCR.bottom;
  }
}

function getMouseTriggered({ clientY, clientX, bookmarkType }, map) {
  const gridGap = getAppConfigItem('gridGap')
  if (bookmarkType !== BookmarkType.widgets) {
    for (let i = 0; i < map.length; i++) {
      let mapItem = map[i];
      if (
        mapItem.left + gridGap / 2 <= clientX &&
        mapItem.right - gridGap / 2 >= clientX &&
        mapItem.top <= clientY &&
        mapItem.bottom - gridGap >= clientY
      ) {
        // 命中 widgets，则忽略
        if (mapItem.type === BookmarkType.widgets) {
          return
        }
        return {
          type: 'enter',
          target: mapItem,
        };
      }
    }
  }
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
    bookmarkItemVmList: {
      type: Array,
      default() {
        return []
      },
    },
    dragedBookmark: {
      type: Bookmark
    },
  },
  setup(props, context) {
    const enterPadding = 3
    const beforeMarging = -4
    const isStableStart = ref(false)
    const clientX = ref(0)
    const clientY = ref(0)
    const gridGap = getAppConfigItem('gridGap')
    const undercoat = ref('#000')
    const shadowRectStyle = ref({
      top: 0,
      left: 0,
      width: 0,
      height: 0,
    })
    const triggeredType = ref('')
    const itemSizeAndPositionMap = []
    const dragedBookmark = props.dragedBookmark
    dragHandle(props.event, {
      stableDistance: 20,
      stableStart() {
        context.emit('beforeDrag')
        isStableStart.value = true
        undercoat.value = dragedBookmark.undercoat
        props.bookmarkItemVmList.forEach(bookmarkItemVm => {
          if (!bookmarkItemVm) {
            return
          }
          itemSizeAndPositionMap.push(new BookmarkMapItem(bookmarkItemVm))
        });
        console.log('props.bookmarkItemVmList', props.bookmarkItemVmList)
        console.log('itemSizeAndPositionMap', itemSizeAndPositionMap)
      },
      move(params) {
        const triggered = getMouseTriggered(
          {
            bookmarkType: dragedBookmark.type,
            clientY: params.clientY,
            clientX: params.clientX,
          },
          itemSizeAndPositionMap
        );
        clientX.value = params.clientX
        clientY.value = params.clientY
        if (triggered) {
          let triggeredTarget = triggered.target;
          triggeredType.value = triggered.type;
          if (triggeredType.value === 'enter') {
            shadowRectStyle.value = {
              top: triggeredTarget.top - enterPadding + 'px',
              left: triggeredTarget.left - enterPadding + gridGap / 2 + 'px',
              width: triggeredTarget.right - triggeredTarget.left + enterPadding * 2 - gridGap + 'px',
              height: triggeredTarget.bottom - triggeredTarget.top + enterPadding * 2 - gridGap + 'px',
            }
          } else {
            shadowRectStyle.value = {
              top: triggeredTarget.top + beforeMarging + 'px',
              left: triggeredTarget.left + 3 + 'px',
              width: 8 + 'px',
              height: triggeredTarget.bottom - triggeredTarget.top - beforeMarging * 2 - gridGap + 'px',
            }
          }
        } else {
          triggeredType.value = null;
        }
      },
      end(params) {
        const dragData = {
          type: 'cancel',
          from: dragedBookmark.id,
          to: null
        }
        const triggered = getMouseTriggered(
          {
            clientY: params.clientY,
            clientX: params.clientX,
            bookmarkType: dragedBookmark.type,
          },
          itemSizeAndPositionMap
        );
        if (triggered && dragedBookmark.id !== triggered.target.id) {
          dragData.type = triggered.type
          dragData.to = triggered.target.id
        }
        context.emit('dragEnd', dragData);
      },
    });
    return {
      undercoat,
      clientX,
      clientY,
      isStableStart,
      triggeredType,
      shadowRectStyle,
    }
  },
};
</script>
