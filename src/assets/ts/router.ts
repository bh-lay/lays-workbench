// 类型定义
type moduleTypeWidgets = 'widgets'
type moduleTypeSettings = 'settings'
type moduleType = moduleTypeWidgets | moduleTypeSettings
type routerInfo = {
  moduleType: moduleType,
  moduleName: string
}
type routerChangeCallback = (
  moduleType: moduleType,
  moduleName: string,
  state: any
) => void

// 根据当前 URL 获取路由数据
function parseRouterInfo(): routerInfo {
  const hash = location.hash.replace(/^\#!=/, '')
  const defaultReturns: routerInfo = {
    moduleType: 'widgets',
    moduleName: '',
  }
  if (!hash) {
    return defaultReturns
  }
  const hashSplit = hash.split(':')
  if (hashSplit.length !== 2) {
    return defaultReturns
  }
  const moduleType = hashSplit[0]
  if (moduleType === 'widgets' || moduleType === 'settings') {
    defaultReturns.moduleType = moduleType
    defaultReturns.moduleName = hashSplit[1]
  }
  return defaultReturns
}
// 路由信息到 URL
function routerInfoToUrl(moduleType: moduleType, moduleName: string) {
  return `${location.pathname}#!=${moduleType}:${moduleName}`
}
// 路由变动监听逻辑
const routerChangeCallbackList: routerChangeCallback[] = []
function handleRouterChange(
  moduleType: moduleType,
  moduleName: string,
  state?: any
) {
  routerChangeCallbackList.forEach(callback => {
    callback(moduleType, moduleName, state)
  })
}


// replace 路由
export function replaceRouter(
  moduleType: moduleType,
  moduleName: string,
  state?: object
) {
  history.replaceState(state || {}, '', routerInfoToUrl(moduleType, moduleName))
  handleRouterChange(moduleType, moduleName, state)
}

// push 路由
export function pushRouter(
  moduleType: moduleType,
  moduleName: string,
  state?: object
) {
  history.pushState(state || {}, '', routerInfoToUrl(moduleType, moduleName))
  handleRouterChange(moduleType, moduleName, state)
}


// 处理全局事件监听
function popstateHandle(event: PopStateEvent) {
  const params = parseRouterInfo()
  handleRouterChange(params.moduleType, params.moduleName, event.state)
}

// 增加路由变动事件绑定
export function onRouterChange(
  callback: routerChangeCallback,
  immediateTrigger: boolean
) {
  if (typeof callback !== 'function') {
    throw Error('onRouterChange arguments[0] must be Function')
  }
  // 注册回调前，若回调列表为空，则初始化监听 history 事件
  if (routerChangeCallbackList.length === 0) {
    window.addEventListener('popstate', popstateHandle)
  }
  
  routerChangeCallbackList.push(callback)
  // 若需立即触发，则立即执行一次
  if (immediateTrigger) {
    const params = parseRouterInfo()
    callback(params.moduleType, params.moduleName, null)
  }
  // 解除事件监听
  return function() {
    let index = routerChangeCallbackList.indexOf(callback)
    routerChangeCallbackList.splice(index, 1)
    // 若移除回调记录后，回调列表为空，则解除监听 history 事件
    if (routerChangeCallbackList.length === 0) {
      window.removeEventListener('popstate', popstateHandle)
    }
  }
}