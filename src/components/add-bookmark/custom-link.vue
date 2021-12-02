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
.size-selector
  margin-left 10px
.undercoat-and-size
  display flex
.preview-area
  display flex
  align-items center
  justify-content center
  height 180px
  padding-top 20px
  background #17202b
.footer
  padding-top 20px
  text-align right
</style>

<template>
  <div class="custom-link">
    <div class="input-item">
      <div class="label">名称</div>
      <input type="text" v-model="previewData.name" placeholder="请输入链接名称" maxlength="20" />
    </div>
    <div class="input-item">
      <div class="label">链接地址</div>
      <input type="text" v-model="previewData.value" placeholder="请输入链接地址" />
    </div>
    <div class="input-item">
      <icon-editor v-model="previewData.icon" />
    </div>
    <div class="input-item">
      <div class="undercoat-and-size">
        <dropdown class="undercoat" :style="{
          background: previewData.undercoat
        }">
          <template v-slot:body>
            <color-selector v-model="previewData.undercoat" />
          </template>
        </dropdown>
        <size-selector v-model="previewData.size" />
      </div>
    </div>
    <div class="preview-area">
      <bookmark-item
        :data="previewData"
      />
    </div>
    <div class="footer">
      <wb-button @click="confirm">确定</wb-button>
    </div>
  </div>
</template>

<script>
import { Bookmark } from '../../database/entity/bookmark.ts'
import BookmarkItem from '../bookmark-item.vue'
import ColorSelector from './color-selector.vue'
import SizeSelector from './size-selector.vue'
import IconEditor from './icon-editor.vue'
import { reactive } from 'vue';
export default {
  emits: ['confirm'],
  components: { BookmarkItem, ColorSelector, SizeSelector, IconEditor },
  props: {
    data: {
      type: Object,
      default() {
        return null
      },
    },
  },
  setup(props, context) {
    const previewData = reactive(
      new Bookmark(props.data || {
        undercoat: '#9D2932',
        icon: 'text:好看'
      })
    )
    return {
      previewData,
      confirm() {
        console.log('previewData', previewData)
        if (!previewData.name) {
          alert('图标名字没写')
          return
        }
        if (!previewData.value) {
          alert('链接没有填')
          return
        }
        context.emit('confirm', previewData)
      },
    }
  },
};
</script>
