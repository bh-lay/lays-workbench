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
    <bookmark-item :data="addData">
      <template v-slot:body>
        <add-bookmark />
      </template>
    </bookmark-item>
  </div>
</template>


<script>
import { ref } from 'vue';
import { Bookmark, BookmarkType, BookmarkSize } from '../database/entity/bookmark.ts'
import { listBookmarkService } from '../database/services/bookmark-service.ts';
import BookmarkItem from './bookmark-item.vue';
import AddBookmark from './widgets/add-bookmark/index.vue';

export default {
  components: { BookmarkItem, AddBookmark },
  setup() {
    let bookmarkList = ref([]);
    return {
      bookmarkList,
      BookmarkType,
      BookmarkSize,
      addData: new Bookmark({
        name: '添加',
        type: BookmarkType.widgets,
        size: BookmarkSize.small,
        undercoat: '#2196f3',
      })
    };
  },
  mounted() {
    this.getList();
  },
  methods: {
    getList() {
      listBookmarkService().then((list) => {
        console.log('list', list);
        this.bookmarkList = list;
      });
    },
  },
};
</script>
