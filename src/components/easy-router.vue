<script lang="ts">
import { ref, h, onBeforeUnmount, nextTick, VNode } from 'vue'
import { routerState, onRouterChange } from '@/assets/ts/router'
import { getWidgetsByName } from '@/components/widgets/widgets-config'
import WallpaperGallery from '@/components/wallpaper-gallery/index.vue'

import { FocalPlane } from '@/ui-lib/index'

function createSubVNode(moduleType: string, moduleName: string, state: routerState): { vnode: VNode, actionBlockClasses: string[] } | null {
  if (moduleType === 'widgets') {
    const matchedWidgets = getWidgetsByName(moduleName)
    if (matchedWidgets && matchedWidgets.mainComponent) {
      const defaultParams = matchedWidgets.defaultParams?.(state)
      return {
        vnode: h(matchedWidgets.mainComponent, defaultParams),
        actionBlockClasses: matchedWidgets.actionBlockClasses || [],
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
