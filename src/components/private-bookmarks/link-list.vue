<style lang="stylus" scoped>
.active
  background #1679ca
</style>
<template>
  <div class="folder-list">
    <v-button @click="handleCreate">添加链接</v-button>
    <div v-for="item in bookmarkList" :key="item.id">
      {{ item.name }} - {{ item.value }}
    </div>
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
import FolderItem from './folder-item.vue';
export default {
  components: { FolderItem },
  emits: ['select', 'create'],
  props: {
    parent: {
      type: String,
      default: '',
    },
  },
  setup(props) {
    const bookmarkList = ref([]);
    const loadList = () => {
      bookmarkListService({
        parent: props.parent,
        type: BookmarkType.link,
      }).then((list) => {
        bookmarkList.value = list;
      });
    };
    loadList();
    watch(() => props.parent, loadList);
    return {
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
    };
  },
};
</script>
