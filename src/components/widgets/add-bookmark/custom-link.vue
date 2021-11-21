<style lang="stylus" scoped>
.custom-link
  padding 20px 0
.input-item
  margin-bottom 20px
  .label
    height 14px
    margin-bottom 6px
    line-height 14px
    font-size 14px
  input
    box-sizing border-box
    width 100%
    height 40px
    padding 0 10px
    border 1px solid #eee
    font-size 14px
.preview-area
  height 200px
  background: #aaa
</style>

<template>
  <div class="custom-link">
    <div class="input-item">
      <div class="label">名称</div>
      <input type="text" placeholder="请输入链接名称" />
    </div>
    <div class="input-item">
      <div class="label">链接地址</div>
      <input type="text" placeholder="请输入链接地址" />
    </div>
    <div class="input-item">
      <div class="label">图标</div>
      <div class="color-selector">
        图标选择器
      </div>
    </div>
    <div class="input-item">
      <div class="label">底色</div>
      
      <dropdown>
        {{ selectedUndercoat }}
        <template v-slot:body>
          <color-selector v-model:active="selectedUndercoat" />
        </template>
      </dropdown>
      
    </div>
    <div class="preview-area"></div>
  </div>
</template>

<script>
import ColorSelector from './color-selector.vue'
import { ref } from 'vue';
export default {
  components: { ColorSelector },
  setup() {
    const selectedUndercoat = ref('#9D2932')
    return {
      selectedUndercoat,
    }
  },
};
</script>
