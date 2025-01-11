<style lang="stylus" scoped>
  .size-input {
    width: 120px
  }
  .size-selector-body
    box-sizing border-box
    width 600px
    max-width 90vw
    padding 20px
    .manual-input
      display flex
      gap 12px
      align-items center
      color #fff
      .v-input
        width 120px
    .photo-size-map
      display flex
      gap 12px
      padding 40px 0 10px
      .photo-size-list
        flex-grow 1
</style>

<template>
  <v-dropdown
    placement="top-left"
    :offset="{
      top: -10
    }"
  >
    <v-button>{{ width }} x {{ height }}</v-button>
    <template #body>
      <div class="size-selector-body">
        <div class="manual-input">
          <v-input
            :model-value="width"
            type="number"
            @update:model-value="$emit('update:width', $event)"
          />
          <span>x</span>
          <v-input
            :model-value="height"
            type="number"
            @update:model-value="$emit('update:height', $event)"
          />
        </div>

        <div class="photo-size-map">
          <PhotoSizeList
            title="常见尺寸"
            :width="width"
            :height="height"
            :list="normalSizes"
            @request-change-size="handleChangeSize"
          />
          <PhotoSizeList
            title="考试报名"
            :width="width"
            :height="height"
            :list="examSignupPhotoSizes"
            @request-change-size="handleChangeSize"
          />
          <PhotoSizeList
            title="证件照"
            :width="width"
            :height="height"
            :list="idPhoneSizes"
            @request-change-size="handleChangeSize"
          />
        </div>
      </div>
    </template>
  </v-dropdown>
</template>

<script setup lang="ts">
import PhotoSizeList from './photo-size-list.vue'
// import { getAppConfigItem } from '@/assets/ts/app-config'
// import { ref } from 'vue'

defineProps({
  width: {
    type: Number,
    default: 200,
  },
  height: {
    type: Number,
    default: 200,
  },
})
const emits = defineEmits(['update:width', 'update:height'])
const normalSizes = [
  {
    label: '一寸',
    width: 295,
    height: 413,
  },
  {
    label: '大一寸',
    width: 390,
    height: 567,
  },
  {
    label: '小二寸',
    width: 413,
    height: 531,
  },
  {
    label: '二寸',
    width: 413,
    height: 579,
  },
  {
    label: '五寸',
    width: 1050,
    height: 1500,
  },
  {
    label: '五寸竖版',
    width: 1500,
    height: 1050,
  },
]
const examSignupPhotoSizes = [
  {
    label: '公务员审核工具',
    width: 295,
    height: 413,
  },
  {
    label: '公务员34cmx45cm',
    width: 402,
    height: 531,
  },
  {
    label: '公务员小',
    width: 130,
    height: 170,
  },
  {
    label: '司法考试',
    width: 413,
    height: 626,
  },
  {
    label: '四六级/计算机',
    width: 144,
    height: 192,
  },
  {
    label: '会计',
    width: 114,
    height: 156,
  },
  {
    label: '普通话测试',
    width: 413,
    height: 579,
  },
  {
    label: '高考/考研',
    width: 480,
    height: 640,
  },
  {
    label: '日语',
    width: 360,
    height: 480,
  },
]

const idPhoneSizes = [
  {
    label: '身份证',
    width: 358,
    height: 441,
  },
  {
    label: '社保照片',
    width: 358,
    height: 441,
  },
  {
    label: '毕业证',
    width: 480,
    height: 640,
  },
  {
    label: '教师资格证',
    width: 295,
    height: 413,
  },
  {
    label: '护照',
    width: 390,
    height: 567,
  },
]
function handleChangeSize(width: number, height: number) {
  emits('update:width', width)
  emits('update:height', height)
}
</script>
