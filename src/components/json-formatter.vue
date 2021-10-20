<style lang="stylus" scoped>
.json-formatter
  display flex
  flex-direction column
  height 100%
  .caption
    height 40px
    border-bottom 1px solid #eee
    text-align center
    line-height 40px
    font-size 18px
    color #666
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
      resize none
      background #f6f6f6
      transition .15s
      &:focus
        outline none
        background #eaeaea
.json-formatter-content
  box-sizing border-box
  flex-grow 1
  width 100px
  height 100%
  padding 20px
  overflow auto
</style>

<template>
  <div class="json-formatter">
    <div class="caption">
      JSON 格式化
    </div>
    <div class="content">
      <div class="half">
        <textarea cols="30" rows="10" v-model="sourceJson" ></textarea>
      </div>
      <div class="json-formatter-content" ref="fomatter"></div>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue';
import JSONFormatter from 'json-formatter-js'
function parseJSON(str) {
  try{
    eval('window.jsonFormatterTemp=' + str)
    const result = window.jsonFormatterTemp
    delete window.jsonFormatterTemp
    return result
  } catch (e) {
    console.log('e', e)
    return str
  }
}
export default {
  setup() {
    const sourceJson = ref('')
    return {
      sourceJson
    };
  },
  watch: {
    sourceJson() {
      const formatter = new JSONFormatter(parseJSON(this.sourceJson))
      this.$refs.fomatter.innerHTML = ''
      this.$refs.fomatter.appendChild(formatter.render())
      // console.log('sourceJson', )
    },
  },
};
</script>
