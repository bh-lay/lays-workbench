export default function imgRobber(currentUrl: string) {
  const imageRootDomain = currentUrl.replace(/^(http(?:|s):\/\/)(?:[^\/]+\.|)([^\/]+\.[^\/]+)\/.+$/, '$1$2')
  return 'http://bh-lay.com/img-robber/' + btoa(currentUrl + '-' + imageRootDomain)
}