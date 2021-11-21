<style lang="stylus" scoped>
.btn-list
  display grid
  grid-template-columns repeat(auto-fill, var(--grid-size))
  grid-auto-flow dense
  justify-content center
  padding-top 40px
</style>

<template>
  <div class="btn-list">
    <bookmark-item
      v-for="bookmarkItem in bookmarkList"
      :key="bookmarkItem.id"
      :data="bookmarkItem"
    />
  </div>
</template>

<script>
import { ref } from "vue"
import { listBookmarkService } from '../database/services/bookmark-service.ts'
import { Bookmark, BookmarkType, BookmarkSize } from '../database/entity/bookmark.ts'
import BookmarkItem from './bookmark-item.vue'

export default {
  components: { BookmarkItem },
  setup() {
    let bookmarkList = ref([])
    return {
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
        list.push(new Bookmark({
          id: 'custom-add',
          name: '添加',
          type: BookmarkType.widgets,
          size: BookmarkSize.small,
          undercoat: '#2196f3',
          value: 'add-bookmark',
        }))
        this.bookmarkList = list
      })
    },
  },
};
</script>
