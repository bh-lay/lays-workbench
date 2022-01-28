<style lang="stylus" scoped>
.triangle-maker
  display flex
  width 100%
  height 100%
.editor
  width 220px
  padding 50px 20px
  background #405f77
.title
  margin-bottom 20px
  font-size 28px
  color #afc4d4
.label
  margin 20px 0 5px
  font-size 14px
  color #afc4d4
.main
  display flex
  flex-direction column
  width 100px
  flex-grow 1
.preview
  display flex
  align-items center
  justify-content center
  height 100px
  flex-grow 1
  background-image linear-gradient(45deg, rgba(0,0,0,.25) 25%, transparent 0, transparent 75%, rgba(0,0,0,.25) 0),linear-gradient(45deg, rgba(0,0,0,.25) 25%, transparent 0, transparent 75%, rgba(0,0,0,.25) 0)
  background-position 0 0, 10px 10px
  background-size 20px 20px
.code
  padding 50px 80px 70px
  line-height 1.5
  white-space pre
  font-family monospace
  font-size 18px
  color #b1bcd2
  -webkit-touch-callout text
  -webkit-user-select text
  -khtml-user-select text
  -moz-user-select text
  -ms-user-select text
  user-select text
</style>

<template>
  <div class="triangle-maker">
    <div class="editor">
      <div class="title">
        三角形生成器
      </div>
      <div class="label">
        选择方向
      </div>
      <triangle-selector
        v-model="selectedIndex"
        @selected="handleSelected"
      />
      <div class="label">
        尺寸调整
      </div>
      {{ value1 }}
      <v-slider
        v-model="value1"
        :min="2"
        :max="30"
        :step="1"
      />
      <v-slider
        v-model="value2"
        :min="2"
        :max="30"
        :step="1"
      />
      <v-slider
        v-model="value3"
        :min="2"
        :max="30"
        :step="1"
      />
    </div>
    <div class="main">
      <div
        ref="previewRef"
        class="preview"
      />
      <div
        ref="codeRef"
        class="code"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { Ref, ref, watch, onMounted } from 'vue'
import TriangleSelector from './triangle-selector.vue'
import { getTriCssTemplate } from './consts'
export default {
  name: 'TriangleMakerWidgets',
  components: { TriangleSelector },
  props: {
    defaultIndex: {
      type: Number,
      default: 3,
    },
  },
  setup(props) {
    const selectedIndex = ref(props.defaultIndex)
    const previewRef: Ref<HTMLElement | null> = ref(null)
    const codeRef: Ref<HTMLElement | null> = ref(null)
    const value1 = ref(70)
    const value2 = ref(50)
    const value3 = ref(70)
    function updateTriangleType(value: number) {
      const template = getTriCssTemplate(value - 1)
      const previewNode = previewRef.value
      const codeNode = codeRef.value
      if (!previewNode || !codeNode) {
        return
      }
      previewNode.innerHTML = `<div style="${template}"></div>`
      codeNode.innerHTML = template
    }
    watch(selectedIndex, updateTriangleType)
    onMounted(function () {
      updateTriangleType(selectedIndex.value)
    })

    return {
      value1,
      value2,
      value3,
      previewRef,
      codeRef,
      selectedIndex,
      handleSelected(index: number) {
        console.log('index', index)
      },
    }
  },
}
</script>
