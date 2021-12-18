<style lang="stylus" scoped>
.size-selector
  display flex
  width 120px
  height 34px
  border-radius 4px
  background #1a1d23
  overflow hidden
  div
    width 20px
    flex-grow 1
    line-height 34px
    text-align center
    cursor pointer
    color #c1c5cd
    font-size 14px
    transition .15s
    &:hover
      background #292e38
    &.active
      background: #157dac
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
