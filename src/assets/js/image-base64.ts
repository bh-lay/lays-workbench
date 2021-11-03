import loadImage from './load-image.ts'
// 图片远程链接转换为base64
export function imgToBase64(src: string) {
  const ext = src.substring(src.lastIndexOf('.') + 1).toLowerCase()
  let image: HTMLImageElement
  loadImage(src)
    .then((img: HTMLImageElement) => {
      // 忽略错误
      image = img
    })
    .catch((err: Error) => {
      // 忽略错误
      // image = err._image
    })
    .then(() => {
      const canvas = document.createElement('canvas')
      canvas.width = image.width
      canvas.height = image.height

      const ctx: CanvasRenderingContext2D | null = canvas.getContext('2d')
      if (ctx) {
        ctx.drawImage(image, 0, 0, image.width, image.height)
      }
      
      return canvas.toDataURL('image/' + ext)
    })
}