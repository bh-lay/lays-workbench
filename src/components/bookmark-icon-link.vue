<style lang="stylus" scoped>
.bookmark-icon
  display flex
  height 100%
  align-items center
  justify-content center
  cursor pointer
  transition filter .4s
  svg,
  img
    width 2.6em
    height 2.6em
    pointer-events none
  span
    font-size 1.6em
  &:hover
    filter brightness(0.8) grayscale(0.2) contrast(.7)
  &:active
    transition filter .2s
    filter brightness(0.3) grayscale(0.2) contrast(.7)
</style>

<template>
  <div
    class="bookmark-icon"
    :style="{
      color: textColor,
      background: undercoat
    }"
  >
    <v-mdi
      v-if="iconType === 'mdi'"
      :name="iconData"
    />
    <span v-else-if="iconType === 'text'" :style="{
      fontSize: (iconData || '').length > 3 ? '1.3em' : undefined
    }">{{ iconData }}</span>
    <template v-else>
      <transition name="fade-slow">
        <img
          v-if="faviconLoaded"
          :src="faviconUrl"
        >
      </transition>
    </template>
  </div>
</template>
<script lang="ts">
import { ref, watch } from 'vue'
import {
  anyColorToHsl,
  formatHslToHex,
} from '@/assets/ts/color-conversion'
import loadImage from '@/assets/ts/load-image'
import imgRobber from '@/assets/ts/img-robber'
import { BookmarkIcon } from '@/database/entity/bookmark'

function urlToFavicon(url: string) {
  const getfaviconUrl = `http://www.getfavicon.org/get.pl?url=${encodeURIComponent(url)}&submitget=get+favicon`
  return imgRobber(getfaviconUrl)
}
export default {
  props: {
    icon: {
      type: String,
      default: 'crab',
    },
    undercoat: {
      type: String,
      default: '#000',
    },
    url: {
      type: String,
      default: '',
    },
  },
  setup(props) {
    // 解析 icon 数据
    let iconType = ref('crab')
    let iconData = ref('')

    // 处理抓取图标逻辑
    let faviconLoaded = ref(false)
    let faviconUrl = ref('')
    function loadFavicon() {
      // 不是完整 url，不抓取
      if(!/^http(s|):\/\/[^.]+\.[^.]+/.test(props.url)) {
        return
      }
      faviconLoaded.value = false
      faviconUrl.value = urlToFavicon(props.url)
      loadImage(faviconUrl.value)
        .then(() => {
          faviconLoaded.value = true
        })
        .catch((error) => {
          console.log('error', error)
        })
    }
    function formatIconData(iconConfig: BookmarkIcon) {
      const iconSplit = (iconConfig || '').split(':')
      if (iconSplit[0] === 'mdi') {
        iconType.value = 'mdi'
        iconData.value = 'mdi-' + iconSplit[1]
      } else if (iconSplit[0] === 'text') {
        iconType.value = 'text'
        iconData.value = iconSplit[1]
      } else if (props.icon === 'crab') {
        iconType.value = 'crab'
        loadFavicon()
      }
    }
    watch(
      () => props.icon,
      (value: string) => {
        formatIconData(value as BookmarkIcon)
      },
      {
        immediate: true,
      }
    )

    const textColor = ref('#ffffff')
    watch(
      () => props.undercoat,
      (value) => {
        const [h, , l] = anyColorToHsl(value)
        if (l < 0.6) {
          // 区块亮度小于 60%，文本使用白色
          textColor.value = '#fff'
        } else {
          // 区块亮度大于等于 60%，文本使用和区块同色系的深色
          textColor.value = formatHslToHex(h, 0.2, 0.2)
        }
      },
      {
        immediate: true,
      }
    )
    watch(
      () => props.url,
      () => {
        if (iconType.value === 'crab'){
          loadFavicon()
        }
      }
    )
    return {
      iconType,
      iconData,
      faviconUrl,
      faviconLoaded,
      textColor,
    }
  },
}
</script>
