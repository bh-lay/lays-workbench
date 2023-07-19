function printConsole() {
  console.log(
    `\n%c 小剧起始页 %c Vite + Vue3 + TS %c\n\n基于 IndexedDB 存储，本地数据更安全\n\n源代码在这里\nhttps://github.com/bh-lay/lays-workbench\n`,
    'background:#35495e ; padding: 5px; border-radius: 4px 0 0 4px;  color: #fff;',
    'background:#41b883 ; padding: 5px; border-radius: 0 4px 4px 0;  color: #fff;',
    'background:transparent'
  )
}
export default function() {
  printConsole()
}