<style lang="stylus" scoped>
  .photo-size-list-title
    margin-bottom 12px
    font-size 18px
    color #ddd
  .photo-size-item
    margin-bottom 4px
    font-size 14px
    color #aaa
    &:hover
      cursor pointer
    &.active
      color #fff
</style>

<template>
  <div class="photo-size-list">
    <div class="photo-size-list-title">
      {{ title }}
    </div>
    <div
      v-for="item in list"
      :key="item.label"
      class="photo-size-item"
      :class="width === item.width && height === item.height ? 'active' : ''"
      @click="$emit('request-change-size', item.width, item.height)"
    >
      {{ `${item.label}(${item.width}x${item.height})` }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { PropType } from 'vue'

defineProps({
  title: {
    type: String,
    default: '',
  },
  width: {
    type: Number,
    default: 200,
  },
  height: {
    type: Number,
    default: 200,
  },
  list: {
    type: Array as PropType<{
        label:string;
        width: number,
        height: number,
      }[]>,
    required: true,
  },
})
defineEmits(['request-change-size'])
</script>
