const removeSelecteion = window.getSelection
  ? function () {
    const selections = window.getSelection()
    selections && selections.removeAllRanges()
  }
  : function () {
    // nothing
  }

export type dragOptions = {
  beforeStart?: () => void;
  start: (startX: number, startY: number) => void;
  move: (a: dragParams) => void;
  end: (a: dragParams) => void;
  cancel?: () => void;
  mouseStableDistance: number;
  touchStableDistance?: number;
  touchHoldTime?: number;
};
export type dragParams = {
  clientX: number;
  clientY: number;
  xOffset: number;
  yOffset: number;
};

const listenerConfig: AddEventListenerOptions = {
  passive: false,
  capture: true,
}
function getParamFromMouseEvent(event: MouseEvent, startX: number, startY: number) {
  const clientX = event.clientX
  const clientY = event.clientY
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
function getParamFromTouchEvent(event: TouchEvent, startX: number, startY: number) {
  const touchFinger = event.touches[0]
  const clientX = touchFinger.clientX
  const clientY = touchFinger.clientY
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
export function mouseDragHandle(originEvent: MouseEvent | TouchEvent, options?: dragOptions) {
  const event = originEvent as MouseEvent
  const { beforeStart, start, move, end, cancel, mouseStableDistance } = options || {}
  // 非左键不处理
  if (event.button !== 0) {
    cancel && cancel()
    return
  }
  // 触发最早的开始事件
  beforeStart && beforeStart()
  const startX = event.clientX
  const startY = event.clientY
  let hasTriggerStartEvent = false
  const _stableDistance = mouseStableDistance || 0
  if (!_stableDistance) {
    event.preventDefault && event.preventDefault()
    event.stopPropagation && event.stopPropagation()
  }
  function mousemove(e: MouseEvent) {
    e.stopPropagation && e.stopPropagation()
    removeSelecteion()
    const param = getParamFromMouseEvent(e, startX, startY)
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
      end && end(getParamFromMouseEvent(event, startX, startY))
    } else {
      cancel && cancel()
    }
  }
  document.addEventListener('mousemove', mousemove, listenerConfig)
  document.addEventListener('mouseup', up, listenerConfig)
}

export function touchDragHandle(originEvent: MouseEvent | TouchEvent, options?: dragOptions) {
  const event = originEvent as TouchEvent
  const { beforeStart, start, move, end, cancel, touchHoldTime = 300, touchStableDistance = 50 } = options || {}
  const touches = event.touches || []
  const targetNode = event.target
  if (touches.length !== 1 || !targetNode) {
    return
  }
  const touchFinger = touches[0]
  // 触发最早的开始事件
  beforeStart && beforeStart()
  const startX = touchFinger.clientX
  const startY = touchFinger.clientY
  let lastTouchParams: dragParams | null = null
  let hasTriggerStartEvent = false

  const longTouchTimer = setTimeout(() => {
    hasTriggerStartEvent = true
    start && start(startX, startY)
    const param = getParamFromTouchEvent(event, startX, startY)
    move && move(param)
  }, touchHoldTime)
  function touchMove(originEvent: Event) {
    const event = originEvent as TouchEvent
    const param = getParamFromTouchEvent(event, startX, startY)
    if (!hasTriggerStartEvent && Math.sqrt(param.xOffset * param.xOffset + param.yOffset * param.yOffset) >
    touchStableDistance) {
      touchCancel()
      return
    }
    if (!hasTriggerStartEvent) {
      return
    }
    event.stopPropagation && event.stopPropagation()
    event.preventDefault && event.preventDefault()
    move && move(param)

    lastTouchParams = param
  }
  function touchEnd() {
    clearTimeout(longTouchTimer)
    removeEventListener()

    if (hasTriggerStartEvent && lastTouchParams) {
      end && end(lastTouchParams)
    } else {
      cancel && cancel()
    }
  }
  function touchCancel() {
    clearTimeout(longTouchTimer)
    removeEventListener()
    cancel && cancel()
  }
  function removeEventListener() {
    targetNode?.removeEventListener('touchmove', touchMove, listenerConfig)
    targetNode?.removeEventListener('touchend', touchEnd, listenerConfig)
    targetNode?.removeEventListener('touchcancel', touchCancel, listenerConfig)
  }
  targetNode.addEventListener('touchmove', touchMove, listenerConfig)
  targetNode.addEventListener('touchend', touchEnd, listenerConfig)
  targetNode.addEventListener('touchcancel', touchCancel, listenerConfig)
}

export default function (event: MouseEvent | TouchEvent, options?: dragOptions) {
  if ('ontouchend' in document) {
    touchDragHandle(event, options)
  } else {
    mouseDragHandle(event, options)
  }
}
