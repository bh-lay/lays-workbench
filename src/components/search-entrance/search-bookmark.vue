<style lang="stylus" scoped>
.search-list
  position absolute
  top 110%
  left 0
  width 100%
  border-radius 4px
  background #fff
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
    <div class="no-result">
      <v-mdi name="mdi-meteor" size="60" />
      <span>没有搜索到书签</span>
    </div>
  </div>
</template>

<script lang="ts">

export default {
  props: {
    searchText: {
      type: String,
      default: '',
    },
  },
}
</script>