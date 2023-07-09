<style lang="stylus" scoped>
.custom-wallpaper
  padding 100px 0 200px
  background #26262c
.caption
  margin-bottom 40px
  font-size 38px
  letter-spacing 2px
  text-align center
  font-weight bold
  color #2196f3
.input-center
  display flex
  width 90%
  max-width 600px
  margin auto
  overflow hidden
  .v-input
    width 100px
    margin-right 15px
    flex-grow 1
.footer
  width 90%
  max-width 600px
  margin 20px auto
  font-size 15px
  color #a2a6ae
  a
    margin-right 10px
    color #878c97
</style>

<template>
  <div class="custom-wallpaper">
    <div class="caption">
      网络图片
    </div>
    <div class="input-center">
      <v-input
        v-model="picUrl"
        v-focus
        placeholder="填写图片地址"
      />
      <v-button @click="applyPic">
        使用
      </v-button>
    </div>
    <div class="footer">
      <p>
        您可以借助于公开的图床，上传您的壁纸。<br>
        或者找到公开可访问的壁纸地址，获取图片访问地址。
      </p>
      <p>给您几个链接，尽情探索吧～</p>
      <p>
        <a target="_blank" href="https://imgtu.com/">路过图床</a>
        <a target="_blank" href="https://wallhaven.cc/">wallhaven</a>
        <a target="_blank" href="https://imgurl.org/">imgurl</a>
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Message } from '@/ui-lib/message/index'

const picUrl = ref('')
const picReg = /(?:http(?:|s):|)\/\/(?:[a-zA-Z0-9-]){1,26}(\.[a-zA-Z0-9-]+)+\/.+\.(jpg|png|gif|jpeg|bmp)/i

const emits = defineEmits(['selected'])

function applyPic() {
  if (!picReg.test(picUrl.value)) {
    new Message({
      message: '图片地址看起来不对呦，请核对一下',
      duration: 0,
      confirmText: '继续使用',
      cancelText: '取消',
      confirm() {
        emits('selected', picUrl.value)
      },
    })
  } else {
    emits('selected', picUrl.value)
  }
}

</script>
