<style lang="stylus" scoped>
.easy-crop-pic-main {
  height 80vh
  max-width 1200px;
	.vue-image-filler-real-input{
		display: none;
	}
	.upload-panel{
		display: flex;
		align-items: center;
		justify-content: center;
		flex-direction: column;
		height: 400px;
    h1 {
      margin 0 0 80px
      font-size 26px
      letter-spacing 4px
      text-shadow 1px 1px 10px rgba(0, 0, 0, .3), 1px 1px 3px rgba(0, 0, 0, .3)
    }
		p {
			margin: 30px 0 0;
			font-size: 14px;
			color: #d3d9de
		}
	}
	.vue-image-filler-canvas{
		position: relative;
		height: 300px;
		overflow: hidden;
		// background: #ddd;
		cursor: grab;
		&:active{
			cursor: grabbing;
		}
	}
	.vue-image-filler-canvas-img{
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		pointer-events: none;
		:global(img){
			display: block;
			width: 100%
		}
	}
	.vue-image-filler-canvas-mask {
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		outline: 1000px solid rgba(0, 0, 0, .4);
		box-shadow: 0 0 10px rgba(0,0,0,.3), 0 0 3px rgba(0,0,0,.5);
	}
  .input-bar {
    display flex
    align-items center
    gap 10px
    padding 12px 20px
    background #334
  }
  .size-slider {
    width 200px
    max-width 300px
    flex-grow 1
    flex-shrink 1
    margin 0 auto
  }
}
</style>

<template>
  <div
    ref="outer"
    class="easy-crop-pic-main"
  >
    <input
      ref="uploadInput"
      type="file"
      accept="image/png, image/jpg, image/jpeg"
      class="vue-image-filler-real-input"
      @change="fileChangeHandle($event)"
    >
    <div
      v-if="!isFileSelected"
      class="upload-panel"
    >
      <h1 class="upload-panel-title">简裁变图</h1>
      <v-button
        type="primary"
        @click="triggerFileSelect"
      >
        选择图片
      </v-button>
      <p>仅支持 jpg、png、jpeg 格式文件上传！</p>
    </div>
    <template v-else>
      <div
        v-drag-start="dragStartHandle"
        class="vue-image-filler-canvas"
        :style="{
          height: size.canvasHeight + 'px',
        }"
      >
        <div
          ref="canvasImage"
          class="vue-image-filler-canvas-img"
          :style="{
            width: imageWidthInView + 'px',
            height: imageHeightInView + 'px',
            marginTop: size.offsetTop + 'px',
            marginLeft: size.offsetLeft + 'px'
          }"
        />
        <div
          class="vue-image-filler-canvas-mask"
          :style="{
            width: size.cropWidthInView + 'px',
            height: size.cropHeightInView + 'px',
          }"
        />
      </div>
      <div class="input-bar">
        <PhotoSizeSelector
          v-model:width="cropWidth"
          v-model:height="cropHeight"
        />

        <v-slider
          v-model="size.scale"
          :min="size.scaleMin"
          :max="size.scaleMax"
          :step="0.01"
          class="size-slider"
          @after-change="handleReRender"
        />
        <v-button
          class="reupload-btn"
          @click="triggerFileSelect"
        >
          换一张图
        </v-button>
        <v-button
          type="primary"
          @click="handleFileDownload"
        >
          下载
        </v-button>
      </div>
    </template>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, nextTick, onMounted, ref, watch, watchEffect } from 'vue'
import dragHandle from '@/assets/ts/drag-handle'
import PhotoSizeSelector from './photo-size-selector.vue'

function getBoxSizePlaceIntoAnotherBox(
  innerWidth: number,
  innerHeight: number,
  outerWidth: number,
  outerHeight: number
) {
  if (outerWidth / outerHeight > innerWidth / innerHeight) {
    return {
      width: outerHeight * innerWidth / innerHeight,
      height: outerHeight,
    }
  } else {
    return {
      width: outerWidth,
      height: outerWidth * innerHeight / innerWidth,
    }
  }
}
function downloadFile(file: File) {
  const url = URL.createObjectURL(file)
  const a = document.createElement('a')
  a.href = url
  a.download = file.name
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}
function captureImage(
  originImageNode: HTMLImageElement,
  cropWidth: number,
  cropHeight: number,
  cropWidthInView: number,
  cropHeightInView: number,
  imageWidthInView: number,
  imageHeightInView: number,
  offsetLeft: number,
  offsetTop: number
): Promise<Blob> {
  let canvas = document.createElement('canvas')
  canvas.width = cropWidth
  canvas.height = cropHeight
  let zoomRate = cropWidth / cropWidthInView
  let usedWidth = imageWidthInView * zoomRate
  let usedHeight = imageHeightInView * zoomRate
  let usedX = ((cropWidthInView - imageWidthInView) / 2 + offsetLeft) * zoomRate
  let usedY = ((cropHeightInView - imageHeightInView) / 2 + offsetTop) * zoomRate

  const context = canvas.getContext('2d')
  if (!context) {
    return Promise.reject()
  }
  context.drawImage(originImageNode, usedX, usedY, usedWidth, usedHeight)
  return new Promise((resolve) => {
    canvas.toBlob(fileBlob => {
      if (!fileBlob) {
        return Promise.reject()
      }
      resolve(fileBlob)
    }, 'image/jpeg', 0.95)
  })
}
export default defineComponent({
  name: 'EasyCropPicMain',
  components: { PhotoSizeSelector },
  props: {
    file: {
      type: File,
      default: undefined,
    },
  },
  setup(props) {
    const isFileSelected = ref(false)

    const originImageFile = ref<File | null>(null)
    let originImageNode: HTMLImageElement | null = null
    const size = ref({
      // 缩放配置
      scaleMin: 0.1,
      scaleMax: 2,
      scale: 5,
      // 画布尺寸
      canvasWidth: 0,
      canvasHeight: 400,
      // 剪裁区域视觉尺寸
      cropWidthInView: 0,
      cropHeightInView: 0,
      // 图片原始尺寸
      imageWidth: 0,
      imageHeight: 0,
      // 偏移尺寸
      offsetTop: 0,
      offsetLeft: 0,
    })

    const outer = ref<HTMLDivElement | null>(null)
    const uploadInput = ref<HTMLInputElement | null>(null)
    const canvasImage = ref<HTMLDivElement | null>(null)

    const cropWidth = ref(413)
    const cropHeight = ref(579)
    const imageWidthInView = computed(() => size.value.imageWidth * size.value.scale)
    const imageHeightInView = computed(() => size.value.imageHeight * size.value.scale)

    watchEffect(() => {
      const offsetLeftRange = (imageWidthInView.value - size.value.cropWidthInView) / 2
      const offsetTopRange = (imageHeightInView.value - size.value.cropHeightInView) / 2
      if (size.value.offsetLeft > offsetLeftRange) {
        size.value.offsetLeft = offsetLeftRange
      } else if (size.value.offsetLeft < -offsetLeftRange) {
        size.value.offsetLeft = -offsetLeftRange
      }

      if (size.value.offsetTop > offsetTopRange) {
        size.value.offsetTop = offsetTopRange
      } else if (size.value.offsetTop < -offsetTopRange) {
        size.value.offsetTop = -offsetTopRange
      }
    })

    const triggerFileSelect = () => {
      uploadInput.value?.dispatchEvent(new MouseEvent('click'))
    }

    function fileChangeHandle(event: Event) {
      const eventTarget = event.target as null | {
        files: File[]
      }
      putFileToEditor(eventTarget?.files[0] as File)
      // event.target.value = ''
    }
    function buildCanvasSize() {
      size.value.canvasWidth = outer.value?.clientWidth || 600
      size.value.canvasHeight = (outer.value?.clientHeight || 300) - 100
    }
    function putFileToEditor(file: File) {
      let fileBlobURL = window.URL.createObjectURL(new Blob([file]))
      let image = new Image()
      image.onload = () => {
        putImageToEditor(image)
      }
      image.src = fileBlobURL
      originImageNode = image
    }
    function putImageToEditor(image: HTMLImageElement) {
      size.value.imageWidth = image.width || image.naturalWidth
      size.value.imageHeight = image.height || image.naturalHeight
      let { width, height } = getBoxSizePlaceIntoAnotherBox(cropWidth.value, cropHeight.value, size.value.canvasWidth, size.value.canvasHeight)
      size.value.cropWidthInView = width * 0.8
      size.value.cropHeightInView = height * 0.8

      size.value.scaleMin = Math.max(size.value.cropWidthInView / size.value.imageWidth, size.value.cropHeightInView / size.value.imageHeight)
      // 最大放大系数限定为三倍
      size.value.scaleMax = size.value.scaleMin * 3
      size.value.scale = size.value.scaleMin
      size.value.offsetTop = 0
      size.value.offsetLeft = 0

      isFileSelected.value = true
      nextTick(() => {
        if (!canvasImage.value) {
          return
        }
        canvasImage.value.innerHTML = ''
        canvasImage.value.appendChild(image)
      })
    }

    async function getCropedFile() {
      if (!originImageNode) {
        return null
      }
      const fileBlob = await captureImage(
        originImageNode,
        cropWidth.value,
        cropHeight.value,
        size.value.cropWidthInView,
        size.value.cropHeightInView,
        imageWidthInView.value,
        imageHeightInView.value,
        size.value.offsetLeft,
        size.value.offsetTop
      )
      const tempId = Date.now().toString(32)
      return new File(
        [fileBlob],
        `crop-${tempId} [e.bh-lay.com].jpg`,
        {
          type: 'image/jpeg',
          lastModified: Date.now(),
        }
      )
    }
    async function handleReRender() {
      // let file = getCropedFile()
      // previewImageUrl.value = URL.createObjectURL(fileBlob)
    }

    onMounted(() => {
      buildCanvasSize()
      if (props.file) {
        // eslint-disable-next-line vue/no-setup-props-destructure
        originImageFile.value = props.file
        putFileToEditor(props.file)
      }
    })
    watch([cropWidth, cropHeight], () => {
      originImageNode && putImageToEditor(originImageNode)
    })
    return {
      isFileSelected,
      size,
      outer,
      uploadInput,
      canvasImage,
      cropWidth,
      cropHeight,
      imageWidthInView,
      imageHeightInView,
      triggerFileSelect,
      fileChangeHandle,
      handleReRender,
      dragStartHandle(event: MouseEvent) {
        const offsetTopStart = size.value.offsetTop
        const offsetLeftStart = size.value.offsetLeft
        const offsetLeftRange = (imageWidthInView.value - size.value.cropWidthInView) / 2
        const offsetTopRange = (imageHeightInView.value - size.value.cropHeightInView) / 2

        dragHandle(
          event,
          {
            move({ xOffset, yOffset }) {
              let newOffsetTop = offsetTopStart + yOffset
              let newOffsetLeft = offsetLeftStart + xOffset
              size.value.offsetTop = Math.max(Math.min(newOffsetTop, offsetTopRange), -offsetTopRange)
              size.value.offsetLeft = Math.max(Math.min(newOffsetLeft, offsetLeftRange), -offsetLeftRange)
            },
            end() {
              // handleReRender()
            },
          }
        )
      },
      async handleFileDownload() {
        const file = await getCropedFile()
        file && downloadFile(file)
      },
    }
  },
})
</script>
