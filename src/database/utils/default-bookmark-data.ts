import { BookmarkType, BookmarkSize } from '../entity/bookmark'

export default [
  {
    sort: 1001,
    id: 'default-10',
    name: '小书房',
    type: BookmarkType.widgets,
    size: BookmarkSize.medium,
    undercoat: '#2196f3',
    value: 'private-bookmarks',
  },
  {
    sort: 1000,
    id: 'default-0',
    name: '正则可视化',
    type: BookmarkType.widgets,
    size: BookmarkSize.large,
    undercoat: '#2196f3',
    value: 'reg-visual',
  },
  {
    sort: 999,
    id: 'default-1',
    name: '图片base64',
    type: BookmarkType.widgets,
    size: BookmarkSize.large,
    undercoat: '#4caf50',
    value: 'img-to-base',
  },
  {
    sort: 998,
    id: 'default-2',
    name: 'JSON 格式化',
    type: BookmarkType.widgets,
    size: BookmarkSize.medium,
    undercoat: '#f44336',
    value: 'json-formatter',
  },
  {
    sort: 997,
    id: 'default-3',
    name: 'Github',
    type: BookmarkType.link,
    size: BookmarkSize.small,
    undercoat: '#222',
    value: 'https://github.com/',
    icon: 'mdi:github'
  },
  {
    sort: 996,
    id: 'default-4',
    name: 'stackoverflow',
    type: BookmarkType.link,
    size: BookmarkSize.small,
    undercoat: '#d06925',
    value: 'https://stackoverflow.com/',
    icon: 'mdi:stack-overflow'
  },
  {
    sort: 995,
    id: 'default-5',
    name: 'Vue.js',
    type: BookmarkType.link,
    size: BookmarkSize.small,
    undercoat: '#4fc08d',
    value: 'https://cn.vuejs.org/',
    icon: 'mdi:vuejs'
  },
  {
    sort: 995,
    id: 'default-6',
    name: 'Electron',
    type: BookmarkType.link,
    size: BookmarkSize.small,
    undercoat: '#2d8a9f',
    value: 'https://www.electronjs.org/',
    icon: 'mdi:electron-framework'
  },
  {
    sort: 992,
    id: 'default-8',
    name: 'webpack',
    type: BookmarkType.link,
    size: BookmarkSize.small,
    undercoat: '#539ac8',
    value: 'https://webpack.docschina.org/',
    icon: 'mdi:webpack'
  },
  {
    sort: 991,
    id: 'default-9',
    name: 'BundleScanner',
    type: BookmarkType.link,
    size: BookmarkSize.small,
    undercoat: '#101418',
    value: 'https://bundlescanner.com/',
    icon: 'crab'
  },
  {
    sort: 990,
    id: 'default-11',
    name: 'iconFont',
    type: BookmarkType.link,
    size: BookmarkSize.small,
    undercoat: '#f3f8f1',
    value: 'https://www.iconfont.cn/',
    icon: 'mdi:star-face'
  },
]
