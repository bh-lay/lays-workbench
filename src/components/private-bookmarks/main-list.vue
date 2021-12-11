<style lang="stylus" scoped>
.link-list-body
  border-radius 4px
  background #2f2f37
  overflow hidden
  box-shadow 1px 1px 3px rgba(0, 0, 0, .3), 1px 1px 10px rgba(0, 0, 0, .1)
.header
  margin-bottom 15px
.empty
  padding 100px 20px
  text-align center
  color #545463
</style>
<template>
  <div class="header">
    <v-button type="dark" @click="handleCreate">添加链接</v-button>
  </div>
  <div v-if="bookmarkList.length === 0" class="empty">
    万物皆空
  </div>
  <div v-else class="link-list-body">
    <main-item
      v-for="item in bookmarkList"
      :key="item.id" :data="item"
      :active="selectedId === item.id"
      @click="selectedId = item.id"
      @dblclick="handleOpen(item)"
    />
  </div>
</template>

<script>
import { ref, watch } from 'vue';
import {
  Bookmark,
  BookmarkType,
  BookmarkSize,
} from '@database/entity/bookmark';
import {
  bookmarkListService,
  bookmarkInsertService,
} from '@database/services/bookmark-service';
import MainItem from './main-item.vue';
export default {
  components: { MainItem },
  emits: ['select', 'create'],
  props: {
    parent: {
      type: String,
      default: '',
    },
  },
  setup(props, context) {
    const bookmarkList = ref([]);
    const selectedId = ref('')
    const loadList = () => {
      bookmarkListService({
        parent: props.parent,
      }).then((list) => {
        list.sort((A, B) => {
          let aValue = (A.type === BookmarkType.folder ? 10000 : 0) + A.sort
          let bValue = (B.type === BookmarkType.folder ? 10000 : 0) + B.sort
          return bValue - aValue
        })
        bookmarkList.value = list;
      });
    };
    loadList();
    watch(() => props.parent, loadList);
    return {
      selectedId,
      bookmarkList,
      handleCreate() {
        const item = new Bookmark({
          name: '自定义链接-' + new Date().getSeconds(),
          sort: 0,
          type: BookmarkType.link,
          parent: props.parent,
          value: 'http://bh-lay.com',
        });
        bookmarkInsertService(item).then(() => {
          loadList();
        });
      },
      handleOpen(bookmark) {
        if (bookmark.type === BookmarkType.folder) {
          context.emit('open-folder', bookmark.id)
        } else if (bookmark.type === BookmarkType.link) {
          window.open(bookmark.value, '_blank')
        }
      },
    };
  },
};
</script>
