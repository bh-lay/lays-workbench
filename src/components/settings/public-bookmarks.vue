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
    <public-bookmarks />
  </modal>
</template>

<script>
import { ref, watch } from 'vue';
import PublicBookmarks from '@/components/public-bookmarks/index.vue'

export default {
  components: { PublicBookmarks },
  setup() {
    const modalVisible = ref(false)
    return {
      modalVisible,
    };
  },
};
</script>
