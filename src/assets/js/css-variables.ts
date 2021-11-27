
const variables = {
  gridSize: 84,
  gridGap: 34,
  iconRadius: 8,
}
type variableKey = 'gridSize' | 'gridGap' | 'iconRadius'
function camelCaseToSpinalCase (text: string) {
  return text.replace(/(\w)([A-Z])/g, '$1-$2').toLocaleLowerCase()
}
function applyVariables() {
  const htmlNode: HTMLHtmlElement | null = document.querySelector('html')
  if (!htmlNode) {
    return
  }
  const styleAtrribute = htmlNode.style
  let variableItemKey: variableKey
  for (variableItemKey in variables) {
    styleAtrribute.setProperty(`--${camelCaseToSpinalCase(variableItemKey)}`, `${variables[variableItemKey]}px`)
  }
}
export function getVariables() {
  return JSON.parse(JSON.stringify(variables))
}
export function getVariable(key: variableKey) {
  return variables[key] || null
}
export function setVariable(key: variableKey, value: number) {
  variables[key] = value
  applyVariables()
  // 保存到本地
  // ...
}
export function initVariables() {
  // 从本地获取配置
  // ...
  // 读取到内存中
  // ...
  // 应用到 html 元素上
  applyVariables()
}