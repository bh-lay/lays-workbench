<template>
  <div class="bookmark-widgets">
    <button @click="jsonFormatterVisible = true">点击</button>
    <modal v-model:visible="jsonFormatterVisible" >
      <main-function />
    </modal>
  </div>
</template>

<script>
import { ref } from "vue";
import MainFunction from './main.vue'
export default {
  components: { MainFunction },
  setup() {
    const jsonFormatterVisible = ref(false)
    return {
      jsonFormatterVisible,
    };
  },
};
</script>
