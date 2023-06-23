<style lang="stylus" scoped>
.desktop-selector
  height 34px
  padding 0 6px 0 15px
  display flex
  align-items center
  cursor pointer
  transition .15s
  .mdi-icon
    padding 3px
    margin-left 5px
    border-radius 4px
    color #c2c9d6
    opacity 0
    transition .2s
    &:hover
      background #333b4d
    &:active
      background #181d25

  &:hover
    background #252b37
    .mdi-icon
      opacity 1
  &.active
    background #181d25
.desktop-color-dot
  display inline-block
  width 6px
  height 6px
  border-radius 3px
  vertical-align middle
.desktop-name
  display inline-block
  vertical-align middle
  max-width 10em
  padding-left 6px
  white-space nowrap
  text-overflow ellipsis
  overflow hidden
  line-height 34px
  font-size 12px
  color #c2c9d6
.about-layer
  // padding 20px 26px 50px
  background #3e4451
  color #949eb3

</style>

<template>
  <v-dropdown
    class="desktop-selector"
    type="plain"
    placement="bottom-left"
  >
    <div v-if="activeDesktop">
      <span class="desktop-color-dot" :style="{
        background: activeDesktop.undercoat
      }"></span>
      <span class="desktop-name">{{ activeDesktop.name }}</span>
    </div>
    <span v-else>无桌面</span>
    <v-mdi
      name="mdi-tune"
      size="16"
      @click.stop="handleClickSettings"
    />
    <template #body>
      <div class="about-layer">
        <v-dropdown-item
          v-for="desktop in desktopList"
          :key="desktop.id"
          :active="modelValue === desktop.id"
          @click="switchActiveDesktop(desktop.id)"
        >
          <span class="desktop-color-dot" :style="{
            background: desktop.undercoat
          }"></span>
          <span class="desktop-name">{{ desktop.name }}</span>
        </v-dropdown-item>
      </div>
    </template>
  </v-dropdown>
</template>

<script setup lang="ts">
import {
  ref,
  Ref,
  onMounted,
  watch,
} from 'vue'
import { Message } from '@/ui-lib/message/index'
import { Bookmark, BookmarkSystemId } from '@database/entity/bookmark'
import { bookmarkListService } from '@database/services/bookmark-service'

const activeDesktop: Ref<Bookmark | null> = ref(null)
const desktopList: Ref<Bookmark[]> = ref([])

const props = defineProps({
  modelValue: {
    type: String,
    default: false,
  },
})
const emits = defineEmits(['update:modelValue'])

function getActiveDeskptopByProps() {
  activeDesktop.value = desktopList.value.find(item => item.id === props.modelValue) || null
}
const getDesktopList = function () {
  return bookmarkListService({
    parent: BookmarkSystemId.desktop,
  }).then((list) => {
    desktopList.value = list
  })
}
function automaticSelectFirstDesktop () {
  if (desktopList.value.length === 0) {
    return
  }
  switchActiveDesktop(desktopList.value[0].id)
}
function switchActiveDesktop(bookmarkId: string) {
  emits('update:modelValue', bookmarkId)
}
function handleClickSettings() {
  new Message({
    message: '新增、修改桌面正在开发中，请稍后 ！',
  })
}
watch(
  () => props.modelValue,
  () => {
    getActiveDeskptopByProps()
  }
)
onMounted(() => {
  getDesktopList().then(() => {
    getActiveDeskptopByProps()
    if (!props.modelValue || !activeDesktop.value) {
      automaticSelectFirstDesktop()
    }
  })
})
</script>
