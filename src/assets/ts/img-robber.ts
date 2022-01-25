export default function imgRobber(imgUrl: string) {
  const imageRootDomain = imgUrl.replace(/^(http(?:|s):\/\/)(?:[^/]+\.|)([^/]+\.[^/]+)\/.+$/, '$1$2')
  return '//bh-lay.com/img-robber/' + btoa(imgUrl + '-' + imageRootDomain)
}