<style lang="stylus" scoped>
.search-entrance
  position relative
  width 500px
  perspective 800px
  z-index 10
.search-input
  display flex
  height 54px
  border-radius 4px
  background rgba(255, 255, 255, 0.2)
  backdrop-filter blur(2px)
  transition 0.5s 0.4s ease-in-out
  .selected-engine
    display flex
    justify-content center
    align-items center
    width 60px
    flex-shrink 0
    cursor pointer
    img
      width 24px
      height 24px
      filter grayscale(1)
      transition 0.2s ease-in-out
      opacity 0.5
    &:hover img, &.active img
      filter grayscale(0)
      opacity 1
  input
    box-sizing border-box
    width 100px
    flex-grow 1
    height 54px
    padding 15px 20px
    border none
    line-height 24px
    font-size 16px
    background transparent
    color #555
    &::-webkit-input-placeholder
      color #ccc
    &:focus
      outline none
  & > *
    transition 0.3s 0.2s
    opacity 0
  &.active, &:hover
    transition 0.5s ease-in-out
    background #fff
    & > *
      transition 0.5s 0.4s
      opacity 1
.engine-list
  box-sizing border-box
  position absolute
  top 100%
  width 100%
  display flex
  flex-wrap wrap
  padding 16px 0 10px 16px
  margin-top 10px
  border-radius 4px
  background #fff
.tab-item
  width 130px
  height 40px
  margin 0 10px 10px 0
  padding 0 0 0 15px
  line-height 40px
  font-size 12px
  color #555
  border-radius 4px
  transition 0.2s ease-out
  cursor pointer
  img
    display inline-block
    vertical-align middle
    width 16px
    height 16px
  &:hover
    background #f4f4f4
  &.active
    background #ddd
</style>

<template>
  <div class="search-entrance">
    <div
      :class="[
        'search-input',
        isActive? 'active' : '',
      ]"
    >
      <div
        :class="[
          'selected-engine',
          isActive ? 'active' : '',
        ]"
        @mousedown.prevent
        @click="toggleEngineList"
      >
        <img :src="selectedEngine.icon" :alt="selectedEngine.label" />
      </div>
      <input
        type="text"
        ref="input"
        v-model="searchText"
        :placeholder="selectedEngine.placeholder"
        @keydown="handleKeydown"
        @focus="inputFocused = true"
        @blur="inputFocused = false"
      />
    </div>
    <transition name="flip">
      <div
        class="engine-list"
        v-if="engineListVisible"
        v-clickoutside="onClickoutside"
        @mousedown.prevent
      >
        <div
          :class="[
            'tab-item',
            engine.name === selectedEngineName ? 'active' : '',
          ]"
          v-for="engine in searchEngineConfig"
          :key="engine.name"
          @click="selectEngine(engine)"
        >
          <img :src="engine.icon" :alt="engine.label" />
          {{ engine.label }}
        </div>
      </div>
    </transition>
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
        placeholder: '百度一下，你就知道了。',
        url: 'https://www.baidu.com/s?ie=UTF-8&wd=[kw]',
        icon: 'https://www.baidu.com/favicon.ico',
      },
      {
        name: 'google',
        label: '谷歌',
        placeholder: '谷歌虽好，可不一定访问的了～',
        url: 'https://www.baidu.com/s?ie=UTF-8&wd=[kw]',
        icon: 'https://www.google.cn/favicon.ico',
      },
      {
        name: 'caniuse',
        label: 'caniuse',
        placeholder: '前端兼容小字典！',
        url: 'https://www.caniuse.com/?search=[kw]',
        icon: 'https://caniuse.com/img/favicon-128.png',
      },
      {
        name: 'stackoverflow',
        label: 'stackoverflow',
        placeholder: '搜一搜歪果仁的技术讨论！',
        url: 'https://www.baidu.com/s?ie=UTF-8&wd=[kw]',
        icon: 'https://cdn.sstatic.net/Sites/stackoverflow/Img/apple-touch-icon.png?v=c78bd457575a',
      },
      {
        name: 'github',
        label: 'Github',
        placeholder: '来，我们一起偷代码～',
        url: 'https://github.com/search?q=[kw]',
        icon: 'https://github.githubassets.com/favicons/favicon.png',
      },
      {
        name: 'npm',
        label: 'NPM',
        placeholder: '搜一搜歪果仁的技术讨论',
        url: 'https://www.npmjs.com/search?q=[kw]',
        icon: 'https://static.npmjs.com/58a19602036db1daee0d7863c94673a4.png',
      },
    ];
    const selectedEngineName = ref(searchEngineConfig[0].name);
    const searchText = ref('');
    const engineListVisible = ref(false);
    const inputFocused = ref(false);
    return {
      searchEngineConfig,
      selectedEngineName,
      searchText,
      engineListVisible,
      inputFocused,
    };
  },
  computed: {
    selectedEngine() {
      return (
        this.searchEngineConfig.filter(
          (engine) => engine.name === this.selectedEngineName
        )[0] || this.searchEngineConfig[0]
      );
    },
    isActive() {
      return this.engineListVisible || this.inputFocused
    },
  },
  watch: {
    isActive(isFocues) {
      this.$emit(isFocues ? 'focus' : 'blur')
    },
  },
  methods: {
    handleKeydown(e) {
      if (e.keyCode === 13) {
        this.search();
      }
    },
    search() {
      let searhKeyword = encodeURIComponent(this.searchText);
      this.searchText = '';
      window.open(this.selectedEngine.url.replace('[kw]', searhKeyword));
      this.$refs.input.blur();
    },
    onClickoutside() {
      this.engineListVisible = false;
    },
    selectEngine(engine) {
      this.$refs.input.focus();
      this.selectedEngineName = engine.name;
      this.engineListVisible = false;
    },
    toggleEngineList() {
      this.$refs.input.focus();
      this.engineListVisible = !this.engineListVisible
    },
  },
};
</script>
