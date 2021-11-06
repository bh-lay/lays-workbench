<style lang="stylus" scoped>
.btn-list
  display: grid;
  grid-template-columns repeat(auto-fill, var(--grid-size))
  grid-auto-flow: dense;
  justify-content center
  padding-top 20px
.item
  position relative
  grid-area span 1 / span 1 / auto / auto
  padding-bottom 20px
  cursor pointer
  .icon
    width calc(var(--grid-size) - var(--grid-gap))
    height calc(var(--grid-size) - var(--grid-gap))
    margin 0 auto
    border-radius var(--icon-radius)
    background #333
    line-height 50px
    text-align center
    transition 0.15s
    svg
      vertical-align text-bottom
      fill #fff
    img
      width 100%
  .title
    width 80px
    height 18px
    margin auto
    line-height 18px
    text-align center
    font-size 12px
    color #fff
    text-shadow 1px 1px 1px rgba(0, 0, 0, .4), 1px 1px 4px rgba(0, 0, 0, .4)
  .popover
    position absolute
    bottom 110%
    left 50%
    width auto
    z-index 20
    opacity 0
    transform translateX(-50%) scale(.9)
    visibility hidden
    transition .15s
  &:hover
    .icon
      box-shadow 2px 2px 8px rgba(0, 0, 0, 0.1), 0 0 2px rgba(0, 0, 0, 0.3)
    .popover
      visibility visible
      transform translateX(-50%) scale(1)
      opacity 1
      transition .15s .3s ease-out
.item-size-medium
  grid-area span 2 / span 2 / auto / auto
  .icon
    width calc(var(--grid-size) * 2 - var(--grid-gap))
    height calc(var(--grid-size) * 2 - var(--grid-gap))
.item-size-large
  grid-area span 2 / span 4 / auto / auto
  .icon
    width calc(var(--grid-size) * 4 - var(--grid-gap))
    height calc(var(--grid-size) * 2 - var(--grid-gap))

@media screen and (max-width:600px)
  .btn-list
    flex-wrap wrap
  .shortcut-item
    display none
</style>

<template>
  <div class="btn-list">
    <div :class="['item', 'item-size-' + BookmarkSize[bookmarkItem.size]]" v-for="bookmarkItem in bookmarkList" :key="bookmarkItem.id">
      <div class="icon" :style="{
        background: bookmarkItem.undercoat
      }">
        <template v-if="bookmarkItem.type === BookmarkType.link">
          <v-mdi name="mdi-book" />
        </template>
        <template v-if="bookmarkItem.type === BookmarkType.widgets">
          <reg-visual v-if="bookmarkItem.value === 'reg-visual'" />
          <json-formatter v-else-if="bookmarkItem.value === 'json-formatter'" />
          <span v-else>unknown {{ bookmarkItem.value }} widgets type</span>
        </template>
      </div>
      <div class="title">{{ bookmarkItem.name }}</div>
    </div>
    <div class="item shortcut-item">
      <div class="popover">
        <bookmark-shortcut />
      </div>
      <div class="icon" style="background: #4caf50">
        <v-mdi name="mdi-book" />
      </div>
      <div class="title">书签</div>
    </div>
  </div>
</template>

<script>
import BookmarkShortcut from './bookmark-shortcut.vue'
import { listBookmarkService } from '../database/services/bookmark-service.ts'
import { BookmarkType, BookmarkSize } from '../database/entity/bookmark.ts'
import RegVisual from './widgets/reg-visual.vue'
import JsonFormatter from './widgets/json-formatter/index.vue'

export default {
  components: { RegVisual, JsonFormatter, BookmarkShortcut },
  data() {
    return {
      bookmarkList: []
    }
  },
  setup() {
    return {
      BookmarkType,
      BookmarkSize,
    };
  },
  mounted() {
    this.getList()
  },
  methods: {
    getList() {
      listBookmarkService().then(list => {
        console.log('list', list)
        this.bookmarkList = list
      })
    },
  },
};
</script>
