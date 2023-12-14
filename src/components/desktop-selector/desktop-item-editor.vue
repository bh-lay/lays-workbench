<style lang="stylus" scoped>
.desktop-item
  display flex
  align-items center
  gap 10px
  height 50px
.dropdown-button
  display flex
  justify-content center
  align-items center
  width 30px
  height  30px
  border-radius 4px
  &:hover
    background #252b37
  &.active
    background #181d25
.dot
  display inline-block
  width 6px
  height 6px
  border-radius 3px
  vertical-align middle
.desktop-name
  width 100px
  flex-grow 1
.desktop-name-text
  cursor text
  color #c2c9d6
  font-size 14px
</style>

<template>
  <div class="desktop-item">
    <v-dropdown type="plain">
      <div
        class="dot"
        :style="{
          background: desktopColor
        }"
      />
      <template #body>
        <color-selector
          v-model="desktopColor"
          @change="handConfirm"
        />
      </template>
    </v-dropdown>
    <template v-if="editMode">
      <v-input
        v-model="desktopName"
        v-focus
        v-drag-stop
        class="desktop-name"
        :maxlength="10"
        @keydown.enter="handConfirm"
      />
      <v-button
        type="primary"
        @click="handConfirm"
      >
        {{ confirmLabel }}
      </v-button>
      <v-button
        type="secondary"
        @click="handleCancel"
      >
        取消
      </v-button>
    </template>
    <div
      v-else
      class="desktop-name desktop-name-text"
      @click="editMode = true"
    >
      {{ desktop.name }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { Bookmark, BookmarkSystemId, BookmarkType, bookmarkOriginData } from '@/database/entity/bookmark'
import { PropType, Ref, ref, watch } from 'vue'
import ColorSelector from '@/components/add-bookmark/color-selector.vue'
import { bookmarkUpdateService } from '@/database/services/bookmark-service'
const props = defineProps({
  desktop: {
    type: Object as PropType<Bookmark>,
    default() {
      return new Bookmark({
        parent: BookmarkSystemId.desktop,
        type: BookmarkType.folder,
      })
    },
  },
  onlyEditMode: {
    type: Boolean,
    default: undefined,
  },
  confirmLabel: {
    type: String,
    default: '保存',
  },
})
const emits = defineEmits(['confirm', 'cancel', 'after-update'])
const editMode = ref(typeof props.onlyEditMode === 'boolean' && props.onlyEditMode)
const desktopName: Ref<string> = ref('')
const desktopColor: Ref<string> = ref('#f44336')
watch(
  () => props.desktop,
  (desktop) => {
    desktopName.value = desktop?.name || ''
    desktopColor.value = desktop?.undercoat || '#f44336'
  },
  {
    immediate: true,
  }
)

async function handConfirm() {
  if (typeof props.onlyEditMode === 'boolean' && props.onlyEditMode) {
    emits('confirm', {
      name: desktopName.value,
      undercoat: desktopColor.value,
    })
  } else {
    const desktopCloned = new Bookmark(Object.assign({}, props.desktop) as bookmarkOriginData)
    desktopCloned.name = desktopName.value
    desktopCloned.undercoat = desktopColor.value

    await bookmarkUpdateService(desktopCloned)
    emits('after-update', desktopCloned)
  }
  editMode.value = false
}
function handleCancel() {
  if (typeof props.onlyEditMode === 'boolean' && props.onlyEditMode) {
    emits('cancel')
  } else {
    editMode.value = false
  }
}
</script>
