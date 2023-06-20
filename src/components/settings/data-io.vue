<style lang="stylus" scoped>
.data-io
  position relative
  display flex
  height 50px
  border 1px dashed #575d6b
  border-radius 6px
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
    border-left 1px dashed #575d6b
  &:hover
    background #383d47
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
  line-height 50px
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
  line-height 50px
  text-align center
  color #8a94a8
  font-size 15px
  cursor pointer
  transition .2s
  &:hover
    background #29303d
  &:active
    background #424957

.hidden-input
  position absolute
  width 0
  height 0
  opacity 0
  visibility hidden
</style>

<template>
  <div class="data-io">
    <div
      class="half"
      @click="$refs.input.click()"
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
      @click="clearData"
    >
      <div class="icon">
        <v-mdi
          name="mdi-delete-empty"
          size="20"
        />
      </div>
      <div class="title">
        清空
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
    <input
      ref="input"
      type="file"
      accept="application/json"
      class="hidden-input"
      @change="handleInputChange"
    >
  </div>
</template>

<script lang="ts">
import { ref } from 'vue'
import { Message } from '@/ui-lib/message'
import {
  dbBackupDataType,
  dbExportService,
  dbImportService,
  dbEmptyService,
} from '@database/services/db-management-service'
import { Bookmark } from '@/database/entity/bookmark'

function getFileContent(file: File):  Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = function() {
      resolve(reader.result as string)
    }
    reader.onerror = function() {
      reject(new Error('读取文件失败，请稍后再试'))
    }
    reader.readAsText(file)
  })
}
export default {
  emits: ['next'],
  setup() {
    const isWorking = ref(false)
    const downloadVisible = ref(false)
    let exportData: dbBackupDataType | null = null

    return {
      isWorking,
      downloadVisible,
      exportDataToMemeory() {
        isWorking.value = true
        const startTime = Date.now()
        return dbExportService().then((exportData): Promise<dbBackupDataType> => {
          // 五秒导出，不能太快了
          return new Promise(resolve => {
            const now = Date.now()
            setTimeout(() => {
              resolve(exportData)
            }, 5000 - (now - startTime))
          })
        }).then((data: dbBackupDataType) => {
          exportData = data
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
      handleInputChange(event: InputEvent) {
        const eventTarget = event.target as null | {
          files: File[]
        }
        if (!eventTarget || !eventTarget.files || !eventTarget.files[0]) {
          return
        }
        isWorking.value = true
        getFileContent(eventTarget.files[0])
          .then((contentStr: string) => {
            return JSON.parse(contentStr)
          })
          .then(dbBackupDataType => {
            return dbImportService(dbBackupDataType)
          })
          .then(() => {
            location.reload()
          })
          .catch(e => {
            isWorking.value = false
            new Message({
              message: e.message || '导入失败，请重试',
            })
          })
      },
      clearData () {
        new Message({
          message: '清空会彻底删除，建议使用导出备份后操作！',
          duration: 0,
          confirmText: '继续清空',
          cancelText: '取消',
          confirm() {
            dbEmptyService()
              .then(() => {
                // 一秒后重载界面
                setTimeout(() => {
                  location.reload()
                }, 1000)
              })
          },
        })
      },
    }
  },
}
</script>
