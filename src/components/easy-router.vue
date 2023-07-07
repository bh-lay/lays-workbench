<script lang="ts">
import { ref, h, onBeforeUnmount, nextTick, VNode } from 'vue'
import { routerState, onRouterChange } from '@/assets/ts/router'
import PrivateBookmarks from '@/components/private-bookmarks/index.vue'
import PublicBookmarks from '@/components/public-bookmarks/index.vue'
import WallpaperGallery from '@/components/wallpaper-gallery/index.vue'
import JsonFormatter from '@/components/widgets/json-formatter/main.vue'
import RegVisual from '@/components/widgets/reg-visual/main.vue'
import ImageToBase from '@/components/widgets/img-to-base/main.vue'
import TriangleMaker from '@/components/widgets/triangle-maker/main.vue'
import { FocalPlane } from  '@/ui-lib/index'

function createSubVNode(moduleType: string, moduleName: string, state: routerState): VNode | null {
  if (moduleType === 'widgets') {
    switch(moduleName) {
    case 'private-bookmarks':
      return h(PrivateBookmarks)
    case 'public-bookmarks':
      return h(PublicBookmarks)
    case 'json-formatter':
      return h(JsonFormatter)
    case 'reg-visual':
      return h(RegVisual, {
        regText: state.regText as string,
      })
    case 'img-to-base':
      return h(ImageToBase, {
        file: state.file as File,
      })
    case 'triangle-maker':
      return h(TriangleMaker, {
        defaultIndex: state.defaultIndex as number,
      })
    }
  } else if (moduleType === 'settings') {
    switch(moduleName) {
    case 'wallpaper':
      return h(WallpaperGallery)
    }
  }
  return null
}
export default {
  setup() {
    const modalVisible = ref(false)
    let activeComponent: VNode = h('div')
    // 监听路由变动
    let unbindRouterListener: (() => void) | null = onRouterChange((moduleType, moduleName, state) => {
      // 弹窗先隐藏，再选择性显示
      modalVisible.value = false
      const matchedComponentVNode = createSubVNode(moduleType, moduleName, state)
      if (matchedComponentVNode) {
        activeComponent = matchedComponentVNode
        nextTick(() => {
          modalVisible.value = true
        })
      }
    }, true)
    // 组件销毁时解除路由监听
    onBeforeUnmount(() => {
      if (unbindRouterListener) {
        unbindRouterListener()
        unbindRouterListener = null
      }
    })

    return function () {
      return h(
        FocalPlane,
        {
          width: '80%',
          height: '80%',
          closeOnPressEscape: true,
          modelValue: modalVisible.value,
          'onUpdate:modelValue'(visible: boolean) {
            modalVisible.value = visible
          },
          onAfterClose() {
            history.replaceState({}, '', location.pathname)
          },
        },
        () => {
          return activeComponent
        }
      )
    }
  },
}
</script>
