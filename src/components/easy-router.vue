<template>
  <modal v-model="privateBookmarksVisible" width="80%" height="80%" @after-close="resetRouter">
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
</template>

<script>
import { ref, onBeforeUnmount } from 'vue'
import PrivateBookmarks from '@/components/private-bookmarks/index.vue'
import WallpaperGallery from '@/components/wallpaper-gallery/index.vue'
function parseRouter() {
  const hash = location.hash.replace(/^\#/, '')
  if (!hash) {
    return null
  }
  const hashSplit = hash.split(':')
  if (hashSplit.length !== 2) {
    return null
  }
  return {
    type: hashSplit[0],
    detail: hashSplit[1],
  }
}
export default {
  components: {
    PrivateBookmarks,
    WallpaperGallery,
  },
  setup() {
    const privateBookmarksVisible = ref(false)
    const wallpaperGalleryVisible = ref(false)
    function renderRouterByHash() {
      const params = parseRouter()
      console.log('params', params)
      if (!params) {
        return
      }
      if (params.type === 'widgets') {
        switch(params.detail) {
          case 'private-bookmark':
            privateBookmarksVisible.value = true
          break
        }
      } else if (params.type === 'settings') {
        switch(params.detail) {
          case 'wallpaer':
            wallpaperGalleryVisible.value = true
          break
        }
      }
    }
    
    renderRouterByHash()
    window.addEventListener('hashchange', renderRouterByHash)
    onBeforeUnmount(() => {
      window.removeEventListener('hashchange', renderRouterByHash)
    })
    return {
      privateBookmarksVisible,
      wallpaperGalleryVisible,
      resetRouter() {
        location.hash = ''
      }
    };
  },
};
</script>
