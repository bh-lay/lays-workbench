<style lang="stylus" scoped>
.bookmark-directory
  display flex
  height 100%
  background #3a3a40
.category-list
  width 160px
  padding-top 50px
  background #4a4a50
.category-item
  height 40px
  padding-left 40px
  line-height 40px
  color #aaa
  cursor pointer
  transition .15s
  &:hover
    background #50505a
  &:active,
  &.active
    background #63aae3
    color #243542
.bookmark-container
  padding 30px 50px
</style>
<template>
  <div class="bookmark-directory">
    <div class="category-list">
      <div class="category-item active">
        社区论坛
      </div>
      <div class="category-item">
        团体组织
      </div>
      <div class="category-item">
        前端框架
      </div>
      <div class="category-item">
        UI框架
      </div>
    </div>
    <div class="bookmark-container">
      <h1 style="color: #aaa">
        开发中，就快好了！
      </h1>
    </div>
  </div>
</template>

<script lang="ts">
export default {
  name: 'PublicBookmarkCenter',
  setup() {
    return {}
  },
}
</script>
