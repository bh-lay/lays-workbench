<style lang="stylus" scoped>
.json-formatter
  display flex
  flex-direction column
  height 100%
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
      width 100%
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
      font-size 14px
      color #a2a2ae
      background transparent
      transition .15s
      &:focus
        outline none
        background #1c1c21
.json-formatter-content
  box-sizing border-box
  flex-grow 1
  width 100%
  height 100%
  padding 20px 20px 20px 30px
  // 临时使用滤镜兼容暗色模式
  filter contrast(0.5) brightness(1.5)
  line-height: 1.2
  font-size 14px
  overflow auto
:deep(.json-formatter-row .json-formatter-toggler)
    position absolute
    margin-left -15px

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
function parseJSON(str: string) {
  try{
    return (new Function('', 'return ' + str))()
  } catch (e) {
    console.log('e', e)
    return str
  }
}
export default {
  name: 'JsonFormatterWidgets',
  setup() {
    const sourceJson = ref(defaultText)
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
    })
    onMounted(() => {
      render()
    })
    return {
      fomatterRef,
      sourceJson,
    }
  },
}
</script>
