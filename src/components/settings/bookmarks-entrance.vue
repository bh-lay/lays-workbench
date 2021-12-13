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
    <v-button @click="modalVisible = true">查看</v-button>
  </div>
  <modal v-model="modalVisible" width="80%" height="80%" >
    <private-bookmarks />
  </modal>
</template>

<script>
import { ref, watch } from 'vue';
import PrivateBookmarks from '@/components/private-bookmarks/index.vue'

export default {
  components: { PrivateBookmarks },
  setup() {
    const modalVisible = ref(false)
    return {
      modalVisible,
    };
  },
};
</script>
