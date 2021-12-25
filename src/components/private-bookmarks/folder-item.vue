<style lang="stylus" scoped>
.folder-item
  position relative
  display flex
  align-items center
  padding-right 20px
  min-height 40px
  color #bdbdc7
  .add
    opacity 0
  &:before
    content ''
    position absolute
    top 0
    left 0
    width 4px
    height 100%
    border-radius 0 4px 4px 0
    transition .4s
  &:hover
    .add
      opacity 1
  &.active
    &:before
      background-color #198ae6
    .label
      font-weight bold
      color #198ae6
.icon-btn
  display flex
  align-items center
  justify-content center
  width 30px
  height 30px
  border-radius 20px
  cursor pointer
  svg
    transition .2s
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
  font-size 13px
  cursor pointer
  transition .15s
  &:hover
    color #ddd
  &:active,
  &.active
    color #198ae6
</style>
<template>
  <div
    :class="['folder-item', active === data.id ? 'active' : '']"
    :style="{
      paddingLeft: deep * 15 + 'px',
    }"
  >
    <div
      :class="[
        'icon-btn',
        hasSubMenu ? '' : 'hidden',
      ]"
      @click="isExpand = !isExpand"
    >
      <v-mdi
        :name="isExpand ? 'mdi-folder-open' : 'mdi-folder'"
        size="16"
      />
    </div>
    <div
      class="label"
      @click="$emit('select', data.id)"
    >
      {{ data.name }}
    </div>
    <div
      v-if="deep <= 3"
      class="icon-btn add"
      @click="$emit('create', data.id)"
    >
      <v-mdi
        name="mdi-plus"
        size="20"
      />
    </div>
  </div>
  <div
    v-if="isExpand"
    class="sub-folder"
  >
    <vue-folder-item
      v-for="item in bookmarkList"
      :key="item.id"
      :data="item"
      :deep="deep + 1"
      :active="active"
      :changed-parent-id="changedParentId"
      @select="$emit('select', $event)"
      @create="$emit('create', $event)"
    />
  </div>
</template>

<script lang="ts">
import { Ref, ref, watch } from 'vue'
import {
  Bookmark,
  BookmarkType,
} from '@database/entity/bookmark'
import { bookmarkListService } from '@database/services/bookmark-service'
export default {
  name: 'VueFolderItem',
  props: {
    data: {
      type: Bookmark,
      default() {
        return {}
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
    changedParentId: {
      type: String,
      default: '',
    },
  },
  emits: ['select', 'create'],
  setup(props: {
    expand: boolean,
    data: Bookmark,
    active: string,
    changedParentId: string,
  }) {
    const isExpand = ref(props.expand)
    const bookmarkList: Ref<Bookmark[]> = ref([])
    const hasSubMenu = ref(true)
    const loadList = () => {
      bookmarkListService({
        parent: props.data.id,
        type: BookmarkType.folder,
      }).then((list) => {
        bookmarkList.value = list
        hasSubMenu.value = list.length > 0
      })
    }
    watch(
      isExpand,
      (needLoadSub) => {
        if (!needLoadSub) {
          return
        }
        loadList()
      },
      {
        immediate: true,
      }
    )
    watch(
      () => props.changedParentId,
      (changedParentId) => {
        if (changedParentId !== props.data.id || !isExpand.value) {
          return
        }
        loadList()
      }
    )
    watch(
      () => props.active,
      (changedParentId) => {
        if (changedParentId == props.data.id) {
          isExpand.value = true
        }
      }
    )
    return {
      isExpand,
      hasSubMenu,
      bookmarkList,
    }
  },
}
</script>
