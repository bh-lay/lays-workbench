<template>
  <desktop-item-editor
    v-if="createMode"
    :only-edit-mode="true"
    :desktop="newDesktop"
    @confirm="handelConfirm"
    @cancel="createMode = false"
  />
  <div
    v-else
    style="text-align: center;"
  >
    <v-button
      style="width: 100%"
      type="primary"
      @click="createMode = true"
    >
      <v-mdi
        name="mdi-plus"
        size="18"
      />
    </v-button>
  </div>
</template>

<script setup lang="ts">
import { Ref, ref } from 'vue'
import { Bookmark, BookmarkSystemId, BookmarkType, generateID } from '@/database/entity/bookmark'
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
  createMode.value = false
  newDesktop.value.id = generateID()
  newDesktop.value.name = name
  newDesktop.value.undercoat = undercoat
  await bookmarkInsertService(newDesktop.value)
  newDesktop.value.name = ''
  emits('after-create')
}
</script>
