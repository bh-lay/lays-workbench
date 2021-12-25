<style lang="stylus" scoped>
.custom-wallpaper
  padding 140px 0 200px
  background rgba(0, 0, 0, .5)
.caption
  margin-bottom 20px
  font-weight bold
  font-size 24px
  text-align center
  color #ddd
.input-center
  display flex
  width 90%
  max-width 600px
  height 50px
  margin auto
  border-radius 8px
  background #fff
  overflow hidden
  input
    width 100px
    padding 0 20px
    border none
    flex-grow 1
    background #fff
    font-size 14px
    &:focus
      outline none
      background #ddd
  button
    width 80px
    border none
    outline none
    background #fff
    font-size 14px
    &:hover
      background #eee
    &:active
      background #ddd
.footer
  width 90%
  max-width 560px
  margin 20px auto
  font-size 14px
  color #666
  a
    margin-right 10px
    color blue
</style>

<template>
  <div class="custom-wallpaper">
    <div class="caption">
      填写图片地址
    </div>
    <div class="input-center">
      <input v-model="picUrl">
      <button @click="applyPic">
        设置
      </button>
    </div>
    <div class="footer">
      <p>
        您可以借助于公开的图床，上传您的壁纸。<br>
        或者找到公开可访问的壁纸地址，获取图片访问地址。
      </p>
      <p>给您几个链接，尽情探索吧～</p>
      <p>
        <a href="https://imgtu.com/">路过图床</a>
        <a href="https://sm.ms/">SM.MS</a>
        <a href="https://wallhaven.cc/">wallhaven</a>
        <a href="https://imgurl.org/">imgurl</a>
      </p>
    </div>
  </div>
</template>

<script lang="ts">
import { ref } from 'vue'
import { setAppConfigItem } from '@/assets/ts/app-config'
import { Message } from '@/ui-lib/message/index'
export default {
  name: 'SettingsWallpaperCustom',
  setup() {
    const picUrl = ref('')
    const picReg = /(?:http(?:|s):|)\/\/(?:[a-zA-Z0-9-]){1,26}(\.[a-zA-Z0-9-]+)+\/.+\.(jpg|png|gif|jpeg|bmp)/i
    return {
      picUrl,
      applyPic() {
        
        if (!picReg.test(picUrl.value)) {
          new Message({
            message: '图片地址看起来不对呦，请核对一下',
            duration: 0,
            confirmText: '继续使用',
            cancelText: '取消',
            confirm() {
              setAppConfigItem('wallpaper', picUrl.value)  
            },
          })
          // if (confirm('地址没问题，继续使用')) {
            
          // }
        } else {
          setAppConfigItem('wallpaper', picUrl.value)
        }
      },
    }
  },
}
</script>
