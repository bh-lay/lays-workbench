<style lang="stylus" scoped>
.json-formatter
  display flex
  flex-direction column
  height 100%
  background #26262c
  .caption
    height 50px
    background #2b2b31
    border-bottom 1px solid #212126
    text-align center
    line-height 50px
    font-size 16px
    color #777
  .content
    display flex
    height 100px
    flex-grow 1
    .half
      position relative
      flex-grow 1
      width 100px
      height 100%
    textarea
      display block
      box-sizing border-box
      width 100%
      height 100%
      padding 20px
      border none
      border-right 1px solid #3e3e47
      resize none
      font-size 12px
      font-family monospace
      color #a2a2ae
      background transparent
      transition .15s
      &:focus
        outline none
        background #1c1c21
.json-formatter-content
  box-sizing border-box
  flex-grow 1.4
  width 100px
  height 100%
  padding 20px 20px 20px 30px
  // 临时使用滤镜兼容暗色模式
  filter invert(1) contrast(0.8)
  line-height: 1.5
  font-size 16px
  overflow auto
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

@media screen and (max-width:600px)
  .json-formatter .content
    flex-direction column
</style>

<template>
  <div class="json-formatter">
    <div class="caption">
      JSON 格式化
    </div>
    <div class="content">
      <div class="half">
        <textarea
          v-model="sourceJson"
          cols="30"
          rows="10"
        />
      </div>
      <div
        ref="fomatterRef"
        class="json-formatter-content"
      />
    </div>
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
