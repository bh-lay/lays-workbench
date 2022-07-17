import { h, ref } from 'vue'
type libType = {[key:string]: string}
let iconLib: libType = {}

function toCamelCase(str: string) {
  const result = str.replace(/(?:^\w|[A-Z]|\b\w)/g, (letter, index) => {
    return index === 0 ? letter.toLowerCase() : letter.toUpperCase()
  })
  return result.replace(/\s+|[-]/g, '')
}

// 异步加载 Icon 数据
let isIconConfigReady = false
let loadPromiseCache: null | Promise<void> = null
function loadIconConfigAndWaitReady() {
  if (isIconConfigReady) {
    return Promise.resolve()
  }
  if (loadPromiseCache) {
    return loadPromiseCache
  }
  loadPromiseCache = import('@mdi/js').then((mdiIconConfig) => {
    iconLib = mdiIconConfig as libType
    isIconConfigReady = true
  })
  return loadPromiseCache
}

function getIconContextByName(iconName: string) {
  const iconContext = iconLib[toCamelCase(iconName)] || ''
  if (typeof iconContext === 'undefined') {
    console.log(`[${iconName}] Name of the icon is incorrect`)
  }
  return iconContext
}
export default {
  name: 'VMdi',
  props: {
    name: {
      type: String,
      default: '',
    },
    size: {
      type: [String, Number],
      default: 24,
    },
    fill: {
      type: String,
      default: 'currentColor',
    },
    rotate: {
      type: Number,
      default: 0,
    },
  },
  setup(props: {
    name: string,
    size: string |number,
    fill: string,
    rotate: number,
  }) {
    const iconReady = ref(isIconConfigReady)
    // 若图标未下载，则等待图标下载完成
    if (!isIconConfigReady) {
      loadIconConfigAndWaitReady().then(() => {
        iconReady.value = true
      })
    }
    return function () {
      if (!iconReady.value) {
        return h(
          'span',
          {
            class: 'loading',
            style: {
              display: 'inline-block',
              width: props.size + 'px',
              height: props.size + 'px',
              boxShadow: `inset -4px -4px 0 1px ${props.fill}`,
              borderRadius: '50%',
            },
          }
        )
      }
      return h(
        'svg',
        {
          class: 'mdi-icon',
          viewBox: '0 0 24 24',
          fill: props.fill,
          width: props.size,
          height: props.size,
          style: {
            transform: `rotate(${props.rotate}deg)`,
            display: 'inline-block',
          },
        },
        [
          h('path', {
            d: getIconContextByName(props.name),
          }),
        ]
      )
    }
  },
}