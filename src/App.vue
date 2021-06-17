<style>
html, body {
    position: relative;
    height: 100%;
    margin: 0;
    padding: 0;
}
#app {
  position: relative;
  height: 100%;
}
</style>
<style scoped>
.gallery {
    position: relative;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: 100%;
    background: #222;
}
</style>

<template>
  <div class="gallery">
    <search-entrance />
    <quick-entry />
    <button @click="inc">Clicked {{ count }} times.</button>
  </div>
</template>

<script>
import { ref } from "vue";
import SearchEntrance from './components/search-entrance.vue'
import QuickEntry from './components/quick-entry.vue'

export default {
  components: { SearchEntrance, QuickEntry },
  setup() {
    const count = ref(0);
    const inc = () => {
      count.value++;
    };

    return {
      count,
      inc,
    };
  },
};
</script>
