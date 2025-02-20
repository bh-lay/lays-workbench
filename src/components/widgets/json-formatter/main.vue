<style lang="stylus" scoped>
.json-formatter
  display flex
  gap 16px
  height 100%

  .origin-content
    position relative
    box-sizing border-box
    display flex
    flex-direction column
    flex-grow 1
    width 100px
    height 100%
    padding 10px
    background rgba(0, 0, 0, .1)
    border-radius 8px
    .caption
      height 40px
      padding 0 8px
      line-height 30px
      font-size 15px
      color #bbb
    textarea
      display block
      box-sizing border-box
      width 100%
      height 100px
      flex-grow 1
      padding 20px
      border none
      resize none
      font-size 12px
      line-height 1.5
      font-family monospace
      color #a2a2ae
      border-radius 4px
      background rgba(0, 0, 0, .2)
      transition .15s
      &:focus
        outline none
        background #1c1c21
.json-formatter-content
  box-sizing border-box
  flex-grow 1.4
  width 100px
  padding 15px
  line-height: 1.8
  font-size 16px
  border-radius 8px
  overflow auto
  transition .6s .15s
  & > :deep(div)
    // 使用滤镜兼容暗色模式
    filter invert(1) contrast(0.8)
  &:hover
    background rgba(0, 0, 0, .1)
:deep(.json-formatter-row .json-formatter-toggler)
  display inline-block
  width 20px
  height 20px
  padding 0
  text-align center
  font-family serif
  color #999
  &:hover
    color #000
:deep(.json-formatter-row .json-formatter-row)
  margin-left 1.3em

@media screen and (max-width:600px)
  .json-formatter .content
    flex-direction column
</style>

<template>
  <div class="json-formatter">
    <div class="origin-content">
      <div class="caption">
        JSON 格式化
      </div>
      <textarea
        v-model="sourceJson"
        cols="30"
        rows="10"
        spellcheck="false"
      />
    </div>
    <div
      ref="fomatterRef"
      class="json-formatter-content"
    />
  </div>
</template>

<script lang="ts">
import { Ref, ref, watch, onMounted } from 'vue'
import JSONFormatter from 'json-formatter-js'
const defaultText = `{
  auth: "剧中人",
  gender: "male",
  website: "http://bh-lay.com",
  hobbies: ["photography", "coding"]
}`
function parseJSONByString(str: string) {
  try {
    return (new Function('', `return ${str}`))()
  } catch (e) {
    return null
  }
}
function parseJSONByStringfy(str: string) {
  try {
    return (new Function('', `return JSON.parse(${str})`))()
  } catch (e) {
    return null
  }
}
function parseJSON(str: string) {
  const firstTryResult = parseJSONByStringfy(str)
  if (firstTryResult) {
    return firstTryResult
  }
  const secondTryResult = parseJSONByString(str)
  if (secondTryResult) {
    return secondTryResult
  }
  return str
}
const localStorageKey = 'widget-json-formatter'
function writeToLocal(newValue: string) {
  if (newValue) {
    localStorage.setItem(localStorageKey, newValue)
  } else {
    localStorage.removeItem(localStorageKey)
  }
}
function readFromLocal() {
  const newValue = localStorage.getItem(localStorageKey)
  return newValue || ''
}
export default {
  name: 'JsonFormatterWidgets',
  setup() {
    const sourceJson = ref('')
    const fomatterRef: Ref<HTMLDivElement | null> = ref(null)
    function render() {
      const formatter = new JSONFormatter(parseJSON(sourceJson.value))
      const fomatterNode = fomatterRef.value
      if (!fomatterNode) {
        return
      }
      fomatterNode.innerHTML = ''
      fomatterNode.appendChild(formatter.render())
    }

    watch(sourceJson, () => {
      render()
      writeToLocal(sourceJson.value)
    })
    onMounted(() => {
      const localValue = readFromLocal()
      sourceJson.value = localValue || defaultText
      render()
    })
    return {
      fomatterRef,
      sourceJson,
    }
  },
}
</script>
