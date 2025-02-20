import { routerState } from '@/assets/ts/router'

import RegVisualIcon from '@/components/widgets/reg-visual/index.vue'
import RegVisualMain from '@/components/widgets/reg-visual/main.vue'

import JsonFormatterIcon from '@/components/widgets/json-formatter/index.vue'
import JsonFormatterMain from '@/components/widgets/json-formatter/main.vue'

import TriangleMakerIcon from '@/components/widgets/triangle-maker/index.vue'
import TriangleMakerMain from '@/components/widgets/triangle-maker/main.vue'

import ImgToBaseIcon from '@/components/widgets/img-to-base/index.vue'
import ImageToBaseMain from '@/components/widgets/img-to-base/main.vue'

import PrivateBookmarksIcon from '@/components/widgets/private-bookmarks/index.vue'
import PrivateBookmarksMain from '@/components/private-bookmarks/index.vue'

import EasyCropPicIcon from '@/components/widgets/easy-crop-pic/index.vue'
import EsayCropPicMain from '@/components/widgets/easy-crop-pic/main.vue'

import PublicBookmarksIcon from '@/components/widgets/public-bookmarks/index.vue'
import PublicBookmarksMain from '@/components/public-bookmarks/index.vue'

import CountdownIcon from '@/components/widgets/countdown/index.vue'

export enum CONTAINER_STYLE {
  dialog = 1,
  fullpage = 2,
}
const widgetsConfig = [
  {
    name: 'reg-visual',
    label: '正则可视化',
    iconComponent: RegVisualIcon,
    mainComponent: RegVisualMain,
    containerStyle: CONTAINER_STYLE.dialog,
    actionBlockClasses: [],
  },
  {
    name: 'json-formatter',
    label: 'JSON格式化',
    iconComponent: JsonFormatterIcon,
    mainComponent: JsonFormatterMain,
    containerStyle: CONTAINER_STYLE.dialog,
    actionBlockClasses: ['json-formatter'],
  },
  {
    name: 'countdown',
    label: '倒计时',
    iconComponent: CountdownIcon,
    // mainComponent: ,
    containerStyle: CONTAINER_STYLE.dialog,
    // actionBlockClasses: [],
  },
  {
    name: 'triangle-maker',
    label: '三角形生成器',
    iconComponent: TriangleMakerIcon,
    mainComponent: TriangleMakerMain,
    containerStyle: CONTAINER_STYLE.dialog,
    actionBlockClasses: ['triangle-maker'],
    defaultParams(state: routerState) {
      return {
        defaultIndex: state.defaultIndex as number,
      }
    },
  },
  {
    name: 'img-to-base',
    label: '图片base64',
    iconComponent: ImgToBaseIcon,
    mainComponent: ImageToBaseMain,
    containerStyle: CONTAINER_STYLE.dialog,
    actionBlockClasses: ['imgtobase-main'],
    defaultParams(state: routerState) {
      return {
        file: state.file as File,
      }
    },
  },
  {
    name: 'easy-crop-pic',
    label: '简裁变图',
    iconComponent: EasyCropPicIcon,
    mainComponent: EsayCropPicMain,
    containerStyle: CONTAINER_STYLE.dialog,
    actionBlockClasses: ['easy-crop-pic-main'],
    defaultParams(state: routerState) {
      return {
        file: state.file as File,
      }
    },
  },
  {
    name: 'private-bookmarks',
    label: '小书房',
    iconComponent: PrivateBookmarksIcon,
    mainComponent: PrivateBookmarksMain,
    containerStyle: CONTAINER_STYLE.dialog,
    actionBlockClasses: ['category-list', 'link-list-body', 'header'],
  },
  {
    name: 'public-bookmarks',
    label: '藏经阁',
    iconComponent: PublicBookmarksIcon,
    mainComponent: PublicBookmarksMain,
    containerStyle: CONTAINER_STYLE.dialog,
    actionBlockClasses: ['bookmark-directory'],
  },
]

export function getWidgetsByName(widgetsName: string) {
  const matchedWidgets = widgetsConfig.find((widgets) => {
    return widgets.name === widgetsName
  })
  return matchedWidgets
}
