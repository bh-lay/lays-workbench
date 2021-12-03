<style lang="stylus" scoped>
.size-selector
  display flex
  width 120px
  height 40px
  border-radius 4px
  background #17202b
  overflow hidden
  div
    width 20px
    flex-grow 1
    line-height 40px
    text-align center
    cursor pointer
    color #fff
    font-size 14px
    transition .15s
    &:hover
      background #064360
    &.active
      background: #03a9f4
</style>

<template>
  <div class="size-selector">
    <div
      v-for="size in sizeList"
      :key="size.value"
      :class="[modelValue === size.value ? 'active' : '']"
      @click="$emit('update:modelValue', size.value)"
    >
      {{ size.label }}
    </div>
  </div>
</template>

<script>
import { BookmarkSize } from '@database/entity/bookmark';
export default {
  props: {
    modelValue: {
      type: Number,
      default: null,
    },
  },
  setup() {
    return {
      BookmarkSize,
      sizeList: [
        {
          value: BookmarkSize.large,
          label: '大',
        },
        {
          value: BookmarkSize.medium,
          label: '中',
        },
        {
          value: BookmarkSize.small,
          label: '小',
        },
      ],
    };
  },
};
</script>
