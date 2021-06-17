<style scoped>
.search-entrance {
    width: 400px;
}
.search-entrance .tab-list {
    display: flex;
    background: #eee;
}
.search-entrance .tab-list .tab-item {
    height: 24px;
    padding: 0 16px;
    line-height: 24px;
    font-size: 12px;
    color: #555;
}
.search-entrance .tab-list .tab-item.active {
    background: #fff;
}
.search-entrance .search-input {
    height: 50px;
    background: #fff;
}
</style>

<template>
    <div class="search-entrance">
      <div class="tab-list">
        <div class="tab-item">百度</div>
        <div class="tab-item active">谷歌</div>
        <div class="tab-item">stackoverflow</div>
        <div class="tab-item">caniuse</div>
      </div>
      <div class="search-input"></div>
    </div>
</template>

<script>
import { ref } from "vue";

export default {
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
