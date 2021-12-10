<style lang="stylus" scoped>
.bookmark-directory
  display flex
  height 100%
  background #3a3a40
.category-list
  width 280px
  padding 30px 0 60px
  background #4a4a50
  overflow auto
  &::-webkit-scrollbar
    width 0
    height 0
.bookmark-container
  padding 30px 50px
</style>
<template>
  <div class="bookmark-directory">
    <div class="category-list">
      <folder-item
        :data="{
          id: 'root',
          label: '我的书签'
        }"
        :deep="0.5"
        :active="activeId"
        :expand="true"
        @select="activeId = 'root'"
      >
        <folder-list
          parent="root"
          :active="activeId"
          @select="activeId = $event"
        />
      </folder-item>
    </div>
    <div class="bookmark-container">
      {{ activeId }}
      <h1 style="color: #aaa">开发中，就快好了！</h1>
    </div>
  </div>
</template>

<script>
import { ref } from "vue";
import FolderList from './folder-list.vue'
import FolderItem from './folder-item.vue'
export default {
  components: { FolderList, FolderItem },
  setup(props) {
    const activeId = ref('root')
    return {
      activeId,
    };
  },
};
</script>
