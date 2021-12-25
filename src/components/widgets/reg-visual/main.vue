<style lang="stylus" scoped>
iframe
  width 100%
  height 100%
  border none
</style>

<template>
  <iframe
    :src="iframeSrc"
    visible="0"
  />
</template>

<script lang="ts">
export default {
  props: {
    regText: {
      type: String,
      default: '',
    },
  },
  setup(props) {
    let queryStr = ''
    let quickInputValue = props.regText
    if (quickInputValue && quickInputValue.length) {
      quickInputValue = quickInputValue.trim()
      if (/^\/.+\/$/.test(quickInputValue)) {
        quickInputValue = quickInputValue.replace(/^\/|\/$/g, '')
      }
      
      queryStr = `#!re=${encodeURIComponent(quickInputValue)}`
    }
    return {
      iframeSrc: '/regulex-legacy/index.html?v1' + queryStr,
    }
  },
}
</script>
