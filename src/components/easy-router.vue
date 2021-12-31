<template>
  <v-modal
    v-model="privateBookmarksVisible"
    width="80%"
    height="80%"
    @after-close="resetRouter"
  >
    <private-bookmarks />
  </v-modal>
  <v-modal
    v-model="wallpaperGalleryVisible"
    width="80%"
    height="80%"
    undercoat="transparent"
    @after-close="resetRouter"
  >
    <wallpaper-gallery />
  </v-modal>
  <v-modal
    v-model="jsonFormatterVisible"
    width="80%"
    height="80%"
    @after-close="resetRouter"
  >
    <json-formatter />
  </v-modal>
  <v-modal
    v-model="regVisualVisible"
    width="80%"
    height="80%"
    @after-close="resetRouter"
  >
    <reg-visual :reg-text="regText" />
  </v-modal>
  <v-modal
    v-model="imgToBaseVisible"
    width="80%"
    height="80%"
    @after-close="resetRouter"
  >
    <image-to-base :file="imgToBaseFile" />
  </v-modal>
</template>

<script lang="ts">
import { ref, Ref, onBeforeUnmount } from 'vue'
import { onRouterChange } from '@/assets/ts/router'
import PrivateBookmarks from '@/components/private-bookmarks/index.vue'
import WallpaperGallery from '@/components/wallpaper-gallery/index.vue'
import JsonFormatter from '@/components/widgets/json-formatter/main.vue'
import RegVisual from '@/components/widgets/reg-visual/main.vue'
import ImageToBase from '@/components/widgets/img-to-base/main.vue'
export default {
  components: {
    PrivateBookmarks,
    WallpaperGallery,
    JsonFormatter,
    RegVisual,
    ImageToBase,
  },
  setup() {
    const privateBookmarksVisible = ref(false)
    const wallpaperGalleryVisible = ref(false)
    const jsonFormatterVisible = ref(false)
    const regVisualVisible = ref(false)
    const regText = ref('')
    const imgToBaseVisible = ref(false)
    const imgToBaseFile: Ref<File | null> = ref(null)

    let unbindRouterListener: (() => void) | null = onRouterChange((moduleType, moduleName, state) => {
      if (moduleType === 'widgets') {
        switch(moduleName) {
        case 'private-bookmark':
          privateBookmarksVisible.value = true
          break
        case 'json-formatter':
          jsonFormatterVisible.value = true
          break
        case 'reg-visual':
          regVisualVisible.value = true
          regText.value = state.regText as string || ''
          break
        case 'img-to-base':
          imgToBaseVisible.value = true
          imgToBaseFile.value = state.file as File || null
          break
        }
      } else if (moduleType === 'settings') {
        switch(moduleName) {
        case 'wallpaper':
          wallpaperGalleryVisible.value = true
          break
        }
      }
    }, true)
    onBeforeUnmount(() => {
      if (unbindRouterListener) {
        unbindRouterListener()
        unbindRouterListener = null
      }
    })
    return {
      privateBookmarksVisible,
      wallpaperGalleryVisible,
      jsonFormatterVisible,
      regVisualVisible,
      regText,
      imgToBaseVisible,
      imgToBaseFile,
      resetRouter() {
        regText.value = ''
        imgToBaseFile.value = null
        history.replaceState({}, '', location.pathname)
      },
    }
  },
}
</script>
