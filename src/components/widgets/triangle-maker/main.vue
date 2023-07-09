<style lang="stylus" scoped>
@import '../../../assets/stylus/functions/scrollbar.styl'
.triangle-maker
  display flex
  width 100%
  height 100%
.editor
  width 220px
  padding 10px 40px 30px 10px
  overflow auto
  scrollbar #405f77
.title
  margin-bottom 30px
  font-size 30px
.label
  margin 20px 0 10px
  font-size 14px
.isosceles
  float right
  height 26px
  margin-top -3px
  padding 0 5px
  line-height 26px
  font-size 12px
  border-radius 4px
  cursor pointer
  transition .2s
  svg,
  span
    display inline-block
    vertical-align text-bottom
    height 16px
  svg
    width 16px
    margin-right 4px
    fill transparent
  span
    line-height 16px
  &:hover
    background #476685
  &:active
    background #364f63
  &.active
    background #364f63
    svg
      fill currentColor
.slider-item
  margin 10px 0
  .value
    line-height 12px
    font-size 12px
    opacity .4
.color-input
  width 140px

.main
  display flex
  flex-direction column
  width 100px
  flex-grow 1
.preview-canvas
  position relative
  display flex
  align-items center
  justify-content center
  height 100px
  flex-grow 1
  overflow hidden
  background-image linear-gradient(45deg, rgba(200,200,200,.1) 25%, transparent 0, transparent 75%, rgba(200,200,200,.1) 0),linear-gradient(45deg, rgba(200,200,200,.1) 25%, transparent 0, transparent 75%, rgba(200,200,200,.1) 0)
  background-position 0 0, 10px 10px
  background-size 20px 20px
.triangle
  width 0
  height 0
  border-style solid
  transition .2s
.zoom-bar
  position absolute
  right 20px
  bottom 20px
  width 200px
  display flex
  align-items center
  .current
    width 40px
    font-size 12px
    opacity .5
  .v-slider
    width 10px
    flex-grow 1
    margin-right 10px
  .v-button
    padding 6px 10px
    font-size 12px
.code
  padding 50px 80px 70px
  overflow auto
  line-height 1.5
  white-space pre
  font-family monospace
  font-size 18px
  background rgba(200,200,200,.1)
  -webkit-touch-callout text
  -webkit-user-select text
  -khtml-user-select text
  -moz-user-select text
  -ms-user-select text
  user-select text
  scrollbar #26262c
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
        <div
          :class="{
            isosceles: true,
            active: customIsosceles,
          }"
          @click="customIsosceles = !customIsosceles"
        >
          <v-mdi name="mdi-check" />
          <span>等边三角形</span>
        </div>
      </div>
      <div class="slider-item">
        <div class="value">
          {{ customValue1 }}px
        </div>
        <v-slider
          v-model="customValue1"
          :min="2"
          :max="40"
          :step="1"
        />
      </div>
      <div
        v-if="!customIsosceles"
        class="slider-item"
      >
        <div class="value">
          {{ customValue2 }}px
        </div>
        <v-slider
          v-model="customValue2"
          :min="2"
          :max="40"
          :step="1"
        />
      </div>
      <div
        v-if="customValue3 > -1"
        class="slider-item"
      >
        <div class="value">
          {{ customValue3 }}px
        </div>
        <v-slider
          v-model="customValue3"
          :min="2"
          :max="40"
          :step="1"
        />
      </div>
      <div class="label">
        颜色
      </div>
      <v-input
        v-model="customColor"
        class="color-input"
        type="text"
      />
    </div>
    <div class="main">
      <div class="preview-canvas">
        <div
          class="triangle"
          :style="{
            borderWidth: screenBorderWidth,
            borderColor: screenBorderColor,
            transform: `scale(${zoomLevel / 100})`
          }"
        />
        <div class="zoom-bar">
          <div class="current">
            {{ zoomLevel }}%
          </div>
          <v-slider
            v-model="zoomLevel"
            :min="50"
            :max="800"
            :step="1"
          />
          <v-button @click="zoomLevel = 100">
            还原
          </v-button>
        </div>
      </div>
      <div class="code">
        <span>width: 0;<br>height: 0;<br>border-style: solid;<br>border-width: {{ screenBorderWidth }};<br>border-color: {{ screenBorderColor }};</span>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Ref, ref, watch } from 'vue'
import TriangleSelector from './triangle-selector.vue'
import { getTriCssTemplate, triTemplateMaker } from './consts'

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
    const customValue1 = ref(30)
    const customValue2 = ref(20)
    const customValue3 = ref(30)
    const zoomLevel = ref(400)
    const customColor = ref('#007bff')
    // 是否为等腰三角形
    const customIsosceles = ref(true)
    const screenBorderWidth: Ref<string> = ref('')
    const screenBorderColor: Ref<string> = ref('')
    let usedTriTemplate: triTemplateMaker | null = null
    function updateTriangleValue() {
      if (!usedTriTemplate) {
        return
      }
      if (customIsosceles.value) {
        customValue2.value = customValue1.value
      }
      screenBorderWidth.value = usedTriTemplate.borderWidth(customValue1.value, customValue2.value, customValue3.value)
      screenBorderColor.value = usedTriTemplate.borderColor(customColor.value)
    }
    watch(
      selectedIndex,
      function updateTriangleType(typeIndex: number) {
        usedTriTemplate = getTriCssTemplate(typeIndex - 1)
        if (!usedTriTemplate) {
          return
        }
        const [a, b, c] = usedTriTemplate.default()
        customValue1.value = a || 0
        customValue2.value = b || 0
        customValue3.value = c || 0
        screenBorderWidth.value = usedTriTemplate.borderWidth(customValue1.value, customValue2.value, customValue3.value)
        screenBorderColor.value = usedTriTemplate.borderColor(customColor.value)
      },
      {
        immediate: true,
      }
    )
    watch([customValue1, customValue2, customValue3, customColor, customIsosceles], updateTriangleValue)
    return {
      customValue1,
      customValue2,
      customValue3,
      customColor,
      customIsosceles,
      screenBorderWidth,
      screenBorderColor,
      selectedIndex,
      zoomLevel,
      handleSelected(index: number) {
        console.log('index', index)
      },
    }
  },
}
</script>
