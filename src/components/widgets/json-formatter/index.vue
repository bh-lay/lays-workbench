<style lang="stylus" scoped>
.formatter-widgets
  height 100%
  text-align center
  cursor pointer
  transition .2s
  &:hover
    background rgba(0, 0, 0, .2)
.icon
  padding 25px 0 15px
  svg
    width 32px
    height 32px
    fill #fff
.title
  margin-bottom 2px
  line-height 20px
  font-size 15px
  font-weight bold
  color #fff
.desc
  line-height 20px
  font-size 12px
  color rgba(255, 255, 255, .6)
</style>
<template>
  <div class="formatter-widgets" @click="jsonFormatterVisible = true">
    <div class="icon">
      <v-mdi name="mdi-code-json" />
    </div>
    <div class="title">JSON格式化</div>
    <div class="desc">数据查看好帮手</div>
  </div>
  <modal v-model:visible="jsonFormatterVisible" width="80%" height="80%" >
    <main-function />
  </modal>
</template>

<script>
import { ref } from "vue";
import MainFunction from './main.vue'
export default {
  components: { MainFunction },
  setup() {
    const jsonFormatterVisible = ref(false)
    return {
      jsonFormatterVisible,
    };
  },
};
</script>
