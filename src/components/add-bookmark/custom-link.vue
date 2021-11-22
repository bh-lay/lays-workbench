<style lang="stylus" scoped>
.custom-link
  padding 20px 0
.input-item
  margin-bottom 20px
  .label
    height 14px
    margin-bottom 6px
    line-height 14px
    font-size 14px
  input
    box-sizing border-box
    width 100%
    height 40px
    padding 0 10px
    border 1px solid #eee
    font-size 14px
.undercoat
  display inline-block
  width 70px
  height 32px
  border 4px solid #17202b
  border-radius 4px
  text-align center
  &:before
    content: '底色'
    display block
    width 30px
    height 100%
    writing-mode vertical-lr
    background #17202b
    line-height 24px
    font-size 12px
    color #fff

.undercoat-and-size
  display flex
.preview-area
  display flex
  align-items center
  justify-content center
  height 180px
  padding-top 20px
  background #17202b
</style>

<template>
  <div class="custom-link">
    <div class="input-item">
      <div class="label">名称</div>
      <input type="text" v-model="previewData.name" placeholder="请输入链接名称" />
    </div>
    <div class="input-item">
      <div class="label">链接地址</div>
      <input type="text" v-model="previewData.value" placeholder="请输入链接地址" />
    </div>
    <div class="input-item">
      <div class="label">图标</div>
      <div class="color-selector">
        <input type="text" v-model="previewData.icon" placeholder="请输入链接地址" />
        文字图标<br/>
        mdi图标<br/>
        自动抓取图标
      </div>
    </div>
    <div class="input-item">
      <div class="undercoat-and-size">
        <dropdown class="undercoat" :style="{
          background: previewData.undercoat
        }">
          <template v-slot:body>
            <color-selector v-model:active="previewData.undercoat" />
          </template>
        </dropdown>
        <size-selector v-model:active="previewData.size" />
      </div>
    </div>
    <div class="preview-area">
      <bookmark-item
        :data="previewData"
      />
    </div>
  </div>
</template>

<script>
import { Bookmark, BookmarkType, BookmarkSize } from '../../database/entity/bookmark.ts'
import BookmarkItem from '../bookmark-item.vue'
import ColorSelector from './color-selector.vue'
import SizeSelector from './size-selector.vue'
import { reactive } from 'vue';
export default {
  components: { BookmarkItem, ColorSelector, SizeSelector },
  setup() {
    const previewData = reactive(new Bookmark({
      undercoat: '#9D2932'
    }))
    return {
      previewData,
    }
  },
};
</script>
