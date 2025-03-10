<style lang="stylus" scoped>
@import '../../assets/stylus/vars/colors.styl'
.search-list
  position absolute
  top 110%
  left 0
  width 100%
  max-height 500%
  border-radius 4px
  background $card-bg-color
  overflow auto
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
    color #9099a2
.item
  padding 4px 8px
  border-radius 4px
  white-space nowrap
  overflow hidden
  text-overflow ellipsis
  line-height 24px
  cursor pointer
  color #697886
  :deep(b)
    color #d96e26
  .name
    color #c4cdd4
    font-size 14px
  .url
    padding-left 1em
    font-size 12px
  .use-engine
    font-size 14px
  &.active
    background #2c313a
  &:hover
    background #333a47
  &:active
    background #16181d
</style>
<template>
  <div
    class="search-list"
    @mousedown.prevent
  >
    <div class="bookmark-list">
      <div
        key="default-search"
        :ref="setItemRef"
        :class="['item', selectedIndex === -1 ? 'active' : '']"
        @click="handleDefaultSearch"
      >
        <span class="use-engine">使用“<b>{{ searchEngineName }}</b>”搜索</span>
      </div>
      <div
        v-for="(bookmark, index) in bookmarks"
        :key="bookmark.id"
        :ref="setItemRef"
        :class="['item', selectedIndex === index ? 'active' : '']"
        @click="handleClick(bookmark)"
      >
        <hightlight-text
          class="name"
          :content="bookmark.name"
          :keyword="searchText"
        />
        <hightlight-text
          class="url"
          :content="bookmark.value"
          :keyword="searchText"
        />
      </div>
      <div
        v-if="!isSearching && bookmarks.length === 0"
        class="no-result"
      >
        <v-mdi
          name="mdi-meteor"
          size="60"
        />
        <span>没有搜索到书签</span>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onBeforeUpdate, Ref, ref, watch } from 'vue'
import { bookmarkSearchService } from '@database/services/bookmark-service'
import { Bookmark, BookmarkType } from '@/database/entity/bookmark'

export default defineComponent({
  props: {
    searchText: {
      type: String,
      default: '',
    },
    searchEngineName: {
      type: String,
      default: '',
    },
  },
  emits: ['request-open', 'request-search'],
  setup(props: {
    searchText: string
  }, context) {
    const isSearching = ref(false)
    const selectedIndex = ref(-1)
    const bookmarkElList: HTMLElement[] = []
    const bookmarks: Ref<Bookmark[]> = ref([])

    watch(
      () => props.searchText,
      (value: string) => {
        isSearching.value = true
        bookmarkSearchService(value)
          .then(list => {
            bookmarks.value = list.filter(item => item.type !== BookmarkType.folder)
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
    watch(selectedIndex, (index) => {
      const el: HTMLElement | undefined =  bookmarkElList[index + 1]
      if (!el) {
        return
      }
      const scrollNode = el.parentNode?.parentNode as HTMLElement
      if (!scrollNode) {
        return
      }
      scrollNode.scrollTop = el.offsetTop - scrollNode.clientHeight / 3
    })
    onBeforeUpdate(() => {
      bookmarkElList.splice(0, bookmarkElList.length)
    })
    const setItemRef = (el: unknown) => {
      if (el) {
        bookmarkElList.push(el as HTMLElement)
      }
    }
    return {
      isSearching,
      selectedIndex,
      bookmarks,
      setItemRef,
      next() {
        if (selectedIndex.value < bookmarks.value.length - 1) {
          selectedIndex.value++
        } else {
          selectedIndex.value = -1
        }
      },
      prev() {
        if (selectedIndex.value > -1) {
          selectedIndex.value--
        } else {
          selectedIndex.value = bookmarks.value.length - 1
        }
      },
      getSelectedBookmark() {
        const selectedIndexValue = selectedIndex.value
        return selectedIndexValue === -1 ? null : bookmarks.value[selectedIndex.value]
      },
      handleClick(bookmark: Bookmark) {
        context.emit('request-open', bookmark)
      },
      handleDefaultSearch() {
        context.emit('request-search')
      },
    }
  },
})
</script>