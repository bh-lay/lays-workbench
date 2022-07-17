<style lang="stylus" scoped>
.search-list
  position absolute
  top 110%
  left 0
  width 100%
  border-radius 4px
  background #fff

.bookmark-list
  padding 20px
.no-result
  padding 40px 0
  text-align center
  svg
    display inline-block
    vertical-align top
    color #a7b3be
  span
    display inline-block
    vertical-align top
    padding 0 60px 0 20px
    line-height 60px
    color #5c6670
</style>
<template>
  <div class="search-list">
    <div v-if="!isSearching && bookmarks.length === 0" class="no-result">
      <v-mdi name="mdi-meteor" size="60" />
      <span>没有搜索到书签</span>
    </div>
    <div class="bookmark-list">
      <p>开发中...</p>
      <div v-for="bookmark in bookmarks" :key="bookmark.id">
        <strong>{{ bookmark.name }}</strong>
        <span>{{ bookmark.value }}</span>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Ref, ref, watch } from 'vue'
import { bookmarkSearchService } from '@database/services/bookmark-service'
import { Bookmark } from '@/database/entity/bookmark'
export default {
  props: {
    searchText: {
      type: String,
      default: '',
    },
  },
  setup(props: {
    searchText: string
  }) {
    const isSearching = ref(false)
    const bookmarks: Ref<Bookmark[]> = ref([])
    
    watch(
      () => props.searchText,
      (value: string) => {
        isSearching.value = true
        bookmarkSearchService(value)
          .then(list => {
            bookmarks.value = list
          })
          .catch(() => {
            bookmarks.value = []
          })
          .then(() => {
            isSearching.value = false
          })
      },
      {
        immediate: true,
      }
    )
    return {
      isSearching,
      bookmarks,
    }
  },
}
</script>