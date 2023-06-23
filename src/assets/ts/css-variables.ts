import { onAppConfigChange, getAppConfig } from './app-config'

// 获取 CSS 变量配置
function getCssVariables() {
  const appConfig = getAppConfig()

  return {
    iconRadius: appConfig.desktopZoom * 8,
    maxContainerWidth: appConfig.maxContainerWidth,
    gridSize: getGridSize(),
  }
}
function objectKeyToCssKey (text: string) {
  return '--' + text.replace(/(\w)([A-Z])/g, '$1-$2').toLocaleLowerCase()
}

// 应用 CSS 变量到 html 节点
function applyVariables() {
  const htmlNode: HTMLHtmlElement | null = document.querySelector('html')
  if (!htmlNode) {
    return
  }
  const variables = getCssVariables()
  const styleAtrribute = htmlNode.style

  for (const variableItemKey in variables) {
    const cssKey = objectKeyToCssKey(variableItemKey)
    const cssValue = `${variables[variableItemKey]}px`
    styleAtrribute.setProperty(cssKey, cssValue)
  }
}

export function getGridSize() {
  return getAppConfig().desktopZoom * 84
}

export function initVariables() {
  // 应用到 html 元素上
  applyVariables()
  // 当 APP 配置数据发生变动，应用
  onAppConfigChange(function() {
    applyVariables()
  })
}