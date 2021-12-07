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
    <v-button @click="modalVisible = true">修改</v-button>
  </div>
  <modal v-model="modalVisible" width="80%" height="80%" >
    <bookmark-directory />
  </modal>
</template>

<script>
import { ref, watch } from 'vue';
import BookmarkDirectory from '@/components/bookmark-directory/index.vue'

export default {
  components: { BookmarkDirectory },
  setup() {
    const modalVisible = ref(false)
    return {
      modalVisible,
    };
  },
};
</script>
