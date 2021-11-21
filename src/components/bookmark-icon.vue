<style lang="stylus" scoped>
.bookmark-icon
  display flex
  height 100%
  align-items center
  justify-content center
  cursor pointer
  transition .2s
  svg,
  img
    width 26px
    height 26px
    fill #fff
  &:hover
    background rgba(0, 0, 0, .2)
</style>

<template>
  <div class="bookmark-icon">
    <v-mdi v-if="iconType === 'mdi'" :name="iconData" />
    <span v-else-if="iconType === 'text'">{{ iconData }}</span>
    <template v-else>
      <transition name="fade-fast">
        <img v-if="faviconLoaded" :src="faviconUrl" />
      </transition>
    </template>
  </div>  
</template>
<script>
import { ref, watch } from "vue"
import loadImage from '../assets/js/load-image.ts'
export default {
  props: {
    icon: {
      type: String,
      default: 'crab'
    },
    url: {
      type: String,
      default: ''
    },
  },
  setup(props) {
    // 解析 icon 数据
    let iconType = ref('crab')
    let iconData = ref('')

    // 处理抓取图标逻辑
    let faviconLoaded = ref(false)
    let faviconUrl = ref('')
    function formatIconData(iconConfig) {
      const iconSplit = (iconConfig || '').split(':')
      if (iconSplit[0] === 'mdi') {
        iconType.value = 'mdi'
        iconData.value = 'mdi-' + iconSplit[1]
      } else if (iconSplit[0] === 'text') {
        iconType.value = 'text'
        iconData.value = iconSplit[1]
      } else if (props.icon === 'crab') {
        iconType.value = 'crab'
        faviconUrl = `http://www.getfavicon.org/get.pl?url=${encodeURIComponent(props.url)}&submitget=get+favicon`
        loadImage(faviconUrl)
          .then(() => {
            faviconLoaded.value = true
          })
          .catch(error => {
            console.log('error', error)
          })
      }
    }
    formatIconData(props.icon)
    watch(() => props.icon, value => {
      formatIconData(value)
    })
    return {
      iconType,
      iconData,
      faviconUrl,
      faviconLoaded,
    }
  },
};
</script>
