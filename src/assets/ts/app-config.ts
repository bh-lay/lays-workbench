type AppConfig = {
  maxContainerWidth: number,
  activeDesktop: string,
  gridSize: number,
  searchEngineName: string,
}

const APP_CONFIG_DEFAULT: AppConfig = {
  maxContainerWidth: 1200,
  activeDesktop: '',
  gridSize: 84,
  searchEngineName: 'caniuse',
}
let APP_CONFIG: AppConfig | null = null

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
export function initAppConfig(): AppConfig {
  // 尝试从本地获取数据
  const localData = localStorage.getItem(localStorageKey)
  let configFromLocal = null
  if (localData) {
    try {
      configFromLocal = JSON.parse(localData)
    } catch (e) {
      console.log('error', e)
    }
  }
  // 合并本地数据与默认数据
  const appConfig = Object.assign({}, APP_CONFIG_DEFAULT, configFromLocal)
  const newAppConfig: AppConfig = new Proxy(appConfig, {
    set(target, key: string, value) {
      // 若不在定义的类型中，则不设置
      if (key in APP_CONFIG_DEFAULT) {
        afterDataChangeDelay()
        return Reflect.set(target, key, value)
      }
      return false
    },
  })

  // 初始化 Proxy 对象
  APP_CONFIG = newAppConfig
  return newAppConfig
}

export function getAppConfig(): AppConfig {
  if (APP_CONFIG) {
    return APP_CONFIG
  }
  return initAppConfig()
}
export function getAppConfigDefault() {
  return Object.assign({}, APP_CONFIG_DEFAULT)
}
export function getAppConfigItem(key: keyof AppConfig) {
  return getAppConfig()[key]
}

export function setAppConfigItem(key: keyof AppConfig, value: string | number) {
  const appConfig = getAppConfig()

  if (typeof value === 'string') {
    if (key === 'activeDesktop' || key === 'searchEngineName') {
      appConfig[key] = value
    }
  } else if (typeof value === 'number') {
    if (key === 'maxContainerWidth' || key === 'gridSize') {
      appConfig[key] = value
    }
  }
  
}
