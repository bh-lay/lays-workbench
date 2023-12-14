<style lang="stylus" scoped>

</style>

<template>
  <desktop-item-editor
    v-if="createMode"
    :only-edit-mode="true"
    :desktop="newDesktop"
    confirm-label="创建"
    @confirm="handelConfirm"
    @cancel="createMode = false"
  />
  <div
    v-else
    style="height: 50px;text-align: right;"
  >
    <v-button @click="createMode = true">
      创建桌面
    </v-button>
  </div>
</template>

<script setup lang="ts">
import { Ref, ref } from 'vue'
import { Bookmark, BookmarkSystemId, BookmarkType } from '@/database/entity/bookmark'
import DesktopItemEditor from './desktop-item-editor.vue'
import { bookmarkInsertService } from '@/database/services/bookmark-service'

const createMode = ref(false)
const emits = defineEmits(['after-create'])
const newDesktop: Ref<Bookmark> = ref(new Bookmark({
  parent: BookmarkSystemId.desktop,
  type: BookmarkType.folder,
  value: '{"wallpaper": "https://w.wallhaven.cc/full/nz/wallhaven-nzkggo.jpg"}',
}))
async function handelConfirm({name, undercoat}: {name: string, undercoat: string}) {
  newDesktop.value.name = name
  newDesktop.value.undercoat = undercoat
  await bookmarkInsertService(newDesktop.value)
  emits('after-create')
}
</script>
