<style lang="stylus" scoped>
.search-entrance
  position relative
  width 90%
  max-width 600px
  margin-top 100px
  z-index 10
.search-input
  display flex
  height 56px
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
    height 56px
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
  svg
    display inline-block
    vertical-align middle
    width 18px
    height 18px
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
      >
    </div>
    <transition name="slidedown">
      <div
        v-if="engineListVisible"
        v-clickoutside="closeEngineList"
        class="engine-list"
      >
        <div
          v-for="engine in searchEngineConfig"
          :key="engine.name"
          :class="[
            'tab-item',
            engine.name === selectedEngineName ? 'active' : '',
          ]"
          @click="selectEngine(engine)"
        >
          <v-mdi :name="engine.icon" />
          {{ engine.label }}
        </div>
      </div>
    </transition>
  </div>
</template>

<script lang="ts" >
import { ref, computed, watch, nextTick } from 'vue'
import { getAppConfigItem, setAppConfigItem } from '@/assets/ts/app-config'

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
    label: 'caniuse',
    placeholder: '前端兼容小字典！',
    url: 'https://www.caniuse.com/?search=[kw]',
    icon: 'mdi-layers-search',
  },
  {
    name: 'stackoverflow',
    label: 'stackoverflow',
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
]
export default {
  setup(props, context) {
    const inputRef = ref(null)
    const selectedEngineName = ref(getAppConfigItem('searchEngineName'))
    const searchText = ref('')
    const engineListVisible = ref(false)
    const inputFocused = ref(false)

    const isActive = ref(false)
    let delay: number | null = null
    watch([engineListVisible, inputFocused], () => {
      delay && clearTimeout(delay)
      delay = setTimeout(() => {
        const isFocus = engineListVisible.value || inputFocused.value
        context.emit(isFocus ? 'focus' : 'blur')
        isActive.value = isFocus
      }, 200)
    })
    const setInputFocused = () => {
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
    const showEngineList = () => {
      setInputFocused()
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
    return {
      inputRef,
      searchEngineConfig,
      selectedEngineName,
      selectedEngine,
      searchText,
      engineListVisible,
      inputFocused,
      isActive,
      selectEngine(engine: searchEngine) {
        setInputFocused()
        selectedEngineName.value = engine.name
        setAppConfigItem('searchEngineName', engine.name)
        closeEngineList()
      },
      showEngineList,
      closeEngineList,
      handleKeydown(e: KeyboardEvent) {
        if (e.key !== 'Enter') {
          return
        }
        let searhKeyword = encodeURIComponent(searchText.value)
        searchText.value = ''
        window.open(selectedEngine.value.url.replace('[kw]', searhKeyword))
        const inputNode = inputRef.value as HTMLInputElement | null
        if (inputNode) {
          inputNode.blur()
        }
      },
    }
  },
}
</script>
