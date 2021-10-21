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
      width 100%
      height 100%
    textarea
      display block
      box-sizing border-box
      width 100%
      height 100%
      padding 20px
      border none
      resize none
      font-size 14px
      background #f6f6f6
      transition .15s
      &:focus
        outline none
        background #eaeaea
.json-formatter-content
  box-sizing border-box
  flex-grow 1
  width 100%
  height 100%
  padding 20px 20px 20px 30px
  line-height: 1.2
  font-size 14px
  overflow auto
:global(.json-formatter-row .json-formatter-toggler)
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
    return (new Function("", "return " + str))()
  } catch (e) {
    console.log('e', e)
    return str
  }
}
export default {
  setup() {
    const sourceJson = ref(`{
  auth: "剧中人",
  gender: "male",
  website: "http://bh-lay.com",
  hobbies: ["photography", "coding"]
}`)
    return {
      sourceJson
    };
  },
  watch: {
    sourceJson() {
      this.render()
    },
  },
  mounted() {
    this.render()
  },
  methods: {
    render() {
      const formatter = new JSONFormatter(parseJSON(this.sourceJson))
      this.$refs.fomatter.innerHTML = ''
      this.$refs.fomatter.appendChild(formatter.render())
    },
  },
};
</script>
