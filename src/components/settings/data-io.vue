<style lang="stylus" scoped>
.data-io
  position relative
  display flex
  height 60px
  border 1px dashed #656c7b
  border-radius 8px
  overflow hidden
.half
  display flex
  flex-direction column
  align-items center
  justify-content center
  width 10px
  flex-grow 1
  cursor pointer
  transition .2s
  color #afb8ca
  .title
    line-height 14px
    font-size 12px
  & + .half
    border-left 1px dashed #656c7b
  &:hover
    background #424957
  &:active
    background #29303d
.loading
  position absolute
  top 0
  left 0
  width 100%
  height 100%
  background #29303d
  animation loadingBreath 2s infinite
  line-height 60px
  text-align center
  color #8a94a8
  font-size 12px

@keyframes loadingBreath
	0%,
	15%,
  100%
    background #3e4451
	60%,
	64%
    background #29303d
.download-layer
  position absolute
  top 0
  left 0
  width 100%
  height 100%
  background #424957
  line-height 60px
  text-align center
  color #8a94a8
  font-size 15px
  cursor pointer
  transition .2s
  &:hover
    background #29303d
  &:active
    background #424957

</style>

<template>
  <div class="data-io">
    <div
      class="half"
      @click="importData"
    >
      <div class="icon">
        <v-mdi
          name="mdi-upload"
          size="20"
        />
      </div>
      <div class="title">
        导入
      </div>
    </div>
    <div
      class="half"
      @click="exportDataToMemeory"
    >
      <div class="icon">
        <v-mdi
          name="mdi-download"
          size="20"
        />
      </div>
      <div class="title">
        导出
      </div>
    </div>
    <div
      v-if="isWorking"
      class="loading"
    >
      正在处理，请稍后～
    </div>
    <div
      v-if="downloadVisible"
      class="download-layer"
      @click="downloadExportFile"
    >
      下载
    </div>
  </div>
</template>

<script lang="ts">
import { ref } from 'vue'
import { Message } from '@/ui-lib/message'
import { bookmarkListService } from '@database/services/bookmark-service'
import { Bookmark } from '@/database/entity/bookmark'
type backupData = {
  bookmarks: Bookmark[]
} | null
export default {
  emits: ['next'],
  setup() {
    const isWorking = ref(false)
    const downloadVisible = ref(false)
    let exportData: backupData = null
    return {
      isWorking,
      downloadVisible,
      importData() {
        new Message({
          message: '导入功能还在开发中～',
        })
      },
      exportDataToMemeory() {
        isWorking.value = true
        const startTime = Date.now()
        return bookmarkListService({
          parent: '*',
        }).then((list) => {
          // 五秒导出，不能太快了
          return new Promise(resolve => {
            const now = Date.now()
            setTimeout(() => {
              resolve({
                bookmarks: list,
              })
            }, 5000 - (now - startTime))
          })
        }).then(data => {
          exportData = data as backupData
          isWorking.value = false
          downloadVisible.value = true
        })
      },
      downloadExportFile() {
        const today = new Date().toLocaleDateString().replace(/\//g, '-')
        const blob = new Blob([JSON.stringify(exportData)])
        const downloadUrl = URL.createObjectURL(blob)

        const linkNode: HTMLAnchorElement = document.createElement('a')
        linkNode.download = `database-backup-${today}.json`
        linkNode.style.setProperty('display', 'none')
        linkNode.href = downloadUrl
        document.body.appendChild(linkNode)
        linkNode.click()
      
        setTimeout(function () {
          document.body.removeChild(linkNode)
          window.URL.revokeObjectURL(downloadUrl)
          downloadVisible.value = false
          exportData = null
        }, 100)
      },
    }
  },
}
</script>
