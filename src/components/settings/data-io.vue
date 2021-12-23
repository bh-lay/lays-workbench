<style lang="stylus" scoped>
.data-io
  position relative
  display flex
  height 100px
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
  svg
    width 30px
    height 30px
  .title
    font-size 14px
  & + .half
    border-left 1px dashed #656c7b
  &:hover
    background #424957
  &:active
    background #29303d
.download-layer
  position absolute
  top 0
  left 0
  width 100%
  height 100%
  background #29303d
  line-height 100px
  text-align center
.loading
  position absolute
  top 0
  left 0
  width 100%
  height 100%
  background #29303d
  animation loadingBreath 2s infinite
  line-height 100px
  text-align center
  color #8a94a8

@keyframes loadingBreath
	0%,
	15%,
  100%
    background #3e4451
	60%,
	64%
    background #29303d

</style>

<template>
  <div class="data-io">
    <div class="half" @click="importData">
      <div class="icon">
        <v-mdi name="mdi-upload" />
      </div>
      <div class="title">导入</div>
    </div>
    <div class="half" @click="exportData">
      <div class="icon">
        <v-mdi name="mdi-download" />
      </div>
      <div class="title">导出</div>
    </div>
    <div v-if="isWorking" class="loading">
      正在处理，请稍后～
    </div>
    <div v-if="downloadVisible" class="download-layer">
      <v-button
        v-if="downloadExportFile"
        type="white"
        @click="downloadExportFile"
      >下载</v-button>
    </div>
  </div>
</template>

<script lang="ts">
import { ref, watch } from 'vue';
import Gallery from '@/components/gallery.vue'
import { Message } from '@/ui-lib/message';
import { bookmarkListService } from '@database/services/bookmark-service';

export default {
  emits: ['next'],
  components: { Gallery },
  setup() {
    const isWorking = ref(false)
    const downloadVisible = ref(false)
    let exportData: any = null
    return {
      isWorking,
      downloadVisible,
      importData() {
        new Message({
          message: '导入功能还在开发中～'
        })
      },
      exportData() {
        isWorking.value = true
        const startTime = Date.now()
        return bookmarkListService({
          parent: '*'
        }).then((list) => {
          // 五秒导出，不能太快了
          return new Promise(resolve => {
            const now = Date.now()
            setTimeout(() => {
              resolve({
                bookmarks: list
              })
            }, 5000 - (now - startTime))
          })
        }).then(data => {
          exportData = data
          isWorking.value = false
          downloadVisible.value = true
        });
      },
      downloadExportFile() {
        const today = new Date().toLocaleDateString().replace(/\//g, '-')
        const blob = new Blob([JSON.stringify(exportData)]);
        const downloadUrl = URL.createObjectURL(blob);

        const linkNode: HTMLAnchorElement = document.createElement('a');
        linkNode.download = `database-backup-${today}.json`;
        linkNode.style.setProperty('display', 'none')
        linkNode.href = downloadUrl
        document.body.appendChild(linkNode);
        linkNode.click();
      
        setTimeout(function () {
          document.body.removeChild(linkNode);
          window.URL.revokeObjectURL(downloadUrl);
          downloadVisible.value = false
          exportData = null
        }, 100)
      }
    };
  },
};
</script>
