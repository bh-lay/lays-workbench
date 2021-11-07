<style lang="stylus" scoped>
.bookmark-icon
  line-height 50px
  text-align center
  svg
    vertical-align text-bottom
    fill #fff
</style>

<template>
  <div class="bookmark-icon">
    <v-mdi v-if="iconData.type === 'mdi'" :name="iconData.value" />
    <span v-else-if="iconData.type === 'text'">{{ iconData.value }}</span>
    <span v-else>crab</span>
  </div>  
</template>
<script>

export default {
  props: {
    icon: {
      type: String,
      default: 'crab'
    },
    
  },
  computed: {
    iconData() {
      const iconConfig = this.icon
      let returnsValue = {
          type: 'crab',
          value: ''
        }
      if (!iconConfig || iconConfig === 'crab') {
        return returnsValue
      }
      const iconSplit = iconConfig.split(':')
      if (iconSplit[0] === 'mdi') {
        returnsValue.type = 'mdi'
        returnsValue.value = 'mdi-' + iconSplit[1]
      } else if (iconSplit[0] === 'text') {
        returnsValue.type = 'text'
        returnsValue.value = iconSplit[1]
      }
      return returnsValue
    },
  },
};
</script>
