<style lang="stylus" scoped>
.search-entrance
  width 450px
  .tab-list
    display flex
  .tab-item
    height 40px
    padding 0 30px
    line-height 40px
    font-size 12px
    color #555
    background rgba(255, 255, 255, 0.5)
    cursor pointer
    &.active
      background #fff
.search-input
  height 54px
  border-radius 4px
  border 1px solid #ddd
  background #fff
</style>

<template>
  <div class="search-entrance">
    <div class="tab-list">
      <div
        :class="[
          'tab-item',
          engine.name === selectedEngineName ? 'active' : '',
        ]"
        v-for="engine in searchEngineConfig"
        :key="engine.name"
        @click="selectedEngineName = engine.name"
      >
        {{ engine.label }}
      </div>
    </div>
    <div class="search-input">
      <input
        type="text"
        v-model="searchText"
        placeholder="搜索"
        @keydown="handleKeydown"
      />
    </div>
  </div>
</template>

<script>
import { ref } from 'vue';

export default {
  setup() {
    const searchEngineConfig = [
      {
        name: 'baidu',
        label: '百度',
        url: 'https://www.baidu.com/s?ie=UTF-8&wd=[kw]',
      },
      {
        name: 'google',
        label: '谷歌',
        url: 'https://www.baidu.com/s?ie=UTF-8&wd=[kw]',
      },
      {
        name: 'caniuse',
        label: 'caniuse',
        url: 'https://www.caniuse.com/?search=[kw]',
      },
      {
        name: 'stackoverflow',
        label: 'stackoverflow',
        url: 'https://www.baidu.com/s?ie=UTF-8&wd=[kw]',
      },
    ];
    const selectedEngineName = ref(searchEngineConfig[0].name);
    const searchText = ref('');
    return {
      searchEngineConfig,
      selectedEngineName,
      searchText,
    };
  },
  methods: {
    handleKeydown(e) {
      console.log('12122', e);
      if (e.keyCode === 13) {
        this.search();
      }
    },
    search() {
      let searhKeyword = encodeURIComponent(this.searchText);
      let searchEngine = this.searchEngineConfig.filter(
        (engine) => engine.name === this.selectedEngineName
      )[0] || this.searchEngineConfig[0];
      window.open(searchEngine.url.replace('[kw]', searhKeyword));
    },
  },
};
</script>
