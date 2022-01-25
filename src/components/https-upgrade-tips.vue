<style lang="stylus" scoped>
.tips
  position fixed
  bottom 10px
  right 10px
  width 380px
  padding 20px 30px
  background #6d2617
  color #dedeba
h1
  font-size 30px
p
  font-size 15px
ol
  font-size 14px
a
  padding-left .5em
  color inherit
.lighter-1
  font-size 14px
  color #976
.lighter-2
  font-size 12px
  color #976
</style>

<template>
  <div class="tips">
    <h1>重要提示</h1>
    <p>感谢您使用小剧起始页！</p>
    <p>为了您的数据安全，请迁移数据至 HTTPS 协议。</p>
    <p class="lighter-1">
      数据迁移步骤
    </p>
    <ol>
      <li>点击页面右上角按钮，再点击导出</li>
      <li>稍等数秒后，点击下载，将数据备份至您的电脑中</li>
      <li>
        点击<a
          target="_blank"
          href="https://e.bh-lay.com"
        >https://e.bh-lay.com</a>，进入 HTTPS 版本的小剧起始页
      </li>
      <li>在新页面点击右上角按钮，再点击导入，选择刚刚备份的文件</li>
      <li>稍等数秒迁移即可完成</li>
    </ol>
    <p class="lighter-2">
      2022-03-15 之后，将仅支持 HTTPS 访问。
    </p>
  </div>
</template>

<script lang="ts">
export default {
  setup() {
    return {}
  },
}
</script>
