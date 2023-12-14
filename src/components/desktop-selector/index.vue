<style lang="stylus" scoped>
@import '../../assets/stylus/vars/colors.styl'
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
    transition .3s .2s
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
  background $card-bg-color
  color #949eb3

</style>

<template>
  <v-dropdown
    class="desktop-selector"
    type="plain"
    placement="bottom-left"
  >
    <div v-if="activeDesktop">
      <span
        class="desktop-color-dot"
        :style="{
          background: activeDesktop.undercoat
        }"
      />
      <span class="desktop-name">{{ activeDesktop.name }}</span>
    </div>
    <span v-else>无桌面</span>
    <v-mdi
      name="mdi-tune"
      size="16"
      @click.stop="editModalVisible = true"
    />
    <template #body>
      <div class="about-layer">
        <v-dropdown-item
          v-for="desktop in desktopList"
          :key="desktop.id"
          :active="modelValue === desktop.id"
          @click="switchActiveDesktop(desktop.id)"
        >
          <span
            class="desktop-color-dot"
            :style="{
              background: desktop.undercoat
            }"
          />
          <span class="desktop-name">{{ desktop.name }}</span>
        </v-dropdown-item>
      </div>
    </template>
  </v-dropdown>
  <v-modal
    v-model="editModalVisible"
    :width="450"
    title="桌面管理"
  >
    <desktop-editor
      :desktop-list="desktopList"
      @after-desktop-changed="handleDesktopChanged"
    />
  </v-modal>
</template>

<script setup lang="ts">
import {
  ref,
  Ref,
  onMounted,
  watch,
} from 'vue'
import { Bookmark, BookmarkSystemId } from '@database/entity/bookmark'
import { bookmarkListService } from '@database/services/bookmark-service'
import DesktopEditor from './desktop-editor.vue'

const activeDesktop: Ref<Bookmark | null> = ref(null)
const desktopList: Ref<Bookmark[]> = ref([])
const editModalVisible: Ref<boolean> = ref(false)
const props = defineProps({
  modelValue: {
    type: String,
    default: '',
  },
})
const emits = defineEmits(['update:modelValue'])

function getActiveDeskptopByProps() {
  activeDesktop.value = desktopList.value.find(item => item.id === props.modelValue) || null
}
async function getDesktopList() {
  desktopList.value = await bookmarkListService({
    parent: BookmarkSystemId.desktop,
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
watch(
  () => props.modelValue,
  () => {
    getActiveDeskptopByProps()
  }
)
onMounted(async () => {
  await getDesktopList()
  getActiveDeskptopByProps()
  if (!props.modelValue || !activeDesktop.value) {
    automaticSelectFirstDesktop()
  }
})

async function handleDesktopChanged() {
  await getDesktopList()
  getActiveDeskptopByProps()
  if (!props.modelValue || !activeDesktop.value) {
    automaticSelectFirstDesktop()
  }
}
</script>
