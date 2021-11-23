<style lang="stylus" scoped>
.formatter-widgets
  height 100%
  text-align center
  cursor pointer
  transition .2s
  &:hover
    background rgba(0, 0, 0, .2)
.icon
  padding 25px 0 15px
  svg
    width 32px
    height 32px
    fill #fff
.title
  margin-bottom 2px
  line-height 20px
  font-size 15px
  font-weight bold
  color #fff
.desc
  line-height 20px
  font-size 12px
  color rgba(255, 255, 255, .6)
</style>
<template>
  <bookmark-icon
    icon="mdi:plus"
    undercoat="#000"
    @click="jsonFormatterVisible = true"
  />
  <modal v-model="jsonFormatterVisible" :width="400">
    <main-function />
  </modal>
</template>

<script>
import { ref } from "vue";
import MainFunction from './main.vue'
import BookmarkIcon from '../bookmark-icon.vue'
export default {
  components: { BookmarkIcon, MainFunction },
  setup() {
    const jsonFormatterVisible = ref(false)
    return {
      jsonFormatterVisible,
    };
  },
};
</script>
