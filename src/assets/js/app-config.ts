const APP_CONFIG_DEFAULT = {
  maxContainerWidth: 1024,
  gridSize: 84,
  gridGap: 34,
  iconRadius: 8,
}

let APP_CONFIG: Record<string, unknown> = new Proxy({}, {})

type configKey = 'gridSize' | 'gridGap' | 'iconRadius' | 'maxContainerWidth'
const localStorageKey = 'APP_CONFIG_V1'

// 数据持久化逻辑
function saveToLocal() {
  const strData = JSON.stringify(APP_CONFIG)
  localStorage.setItem(localStorageKey, strData)
}

// 数据监听逻辑
type listenerFn = () => void
const appChangeListenerList: listenerFn[] = []
export function onAppConfigChange(callback: listenerFn) {
  appChangeListenerList.push(callback)
  return function unBind() {
    const index = appChangeListenerList.indexOf(callback)
    appChangeListenerList.splice(index, 1)
  }
}
function emitDataChange(){
  appChangeListenerList.forEach(fn => fn())
}

// 延迟处理数据变动
let saveTimer: number
function afterDataChangeDelay() {
  clearTimeout(saveTimer)
  saveTimer = window.setTimeout(function() {
    emitDataChange()
    saveToLocal()
  }, 300)
}

// 初始化
export function initAppConfig() {
  // 尝试从本地获取数据
  const localData = localStorage.getItem(localStorageKey)
  let configFromLocal = null
  if (localData) {
    try {
      configFromLocal = JSON.parse(localData)
    } catch (e) {}
  }
  // 合并本地数据与默认数据
  const appConfig = Object.assign({}, APP_CONFIG_DEFAULT, configFromLocal)
  // 初始化 Proxy 对象
  APP_CONFIG = new Proxy(appConfig, {
    set(target, key: configKey, value) {
      // 若不在定义的类型中，则不设置
      if (typeof APP_CONFIG_DEFAULT[key] === 'undefined') {
        return false
      }
      afterDataChangeDelay()
      return Reflect.set(target, key, value);
    }
  })
}

export function getAppConfig() {
  return APP_CONFIG
}

export function getAppConfigItem(key: string) {
  return APP_CONFIG[key]
}

export function setAppConfigItem(key: string, value: any) {
  APP_CONFIG[key] = value
}
