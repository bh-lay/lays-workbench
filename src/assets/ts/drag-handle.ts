const removeSelecteion = window.getSelection
  ? function () {
    const selections = window.getSelection()
    selections && selections.removeAllRanges()
  }
  : function () {
    // nothing
  }

export type dragOptions = {
  beforeStart?: (e: MouseEvent) => void;
  start: (startX: number, startY: number) => void;
  move: (a: dragParams) => void;
  end: (a: dragParams) => void;
  cancel?: () => void;
  stableDistance: number;
};
export type dragParams = {
  clientX: number;
  clientY: number;
  xOffset: number;
  yOffset: number;
};
function getParam(e: MouseEvent, startX: number, startY: number) {
  const clientX = e.clientX
  const clientY = e.clientY
  const xOffset = clientX - startX
  const yOffset = clientY - startY
  const returns: dragParams = {
    clientX,
    clientY,
    xOffset,
    yOffset,
  }
  return returns
}
export default function (event: MouseEvent, options?: dragOptions) {
  const { beforeStart, start, move, end, cancel, stableDistance } = options || {}
  // 触发最早的开始事件
  beforeStart && beforeStart(event)
  const startX = event.clientX
  const startY = event.clientY
  let hasTriggerStartEvent = false
  const _stableDistance = stableDistance || 0
  if (!_stableDistance) {
    event.preventDefault && event.preventDefault()
    event.stopPropagation && event.stopPropagation()
  }
  const listenerConfig: AddEventListenerOptions = {
    passive: true,
    capture: true,
  }
  function mousemove(e: MouseEvent) {
    e.stopPropagation && e.stopPropagation()
    removeSelecteion()
    const param = getParam(e, startX, startY)
    if (hasTriggerStartEvent) {
      move && move(param)
    } else if (
      Math.sqrt(param.xOffset * param.xOffset + param.yOffset * param.yOffset) >
      _stableDistance
    ) {
      hasTriggerStartEvent = true
      start && start(startX, startY)
      move && move(param)
    }
  }
  function up(event: MouseEvent) {
    event.stopPropagation()

    document.removeEventListener('mousemove', mousemove, listenerConfig)
    document.removeEventListener('mouseup', up, listenerConfig)
    if (hasTriggerStartEvent) {
      end && end(getParam(event, startX, startY))
    } else {
      cancel && cancel()
    }
  }
  document.addEventListener('mousemove', mousemove, listenerConfig)
  document.addEventListener('mouseup', up, listenerConfig)
}
