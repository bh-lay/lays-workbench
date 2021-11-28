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
    v-contextmenu:menu="{
      onVisible() {
        selectedBookmarkItem = bookmarkItem
      }
    }"
  />
  <contextmenu ref="menu">
    <contextmenu-item
      v-if="selectedBookmarkItem.type === BookmarkType.link"
      @click="$emit('open-bookmark-editor', selectedBookmarkItem)"
    >
      编辑
    </contextmenu-item>
    <contextmenu-item @click="handleRemove">删除</contextmenu-item>
  </contextmenu>
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
import {
  bookmarkListService,
  bookmarkRemoveService,
  bookmarkUpdateService,
} from '../../database/services/bookmark-service.ts';
import BookmarkItem from '../bookmark-item.vue';
import AddBookmark from '../add-bookmark/index.vue';
import CustomLink from '../add-bookmark/custom-link.vue';
import DragedLayer from '../draged-layer.vue';

export default {
  emits: ['open-bookmark-editor'],
  props: {
    parentId: {
      type: String,
      default: ''
    },
  },
  components: { BookmarkItem, AddBookmark, CustomLink, DragedLayer },
  setup(props, context) {
    let bookmarkList = ref([]);
    const selectedBookmarkItem = ref(null)
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
      selectedBookmarkItem,
      refreshList() {
        getList();
      },
      handleRemove() {
        bookmarkRemoveService(selectedBookmarkItem.value.id).then(() => {
          for (let i = 0; i < bookmarkList.value.length; i++) {
            if (bookmarkList.value[i].id === selectedBookmarkItem.value.id) {
              bookmarkList.value.splice(i, 1);
              break;
            }
          }
        }).catch(e => alert(e.message || '删除失败！'));
      },
    };
  },
};
</script>
