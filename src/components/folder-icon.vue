<style lang="stylus" scoped>
  .folder-icon
    box-sizing border-box
    height 100%
    transition .15s
    cursor pointer
    &:hover
      background #fff
  .origin-map
    box-sizing border-box
    width 200%
    height 200%
    transform scale(.5)
    transform-origin top left
    pointer-events none
    display flex
    flex-wrap wrap
    justify-content space-between
    align-content space-between
    padding calc((var(--grid-size) - var(--grid-gap)) / 4.2)
    div
      width calc((var(--grid-size) - var(--grid-gap)) * 0.7)
      height calc((var(--grid-size) - var(--grid-gap)) * 0.7)
      border-radius 4px
      font-size calc((var(--grid-size) - var(--grid-gap)) * 0.15)

</style>

<template>
  <div class="folder-icon">
    <div class="origin-map">
      <bookmark-icon
        v-for="item in bookmarkList"
        :key="item.id"
        :icon="item.icon"
        :undercoat="item.undercoat"
        :url="item.value"
        :style="{
          background: item.undercoat
        }"
      />
    </div>
  </div>
</template>

<script>
import { ref, watch } from 'vue';
import BookmarkIcon from './bookmark-icon.vue'
import { bookmarkListService } from '@database/services/bookmark-service';

export default {
  components: { BookmarkIcon },
  props: {
    data: {
      type: Object,
      default() {
        return {}
      },
    }
  },
  setup(props) {
    let bookmarkList = ref([]);
    const parentId = props.data.id
    const loadList = () => {
      bookmarkListService({
        parent: parentId,
      }).then((list) => {
        bookmarkList.value = list.slice(0, 4)
      });
    }
    loadList()
    console.log('props.data.value', `|${props.data.value}|` )
    watch(() => props.data.value, () => {
      loadList()
    })
    return {
      bookmarkList,
    }
  },
};
</script>
