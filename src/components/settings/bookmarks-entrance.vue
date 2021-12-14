<style lang="stylus" scoped>
.entrance
  display flex
  align-items center
  justify-content center
  height 120px
  background #f4f4f4
</style>

<template>
  <div
    class="entrance"
  >
    <v-button @click="showPrivateBookmark">查看</v-button>
  </div>
  
</template>

<script>
import { ref } from 'vue';
import { replaceRouter } from '@/assets/ts/router'
export default {
  setup() {
    return {
      showPrivateBookmark() {
        replaceRouter('widgets', 'private-bookmark')
      },
    };
  },
};
</script>
