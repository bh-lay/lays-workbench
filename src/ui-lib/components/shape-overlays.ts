export class ShapeOverlays {
  elm: HTMLElement
  path: SVGPathElement | null
  numPoints: number
  duration: number
  timeStart: number
  isOpened: boolean
  isAnimating: boolean
  constructor(elm: HTMLElement) {
    this.elm = elm
    this.path = elm.querySelector('path')
    this.numPoints = 8
    this.duration = 600
    this.timeStart = Date.now()
    this.isOpened = false
    this.isAnimating = false
  }
  toggle() {
    this.isAnimating = true
    if (this.isOpened === false) {
      this.open()
    } else {
      this.close()
    }
  }
  open() {
    this.isOpened = true
    this.timeStart = Date.now()
    this.renderLoop()
  }
  close() {
    this.isOpened = false
    this.timeStart = Date.now()
    this.renderLoop()
  }
  updatePath(time: number) {
    const points = []
    for (let i = 0; i < this.numPoints; i++) {
      const thisEase = this.isOpened ?
        (i%2 == 1) ? ease.cubicOut : ease.cubicInOut:
        (i%2 == 1) ? ease.cubicInOut : ease.cubicOut
      // const thisEase = (i%2 === 1) ? ease.cubicOut : ease.cubicInOut;
      points[i] = thisEase(Math.min(time / this.duration, 1)) * 100
    }

    let str = ''
    str += (this.isOpened) ? `M 0 0 V ${points[0]} ` : `M 0 ${points[0]} `
    for (let i = 0; i < this.numPoints - 1; i++) {
      const p = (i + 1) / (this.numPoints - 1) * 100
      const cp = p - (1 / (this.numPoints - 1) * 100) / 2
      str += `C ${cp} ${points[i]} ${cp} ${points[i + 1]} ${p} ${points[i + 1]} `
    }
    str += (this.isOpened) ? 'V 0 H 0' : 'V 100 H 0'
    return str
  }
  render() {
    this.path?.setAttribute('d', this.updatePath(Date.now() - this.timeStart))
  }
  renderLoop() {
    this.render()
    if (Date.now() - this.timeStart < this.duration) {
      requestAnimationFrame(() => {
        this.renderLoop()
      })
    }
    else {
      this.isAnimating = false
    }
  }
}

//
// these easing functions are based on the code of glsl-easing module.
// https://github.com/glslify/glsl-easings
//
const ease = {
  exponentialIn: (t: number) => {
    return t == 0.0 ? t : Math.pow(2.0, 10.0 * (t - 1.0))
  },
  exponentialOut: (t: number) => {
    return t == 1.0 ? t : 1.0 - Math.pow(2.0, -10.0 * t)
  },
  exponentialInOut: (t: number) => {
    return t == 0.0 || t == 1.0
      ? t
      : t < 0.5
        ? +0.5 * Math.pow(2.0, (20.0 * t) - 10.0)
        : -0.5 * Math.pow(2.0, 10.0 - (t * 20.0)) + 1.0
  },
  sineOut: (t: number) => {
    const HALF_PI = 1.5707963267948966
    return Math.sin(t * HALF_PI)
  },
  circularInOut: (t: number) => {
    return t < 0.5
      ? 0.5 * (1.0 - Math.sqrt(1.0 - 4.0 * t * t))
      : 0.5 * (Math.sqrt((3.0 - 2.0 * t) * (2.0 * t - 1.0)) + 1.0)
  },
  cubicIn: (t: number) => {
    return t * t * t
  },
  cubicOut: (t: number) => {
    const f = t - 1.0
    return f * f * f + 1.0
  },
  cubicInOut: (t: number) => {
    return t < 0.5
      ? 4.0 * t * t * t
      : 0.5 * Math.pow(2.0 * t - 2.0, 3.0) + 1.0
  },
  quadraticOut: (t: number) => {
    return -t * (t - 2.0)
  },
  quarticOut: (t: number) => {
    return Math.pow(t - 1.0, 3.0) * (1.0 - t) + 1.0
  },
}
