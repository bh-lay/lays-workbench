<style lang="stylus" scoped>
.add-bookmark-modal
  padding 20px
</style>

<template>
  <div class="add-bookmark-modal">
    <tab v-model="activeCreateType" />
    <custom-link v-if="activeCreateType === 'custom'" @success="$emit('success')"/>
  </div>
</template>

<script>
import { ref } from 'vue';
import Tab from './tab.vue'
import CustomLink from './custom-link.vue'
export default {
  emits: ['success'],
  components: { Tab, CustomLink },
  setup() {
    const activeCreateType = ref('custom')
    return {
      activeCreateType
    }
  },
};
</script>
