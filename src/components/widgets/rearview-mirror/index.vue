<style lang="stylus" scoped>
.rearview-mirror-widgets
  color #1b1c28
.prepare-layer-button
  display flex
  flex-direction column
  justify-content center
  align-items center
  height 100%
  cursor pointer
  background #d1eff5
  transition 0.2s
  &:hover
    background #535fc1
.prepare-layer
  display flex
  flex-direction column
  justify-content center
  align-items center
  height 100%
  background-image linear-gradient(170deg, #d1eff5, #6068a4)
  .title
    margin-bottom 4px
    line-height 20px
    font-size 16px
    font-weight bold
  .desc
    margin-bottom 10px
    line-height 20px
    font-size 12px
    opacity .7
  .v-button
    padding 6px 22px
</style>
<template>
  <div class="rearview-mirror-widgets">
    <template v-if="!isPlaying">
      <template v-if="widgetsSize === BookmarkSize.small">
        <div
          class="prepare-layer-button"
          @click="isPlaying = true"
        >
          <v-mdi name="mdi-eye" />
        </div>
      </template>
      <div
        v-else
        class="prepare-layer"
      >
        <div class="title">
          工位后视镜
        </div>
        <div class="desc">
          办公室行车安全小卫士
        </div>
        <v-button @click="isPlaying = true">
          开启
        </v-button>
      </div>
    </template>
    <Mirror
      v-else
      :size="widgetsSize"
      @request-close="isPlaying = false"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { Bookmark, BookmarkSize } from '@database/entity/bookmark'
import Mirror from './mirror.vue'
const props = defineProps({
  data: {
    type: Bookmark,
    default() {
      return new Bookmark({})
    },
  },
})
const widgetsSize = computed(() => props.data.size)
const isPlaying = ref(false)
</script>
