<style lang="stylus" scoped>
.bookmark-directory
  height 100%
  background #3a3a40
  iframe
    display block
    width 100%
    height 100%
</style>
<template>
  <div class="bookmark-directory">
    <iframe
      src="/navigation/index.html"
      frameborder="0"
    />
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
