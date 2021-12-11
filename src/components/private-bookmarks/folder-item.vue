<style lang="stylus" scoped>
.folder-item
  position relative
  display flex
  align-items center
  padding-right 15px
  min-height 40px
  &:before
    content ''
    position absolute
    top 0
    left -2px
    width 4px
    height 100%
    border-radius 0 4px 4px 0
    transition .4s
  &:hover
    .add-btn
      opacity 1
  &.active
    &:before
      left 0
      background-color #198ae6
    .label
      font-weight bold
      color #198ae6
.expand-btn
  display flex
  align-items center
  justify-content center
  width 30px
  height 30px
  border-radius 20px
  cursor pointer
  svg
    transition .2s
    fill #aaa
  &:hover
    background #50505a
  &:active
    background #636780
    color #243542
  &.hidden
    opacity .2
.label
  width 50px
  flex-grow 1
  padding 0 6px
  border-radius 4px
  line-height 24px
  color #aaa
  font-size 13px
  cursor pointer
  transition .15s
  &:hover
    color #ddd
  &:active,
  &.active
    color #fff
.add-btn
  display flex
  align-items center
  justify-content center
  width 30px
  height 30px
  margin-right 4px
  border-radius 20px
  cursor pointer
  opacity 0
  svg
    width 18px
    transition .2s
    fill #aaa
  &:hover
    background #50505a
  &:active
    background #636780
    color #243542
</style>
<template>
  <div
    :class="['folder-item', active === data.id ? 'active' : '']"
    :style="{
      paddingLeft: deep * 15 + 'px',
    }"
  >
    <div
      :class="['expand-btn', isExpand ? 'expand' : '', hasSubMenu ? '' : 'hidden']"
      @click="isExpand = !isExpand"
    >
      <v-mdi
        name="mdi-menu-down"
        :rotate="isExpand ? 0 : -90"
      />
    </div>
    <div class="label" @click="$emit('select', data.id)">{{ data.name }}</div>
    <div v-if="deep < 3" class="add-btn" @click="$emit('create', data.id)">
      <v-mdi name="mdi-plus" />
    </div>
  </div>
  <div v-if="isExpand" class="sub-folder">
    <vue-folder-item
      v-for="item in bookmarkList"
      :key="item.id"
      :data="item"
      :deep="deep + 1"
      :active="active"
      :changed-id="changedId"
      @select="$emit('select', $event)"
      @create="$emit('create', $event)"
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
import { bookmarkListService } from '@database/services/bookmark-service';
export default {
  name: 'vue-folder-item',
  emits: ['select', 'create'],
  props: {
    data: {
      type: Object,
      default() {
        return {};
      },
    },
    deep: {
      type: Number,
      default: 0,
    },
    active: {
      type: String,
      default: 'root',
    },
    expand: {
      type: Boolean,
      default: false,
    },
    changedId: {
      type: String,
      default: '',
    },
  },
  setup(props) {
    const isExpand = ref(props.expand);
    const bookmarkList = ref([]);
    const hasSubMenu = ref(true)
    const loadList = () => {
      bookmarkListService({
        parent: props.data.id,
        type: BookmarkType.folder,
      }).then((list) => {
        bookmarkList.value = list;
        hasSubMenu.value = list.length > 0
      });
    };
    watch(
      isExpand,
      (needLoadSub) => {
        if (!needLoadSub) {
          return;
        }
        loadList();
      },
      {
        immediate: true,
      }
    );
    watch(
      () => props.changedId,
      (changedId) => {
        if (changedId !== props.data.id || !isExpand.value) {
          return;
        }
        loadList();
      }
    );
    return {
      isExpand,
      hasSubMenu,
      bookmarkList,
    };
  },
};
</script>
