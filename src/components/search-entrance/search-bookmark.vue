<style lang="stylus" scoped>
@import '../../assets/stylus/functions/scrollbar.styl'
.search-list
  position absolute
  top 110%
  left 0
  width 100%
  max-height 500%
  border-radius 4px
  background #fff
  overflow auto
  scrollbar #fff
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
    <div v-if="bookmarks.length > 0" class="bookmark-list">
      <div
        v-for="(bookmark, index) in bookmarks"
        :key="bookmark.id"
        ref="bookmarkRef"
        :class="['item', selectedIndex === index ? 'active' : '']"
      >
        {{ selectedIndex === index }}
        <strong>{{ bookmark.name }}</strong>
        <span>{{ bookmark.value }}</span>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, nextTick, Ref, ref, watch } from 'vue'
import { bookmarkSearchService } from '@database/services/bookmark-service'
import { Bookmark } from '@/database/entity/bookmark'
export default defineComponent({
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
    const selectedIndex = ref(0)
    const bookmarkRef: Ref<[HTMLDivElement] | null> = ref(null)
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
    watch(selectedIndex, () => {
      console.log('bookmarkRef', bookmarkRef.value)
    })
    return {
      isSearching,
      bookmarkRef,
      selectedIndex,
      bookmarks,
      next() {
        if (selectedIndex.value < bookmarks.value.length - 1) {
          selectedIndex.value++
        } else {
          selectedIndex.value = 0
        }
      },
      prev() {
        if (selectedIndex.value > 0) {
          selectedIndex.value--
        } else {
          selectedIndex.value = bookmarks.value.length - 1
        }
      },
      confirm() {},
    }
  },
})
</script>