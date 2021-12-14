<template>
  <modal
    v-model="privateBookmarksVisible"
    width="80%"
    height="80%"
    @after-close="resetRouter"
  >
    <private-bookmarks />
  </modal>
  <modal
    v-model="wallpaperGalleryVisible"
    width="80%"
    height="80%"
    undercoat="transparent"
    @after-close="resetRouter"
  >
    <wallpaper-gallery />
  </modal>
  <modal
    v-model="jsonFormatterVisible"
    width="80%"
    height="80%"
    @after-close="resetRouter"
  >
    <json-formatter />
  </modal>
</template>

<script>
import { ref, onBeforeUnmount } from 'vue'
import PrivateBookmarks from '@/components/private-bookmarks/index.vue'
import WallpaperGallery from '@/components/wallpaper-gallery/index.vue'
import JsonFormatter from '@/components/widgets/json-formatter/main.vue'
import { onRouterChange } from '@/assets/ts/router'
export default {
  components: {
    PrivateBookmarks,
    WallpaperGallery,
    JsonFormatter,
  },
  setup() {
    const privateBookmarksVisible = ref(false)
    const wallpaperGalleryVisible = ref(false)
    const jsonFormatterVisible = ref(false)
    
    let unbindRouterListener = onRouterChange((moduleType, moduleName, state) => {
      if (moduleType === 'widgets') {
        switch(moduleName) {
          case 'private-bookmark':
            privateBookmarksVisible.value = true
          break
          case 'json-formatter':
            jsonFormatterVisible.value = true
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
      resetRouter() {
        history.replaceState({}, '', location.pathname)
      }
    };
  },
};
</script>
