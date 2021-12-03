import loadImage from '@/assets/js/load-image.ts'
// 图片远程链接转换为base64
export function imgToBase64(file: File,src: string) {
  // 创建 URL 对象
  const imgSrc = URL.createObjectURL(file)
  // 获取图片格式
  const ext = file.name.replace(/^.+\./, '')
  return loadImage(imgSrc)
    .then((image: HTMLImageElement) => {
      // 释放 URL 引用
      URL.revokeObjectURL(imgSrc)
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