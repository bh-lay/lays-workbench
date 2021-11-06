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
    <modal v-model:visible="jsonFormatterVisible" >
      <json-formatter />
    </modal>
  </div>
</template>

<script>
import { ref } from "vue";
import JsonFormatter from './json-formatter.vue'
export default {
  components: { JsonFormatter },
  setup() {
    const regVisualVisible = ref(false)
    const jsonFormatterVisible = ref(false)
    return {
      regVisualVisible,
      jsonFormatterVisible,
    };
  },
};
</script>
