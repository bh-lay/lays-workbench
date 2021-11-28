<style lang="stylus" scoped>
.btn-list
  display grid
  grid-template-columns repeat(auto-fill, var(--grid-size))
  grid-auto-flow dense
  justify-content center
  padding-top 30px
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
import {
  ref,
  nextTick,
  onMounted,
  onBeforeUpdate,
} from 'vue';
import {
  Bookmark,
  BookmarkType,
  BookmarkSize,
} from '../../database/entity/bookmark.ts';
import { bookmarkListService } from '../../database/services/bookmark-service.ts';
import BookmarkItem from '../bookmark-item.vue';
import AddBookmark from '../add-bookmark/index.vue';
import CustomLink from '../add-bookmark/custom-link.vue';
import DragedLayer from '../draged-layer.vue';

export default {
  props: {
    parentId: {
      type: String,
      default: ''
    },
  },
  components: { BookmarkItem, AddBookmark, CustomLink, DragedLayer },
  setup(props, context) {
    let bookmarkList = ref([]);

    const getList = function () {
      bookmarkListService({
        parent: props.parentId
      }).then((list) => {
        bookmarkList.value = list;
      });
    };
    onMounted(() => {
      getList();
    });
    return {
      bookmarkList,
      BookmarkType,
      BookmarkSize,

      refreshList() {
        getList();
      },
    };
  },
};
</script>
