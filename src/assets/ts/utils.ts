export function splitInFirstColon(input: string): [string, string] {
  const output = input.match(/(^[^:]+)(?:\:(.+))*/)
  if (!output) {
    return ['', '']
  }
  return [output[1] || '', output[2] || '']
}

export function leftPad(num: number) {
  return (num < 10 ? '0' : '') + num
}
export function timeFormat(timeStample: number) {
  const date = new Date()
  date.setTime(timeStample)
  return date.getFullYear() + '-' + leftPad(date.getMonth() + 1) + '-' + leftPad(date.getDate()) +
    ' ' +
    leftPad(date.getHours()) + ':' + leftPad(date.getMinutes()) + ':' + leftPad(date.getSeconds())
}