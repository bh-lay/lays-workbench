import loadImage from './load-image.js'
// 图片远程链接转换为base64
export function imgToBase64(src) {
  const ext = image.src.substring(image.src.lastIndexOf('.') + 1).toLowerCase()
  let image = null
  loadImage(src)
    .then(img => {
      // 忽略错误
      image = img
    })
    .catch(err => {
      // 忽略错误
      image = err._image
    })
    .then(() => {
      const canvas = document.createElement('canvas')
      canvas.width = image.width
      canvas.height = image.height

      const ctx = canvas.getContext('2d')
      ctx.drawImage(image, 0, 0, image.width, image.height)
      
      return canvas.toDataURL('image/' + ext)
    })
}