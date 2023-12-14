<style lang="stylus" scoped>
.gallery-item
  position relative
  width 280px
  aspect-ratio 2/1
  flex-grow 1
  background #26262c
  cursor pointer
  z-index 0
  transition .2s
  &:hover
    transform scale(1.1)
    box-shadow 1px 1px 3px rgba(0, 0, 0, .4), 1px 1px 10px rgba(0, 0, 0, .7)
    z-index 2
    a.from
      opacity 1
.img-container
  position relative
  height 100%
  background no-repeat center #444
  background-size cover
a.from
  position absolute
  right 15px
  bottom 15px
  padding 5px 10px
  display flex
  align-items center
  font-size 12px
  opacity 0
  transition opacity .5s .2s, background 0.2s
  .mdi-icon
    width 20px
    height 20px
    margin-right 5px
</style>

<template>
  <div class="gallery-item">
    <transition name="fade-slow">
      <div
        v-if="isImageLoaded"
        class="img-container"
        :style="styleValue"
        @click="$emit('selected')"
      />
    </transition>
    <v-button
      v-if="from"
      class="from"
      target="_blank"
      :href="from"
      type="primary"
    >
      <v-mdi name="mdi-link" />
      来源
    </v-button>
  </div>
</template>

<script lang="ts">
import { ref } from 'vue'
import loadImage from '@/assets/ts/load-image'
import imgRobber from '@/assets/ts/img-robber'

export default {
  name: 'SettingsWallpaperItem',
  props: {
    url: {
      type: String,
      default: '',
    },
    from: {
      type: String,
      default: '',
    },
  },
  emits: ['selected'],
  setup(props) {
    const usedUrl = imgRobber(props.url)
    const isImageLoaded = ref(false)

    loadImage(usedUrl)
      .then(() => {
        isImageLoaded.value = true
      })

    return {
      isImageLoaded,
      styleValue: {
        backgroundImage: `url(${usedUrl})`,
      },
    }
  },
}
</script>
