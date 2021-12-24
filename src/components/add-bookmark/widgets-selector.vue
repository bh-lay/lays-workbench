<style lang="stylus" scoped>
.widgets-selector
  padding 20px 0
.input-item
  margin-bottom 20px
  .label
    height 14px
    margin-bottom 6px
    line-height 14px
    font-size 12px
    color #6f6f85
.widgets-name-list
  display flex
  width 100%
  border-radius 4px
  background #1a1d23
  overflow hidden
.widgets-name-item
  flex-grow 1
  height 34px
  line-height 34px
  text-align center
  font-size 12px
  color #c1c5cd
  cursor pointer
  transition .2s
  &:hover
    background #292e38
  &.active
    background: #157dac
.preview-area
  display flex
  align-items center
  justify-content center
  height 180px
  padding-top 20px
  background #1a1d23
.footer
  padding-top 20px
  text-align right
</style>

<template>
  <div class="widgets-selector">
    <div class="input-item">
      <div class="label">选择工具</div>
      <div class="widgets-name-list" >
        <div class="widgets-name-item"
          v-for="widgetItem in supportWidgetsList"
          :key="widgetItem.name"
          :class="[previewData.value === widgetItem.name ? 'active' : '']"
          @click="previewData.value = widgetItem.name; previewData.name = widgetItem.label"
        >{{widgetItem.label}}</div>
      </div>
    </div>
    <div class="input-item">
      <div class="label">选择尺寸</div>
      <size-selector v-model="previewData.size" />
    </div>

    <div class="preview-area">
      <bookmark-item
        :data="previewData"
      />
    </div>
    <div class="footer">
      <v-button @click="confirm">确定</v-button>
    </div>
  </div>
</template>

<script lang="ts">
import { ref, reactive, watch } from 'vue';
import { Bookmark, BookmarkType, BookmarkSize } from '@database/entity/bookmark'
import BookmarkItem from '../bookmark-item.vue'
import SizeSelector from './size-selector.vue'
const supportWidgetsList = [
  {
    label: '正则可视化',
    name: 'reg-visual',
  },
  {
    label: 'JSON格式化',
    name: 'json-formatter', 
  },
  {
    label: '图片base64',
    name: 'img-to-base'
  },
  {
    label: '藏经阁',
    name: 'public-bookmarks'
  },
  {
    label: '小书房',
    name: 'private-bookmarks'
  },
]
export default {
  emits: ['confirm'],
  components: { BookmarkItem, SizeSelector },
  props: {
    data: {
      type: Object,
      default() {
        return null
      },
    },
  },
  setup(props, context) {
    const defaultWidgets = supportWidgetsList[0]
    const previewData = reactive(
      new Bookmark(props.data || {
        type: BookmarkType.widgets,
        size: BookmarkSize.large,
        value: defaultWidgets.name,
        name: defaultWidgets.label,
      })
    )
    return {
      supportWidgetsList,
      previewData,
      confirm() {
        context.emit('confirm', previewData)
      },
    }
  },
};
</script>
