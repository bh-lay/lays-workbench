<style lang="stylus" scoped>
search-height = 56px
.search-entrance
  position relative
  width 90%
  max-width 600px
  margin-top 100px
  z-index 10
.search-input
  display flex
  height search-height
  border-radius 4px
  background rgba(255, 255, 255, 0.2)
  backdrop-filter blur(2px)
  transition 0.4s 0.3s ease-in-out
  .selected-engine
    display flex
    justify-content center
    align-items center
    width 60px
    flex-shrink 0
    cursor pointer
    svg
      width 24px
      height 24px
      fill #c1c6d1
      transition 0.2s ease-in-out
    &:hover svg,
    &.active svg
      fill #182749
      opacity 1
  input
    box-sizing border-box
    width 100px
    flex-grow 1
    height search-height
    padding 15px 20px
    border none
    line-height 26px
    font-size 16px
    background transparent
    color #555
    &::-webkit-input-placeholder
      color #ccc
    &:focus
      outline none
  & > *
    transition 0.2s 0.1s
    opacity 0
  &.active, &:hover
    transition 0.2s ease-out
    background #fff
    backdrop-filter blur(0)
    & > *
      transition 0.4s 0.15s
      opacity 1

.engine-list
  position absolute
  top 100%
  left 0
  width 160px
.engine-item
  height 38px
  padding-left 22px
  border-radius 4px
  line-height 38px
  font-size 12px
  font-weight bold
  color #e0e4eb
  transition background 0.2s ease-out
  cursor pointer
  svg
    display inline-block
    vertical-align middle
    width 16px
    height 16px
    margin-right 12px
  &:hover
    background rgba(0, 0, 0, .2)
  &:active
    background rgba(0, 0, 0, .4)
  &.active
    height search-height
    opacity 0
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
        @click="showEngineList"
      >
        <v-mdi :name="selectedEngine.icon" />
      </div>
      <input
        ref="inputRef"
        v-model="searchText"
        type="text"
        :placeholder="selectedEngine.placeholder"
        @keydown="handleKeydown"
        @focus="inputFocused = true"
        @blur="inputFocused = false"
        @compositionstart="isComposing = true"
        @compositionend="isComposing = false"
      >
    </div>
    <transition name="zoom">
      <div
        v-if="engineListVisible"
        v-clickoutside="closeEngineList"
        class="engine-list"
        :style="{
          top: -activeEngineIndex * 38 + 'px'
        }"
      >
        <div
          v-for="engine in searchEngineConfig"
          :key="engine.name"
          :class="[
            'engine-item',
            engine.name === selectedEngineName ? 'active' : '',
          ]"
          @click="selectEngine(engine)"
        >
          <v-mdi :name="engine.icon" />
          {{ engine.label }}
        </div>
      </div>
    </transition>
    <transition name="zoom">
      <search-bookmark
        v-if="selectedEngineName === 'bookmark' && isActive && searchText.length"
        :searchText="searchText"
      />
    </transition>
  </div>
</template>

<script lang="ts" >
import { ref, Ref, computed, watch, nextTick, onUnmounted } from 'vue'
import { getAppConfigItem, setAppConfigItem } from '@/assets/ts/app-config'
import SearchBookmark from './search-bookmark.vue'

type searchEngine = {
  name: string,
  label: string,
  placeholder: string,
  url: string,
  icon: string,
}
const searchEngineConfig: searchEngine[] = [
  {
    name: 'baidu',
    label: '百度',
    placeholder: '百度一下，你就知道了。',
    url: 'https://www.baidu.com/s?ie=UTF-8&wd=[kw]',
    icon: 'mdi-paw',
  },
  {
    name: 'google',
    label: '谷歌',
    placeholder: '谷歌虽好，可不一定访问的了～',
    url: 'https://www.google.com/search?q=[kw]',
    icon: 'mdi-google',
  },
  {
    name: 'caniuse',
    label: 'Can I Use',
    placeholder: '前端兼容小字典！',
    url: 'https://www.caniuse.com/?search=[kw]',
    icon: 'mdi-layers-search',
  },
  {
    name: 'stackoverflow',
    label: 'StackOverflow',
    placeholder: '搜一搜歪果仁的技术讨论！',
    url: 'https://stackoverflow.com/search?q=[kw]',
    icon: 'mdi-stack-overflow',
  },
  {
    name: 'github',
    label: 'Github',
    placeholder: '来，我们一起偷代码～',
    url: 'https://github.com/search?q=[kw]',
    icon: 'mdi-github',
  },
  {
    name: 'npm',
    label: 'NPM',
    placeholder: '别硬撸了，找个好用的轮子吧！',
    url: 'https://www.npmjs.com/search?q=[kw]',
    icon: 'mdi-npm',
  },
  {
    name: 'bookmark',
    label: '书签',
    placeholder: '搜索书签名或网址...',
    url: '',
    icon: 'mdi-bookmark',
  },
]
function globalShortcut({
  setInputFocus,
} : {
  setInputFocus: () => void,
}) {
  const keydownListener = function (event: KeyboardEvent) {
    if ((event.ctrlKey || event.metaKey) && event.key === 'k') {
      setInputFocus()
    }
  }
  window.addEventListener('keydown', keydownListener)
  onUnmounted(() => {
    window.removeEventListener('keydown', keydownListener)
  })
}
export default {
  name: 'SearchEntrance',
  components: { SearchBookmark },
  emits: ['focus', 'blur'],
  setup(props, context) {
    const inputRef: Ref<null | HTMLInputElement> = ref(null)
    const selectedEngineName = ref(getAppConfigItem('searchEngineName'))
    const searchText = ref('')
    const engineListVisible = ref(false)
    const inputFocused = ref(false)
    const isComposing = ref(false)

    const isActive = ref(false)
    let delay: number | null = null
    watch([engineListVisible, inputFocused], () => {
      delay && clearTimeout(delay)
      delay = setTimeout(() => {
        const isFocus = engineListVisible.value || inputFocused.value
        context.emit(isFocus ? 'focus' : 'blur')
        isActive.value = isFocus
      }, 140)
    })
    const setInputFocus = () => {
      const inputNode = inputRef.value as HTMLInputElement | null
      if (inputNode) {
        inputNode.focus()
      }
    }
    const selectedEngine = computed(() => {
      return (
        searchEngineConfig.filter(
          (engine) => engine.name === selectedEngineName.value
        )[0] || searchEngineConfig[0]
      )
    })
    const activeEngineIndex = computed(() => {
      for (let i = 0; i < searchEngineConfig.length; i++) {
        if (searchEngineConfig[i].name === selectedEngineName.value) {
          return i
        }
      }
      return -1
    })
    const showEngineList = () => {
      setInputFocus()
      if (engineListVisible.value) {
        return
      }
      nextTick(() => {
        engineListVisible.value = true
      })
    }
    const closeEngineList = () => {
      engineListVisible.value = false
    }
    const inputBlur = () => {
      const inputNode = inputRef.value as HTMLInputElement | null
      if (inputNode) {
        inputNode.blur()
      }
    }
    function handleSearch() {
      if (!selectedEngine.value.url) {
        return
      }
      let searhKeyword = encodeURIComponent(searchText.value)
      searchText.value = ''
      window.open(selectedEngine.value.url.replace('[kw]', searhKeyword))
      inputBlur()
    }
    function handleSwitchEngine(direct: number) {
      let nextIndex: number = -1 
      const currentIndex = activeEngineIndex.value
      const engineCount = searchEngineConfig.length
      if (currentIndex === engineCount - 1 && direct > 0) {
        nextIndex = 0
      } else if (currentIndex === 0 && direct < 0) {
        nextIndex = engineCount - 1
      } else {
        nextIndex = currentIndex + (direct > 0 ? 1 : -1)
      }
       selectedEngineName.value = searchEngineConfig[nextIndex].name
    }
    globalShortcut({
      setInputFocus,
    })
    return {
      inputRef,
      searchEngineConfig,
      selectedEngineName,
      selectedEngine,
      activeEngineIndex,
      searchText,
      engineListVisible,
      inputFocused,
      isActive,
      isComposing,
      selectEngine(engine: searchEngine) {
        setInputFocus()
        selectedEngineName.value = engine.name
        setAppConfigItem('searchEngineName', engine.name)
        closeEngineList()
      },
      showEngineList,
      closeEngineList,
      handleKeydown(e: KeyboardEvent) {
        if (isComposing.value) {
          return
        }
        switch(e.key) {
          case 'ArrowUp':
            engineListVisible.value = true
            handleSwitchEngine(-1)
            break;
          case 'ArrowDown':
            engineListVisible.value = true
            handleSwitchEngine(1)
            break;
          case 'Enter':
            handleSearch()
            break;
          case 'Escape':
            closeEngineList()
            inputBlur()
          default:
            closeEngineList()
        }
      },
    }
  },
}
</script>
