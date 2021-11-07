<style lang="stylus" scoped>
iframe
  width 100%
  height 100%
  border none
</style>

<template>
  <div class="bookmark-widgets">
    <button @click="regVisualVisible = true">点击</button>
    <modal v-model:visible="regVisualVisible" >
      <iframe src="/regulex-legacy/" visible="0"></iframe>
    </modal>
  </div>
</template>

<script>
import { ref } from "vue";
export default {
  setup() {
    const regVisualVisible = ref(false)
    return {
      regVisualVisible,
    };
  },
};
</script>
