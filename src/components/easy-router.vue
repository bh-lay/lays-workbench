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
import { FocalPlane } from '@/ui-lib/index'

function createSubVNode(moduleType: string, moduleName: string, state: routerState): { vnode: VNode, actionBlockClasses: string[] } | null {
  if (moduleType === 'widgets') {
    switch (moduleName) {
    case 'private-bookmarks':
      return {
        vnode: h(PrivateBookmarks),
        actionBlockClasses: ['category-list', 'link-list-body', 'header'],
      }
    case 'public-bookmarks':
      return {
        vnode: h(PublicBookmarks),
        actionBlockClasses: ['bookmark-directory'],
      }
    case 'json-formatter':
      return {
        vnode: h(JsonFormatter),
        actionBlockClasses: ['json-formatter'],
      }
    case 'reg-visual':
      return {
        vnode: h(RegVisual, {
          regText: state.regText as string,
        }),
        actionBlockClasses: [],
      }
    case 'img-to-base':
      return {
        vnode: h(ImageToBase, {
          file: state.file as File,
        }),
        actionBlockClasses: ['imgtobase-main'],
      }
    case 'triangle-maker':
      return {
        vnode: h(TriangleMaker, {
          defaultIndex: state.defaultIndex as number,
        }),
        actionBlockClasses: ['triangle-maker'],
      }
    }
  } else if (moduleType === 'settings') {
    switch (moduleName) {
    case 'wallpaper':
      return {
        vnode: h(WallpaperGallery),
        actionBlockClasses: ['category-item', 'gallery-item', 'color-item', 'custom-wallpaper'],
      }
    }
  }
  return null
}
export default {
  setup() {
    const modalVisible = ref(false)
    let activeComponent: VNode = h('div')
    let activeActionBlockClasses: string[] = []

    // 监听路由变动
    let unbindRouterListener: (() => void) | null = onRouterChange((moduleType, moduleName, state) => {
      // 弹窗先隐藏，再选择性显示
      modalVisible.value = false
      const matchedSubVNodeConfig = createSubVNode(moduleType, moduleName, state)
      if (matchedSubVNodeConfig) {
        const { vnode, actionBlockClasses } = matchedSubVNodeConfig
        activeComponent = vnode
        activeActionBlockClasses = actionBlockClasses
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
          actionBlockClasses: activeActionBlockClasses,
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
