<style lang="stylus" scoped>
.main-item
  display flex
  align-items center
  min-height 30px
  padding 5px 20px
  color #bdbdc7
  svg
    flex-shrink 0
  .label
    margin 0 10px
    font-size 14px
    white-space nowrap
    text-overflow ellipsis
    overflow hidden
  .value
    font-size 12px
    white-space nowrap
    text-overflow ellipsis
    overflow hidden
  &:hover
    background #3a3a40
  &:active,
  &.active
    background #1679ca
    color #dde
</style>
<template>
  <div :class="['main-item', active ? 'active' : '']">
    <v-mdi :name="data.type === BookmarkType.folder ? 'mdi-folder' : 'mdi-link-variant'" size="14" />
    <div class="label">{{ data.name }}</div>
    <div class="value">{{ data.value }}</div>
  </div>
</template>

<script>
import { ref, watch } from 'vue';
import { Bookmark, BookmarkType, BookmarkSize } from '@database/entity/bookmark'
export default {
  props: {
    active: {
      type: Boolean,
      default: false,
    },
    data: {
      type: Object,
      default() {
        return {}
      },
    },
  },
  setup() {
    return {
      BookmarkType
    }
  },
};
</script>
