import { jsonParse } from "./utils"

type AppConfig = {
  userName: string,
  maxContainerWidth: number,
  activeDesktopId: string,
  desktopZoom: number,
  searchEngineName: string,
}

const APP_CONFIG_DEFAULT: AppConfig = {
  userName: '小剧',
  maxContainerWidth: 1200,
  activeDesktopId: '',
  desktopZoom: 1,
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

function setAppConfigItemValue(appConfigItem: AppConfig, key: keyof AppConfig, value: any) {
  if (typeof value === 'string') {
    if (key === 'activeDesktopId' || key === 'searchEngineName' || key === 'userName') {
      appConfigItem[key] = value
    }
  } else if (typeof value === 'number') {
    if (key === 'maxContainerWidth' || key === 'desktopZoom') {
      appConfigItem[key] = value
    }
  }
}

// 初始化
export function initAppConfig(): AppConfig {
  // 尝试从本地获取数据
  const localData = localStorage.getItem(localStorageKey) || ''
  let configFromLocal = localData ? jsonParse(localData) : null
  const appConfig: AppConfig = getAppConfigDefault()
  // 合并本地数据
  if (configFromLocal) {
    for (let key in appConfig) {
      if (configFromLocal[key]) {
        setAppConfigItemValue(appConfig, key as keyof AppConfig, configFromLocal[key])
      }
    }
  }
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
  setAppConfigItemValue(getAppConfig(), key, value)
}
