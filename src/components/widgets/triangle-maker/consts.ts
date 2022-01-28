export type triTemplateMaker = {
  borderWidth: (a: number, b: number, c: number) => string
  borderColor: (color: string) => string
  default: () => [a: number, b: number, c: number]
}
const triTemplate: triTemplateMaker[] = [
  // 1
  {
    borderWidth(a: number, b: number, c: number) {
      return `${a}px ${c || 30}px ${b}px 0`
    },
    borderColor(color: string) {
      return `transparent ${color} transparent transparent`
    },
    default() {
      return [20, 20, 30]
    },
  },
  // 2
  {
    borderWidth(a: number, b: number) {
      return `0 ${a}px ${b}px 0`
    },
    borderColor(color: string) {
      return `transparent ${color} transparent transparent`
    },
    default() {
      return [30, 30, -1]
    },
  },
  // 3
  {
    borderWidth(a: number, b: number, c: number) {
      return `${c}px ${a}px 0 ${b}px`
    },
    borderColor(color: string) {
      return `${color} transparent transparent transparent`
    },
    default() {
      return [20, 20, 30]
    },
  },
  // 4
  {
    borderWidth(a: number, b: number) {
      return `${a}px ${b}px 0 0`
    },
    borderColor(color: string) {
      return `${color} transparent transparent transparent`
    },
    default() {
      return [30, 30, -1]
    },
  },
  // 5
  {
    borderWidth(a: number, b: number, c: number) {
      return `${a}px 0 ${b}px ${c}px`
    },
    borderColor(color: string) {
      return `transparent transparent transparent ${color}`
    },
    default() {
      return [20, 20, 30]
    },
  },
  // 6
  {
    borderWidth(a: number, b: number) {
      return `${a}px 0 0 ${b}px`
    },
    borderColor(color: string) {
      return `transparent transparent transparent ${color}`
    },
    default() {
      return [30, 30, -1]
    },
  },
  // 7
  {
    borderWidth(a: number, b: number, c: number) {
      return `0 ${a}px ${c}px ${b}px`
    },
    borderColor(color: string) {
      return `transparent transparent ${color} transparent`
    },
    default() {
      return [20, 20, 30]
    },
  },
  // 8
  {
    borderWidth(a: number, b: number) {
      return `0 0 ${a}px ${b}px`
    },
    borderColor(color: string) {
      return `transparent transparent ${color} transparent`
    },
    default() {
      return [30, 30, -1]
    },
  },
]

export function getTriCssTemplate(index: number) {
  return triTemplate[index]
}