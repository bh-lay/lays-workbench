<style lang="stylus" scoped>
  .folder-icon
    box-sizing border-box
    display flex
    flex-wrap wrap
    justify-content space-between
    align-content space-between
    height 100%
    padding calc((var(--grid-size) - var(--grid-gap)) / 5.4)
    transition .15s
    cursor pointer
    div
      width calc((var(--grid-size) - var(--grid-gap)) / 3.5)
      height calc((var(--grid-size) - var(--grid-gap)) / 3.5)
      border-radius calc(var(--grid-size) / 25)
    &:hover
      background #fff
</style>

<template>
  <div class="folder-icon">
    <div
      v-for="(color ,index) in colorList"
      :key="index"
      :style="{
        background: color
      }"
    ></div>
  </div>
</template>

<script>
import { ref, watch } from 'vue';

export default {
  props: {
    data: {
      type: String,
      default: false,
    }
  },
  setup(props) {
    const colorList = ref([])
    watch(
      () => props.data,
      colorData => {
        colorList.value = (colorData || '').split('|').slice(0, 4)
      },
      {
        immediate: true,
      }
    )
    return {
      colorList,
    }
  },
};
</script>
