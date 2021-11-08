<style lang="stylus" scoped>
.imgtobase-main
  display flex
  flex-direction column
  box-sizing border-box
  height 100%
  padding 20px
button
  width 100px
  margin-bottom 10px
textarea
  display block
  box-sizing border-box
  width: 100%
  height 100px
  flex-grow 1
  padding 16px
  border 1px solid #eee
  line-height 1.2em
  font-size 12px
  color #444
  resize none
  spell-check none
</style>

<template>
  <div class="imgtobase-main">
    <button @click="copy">复制</button>
    <textarea
      v-model="value"
      ref="textarea"
      spellcheck="false"
    />
  </div>
</template>

<script>
export default {
  props: {
    base64Str: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      value: ''
    }
  },
  mounted() {
    this.value = this.base64Str
  },
  methods: {
    copy() {
      const textareaNode = this.$refs.textarea
      if (!textareaNode) {
        return
      }
      textareaNode.select()
      document.execCommand('Copy')
      alert('已复制到剪切板！')
    },
  },
};
</script>
