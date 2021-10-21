// 图片远程链接转换为base64
export default function loadImage(src) {
  var image = new Image()
  return new Promise(resolve => {
    image.onload = () => {
      resolve(image)
    }
    image.error = () => {
      const err = new Error('xxxxx')
      err._image = image
      reject(err)
    }
    image.src = src
  })
}