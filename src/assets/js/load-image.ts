// 图片远程链接转换为base64
export default function loadImage(src: string): Promise<HTMLImageElement> {
  var image = new Image()
  return new Promise((resolve, reject) => {
    image.onload = () => {
      resolve(image)
    }
    image.onerror = () => {
      const err = new Error('xxxxx')
      // err._image = image
      reject(err)
    }
    image.src = src
  })
}
