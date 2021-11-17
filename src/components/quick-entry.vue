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
  .card
    width calc(var(--grid-size) - var(--grid-gap))
    height calc(var(--grid-size) - var(--grid-gap))
    margin 0 auto
    border-radius var(--icon-radius)
    background #333
    overflow hidden
    transition 0.15s
  .title
    height 16px
    padding-top 4px
    line-height 16px
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
    .card
      box-shadow 2px 2px 8px rgba(0, 0, 0, 0.1), 0 0 2px rgba(0, 0, 0, 0.3)
    .popover
      visibility visible
      transform translateX(-50%) scale(1)
      opacity 1
      transition .15s .3s ease-out
.item-size-medium
  grid-area span 2 / span 2 / auto / auto
  .card
    width calc(var(--grid-size) * 2 - var(--grid-gap))
    height calc(var(--grid-size) * 2 - var(--grid-gap))
.item-size-large
  grid-area span 2 / span 4 / auto / auto
  .card
    width calc(var(--grid-size) * 4 - var(--grid-gap))
    height calc(var(--grid-size) * 2 - var(--grid-gap))
.item-size-three_one
  grid-area span 1 / span 3 / auto / auto
  .card
    width calc(var(--grid-size) * 3 - var(--grid-gap))

@media screen and (max-width:600px)
  .btn-list
    flex-wrap wrap
  .shortcut-item
    display none
</style>

<template>
  <div class="btn-list">
    <div :class="['item', 'item-size-' + BookmarkSize[bookmarkItem.size]]" v-for="bookmarkItem in bookmarkList" :key="bookmarkItem.id">
      <div class="card" :style="{
        background: bookmarkItem.undercoat
      }">
        <template v-if="bookmarkItem.type === BookmarkType.link">
          <bookmark-icon
            :icon="bookmarkItem.icon"
            :url="bookmarkItem.value"
            @click="openItem(bookmarkItem)"
          />
        </template>
        <template v-if="bookmarkItem.type === BookmarkType.widgets">
          <reg-visual v-if="bookmarkItem.value === 'reg-visual'" />
          <json-formatter v-else-if="bookmarkItem.value === 'json-formatter'" />
          <native-bookmark v-else-if="bookmarkItem.value === 'native-bookmark'" />
          <img-to-base v-else-if="bookmarkItem.value === 'img-to-base'" />
          <span v-else>unknown widgets type<br/>{{ bookmarkItem.name }} <small>{{ bookmarkItem.value }}</small></span>
        </template>
      </div>
      <div class="title">{{ bookmarkItem.name }}</div>
    </div>
  </div>
</template>

<script>
import { ref } from "vue"
import { listBookmarkService } from '../database/services/bookmark-service.ts'
import { BookmarkType, BookmarkSize } from '../database/entity/bookmark.ts'
import BookmarkIcon from './bookmark-icon.vue'
import RegVisual from './widgets/reg-visual.vue'
import JsonFormatter from './widgets/json-formatter/index.vue'
import NativeBookmark from './widgets/native-bookmark.vue'
import ImgToBase from './widgets/img-to-base/index.vue'

export default {
  components: { RegVisual, JsonFormatter, NativeBookmark, ImgToBase, BookmarkIcon },
  setup() {
    let bookmarkList = ref([])
    return {
      BookmarkType,
      BookmarkSize,
      bookmarkList,
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
    openItem(bookmarkItem) {
      window.open(bookmarkItem.value, '_blank')
    },
  },
};
</script>
