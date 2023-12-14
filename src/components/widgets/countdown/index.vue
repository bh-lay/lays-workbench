<style lang="stylus" scoped>
.widgets-countdown
  display flex
  flex-direction column
  background-image linear-gradient(349deg, rgba(0, 0, 0, 0.4), transparent), linear-gradient(34deg, rgba(255, 255, 255, 0.2), transparent)
  box-shadow inset 1px 1px 1px rgba(255, 255, 255, .1), inset -1px -1px 1px rgba(0, 0, 0, .2)
.title
  padding-top 12px
  line-height 20px
  font-size 16px
  font-weight bolder
  text-align center
  opacity .9
.countdown-time-list
  display flex
  justify-content center
  align-items center
  flex-grow 1
  margin 0 0.5em
  gap 0.3em
  .item
    flex-grow 1
    text-align center
    .num
      white-space nowrap
      line-height 0
    .label
      padding-top 5px
      line-height 14px
      white-space nowrap
      font-size 12px
      opacity .25
.end-time
  padding-bottom 6px
  line-height 16px
  text-align center
  font-size 12px
  opacity 0.5
</style>
<style>
.item-size-small .countdown-time-list .item {
  font-size: 1.6em
}
</style>
<template>
  <div
    class="widgets-countdown"
    :style="{
      backgroundColor: widgetsUndercoat,
      color: textColor
    }"
    @click="handleClick"
  >
    <div
      v-if="widgetsSize !== BookmarkSize.small"
      class="title"
    >
      {{ eventName }}
    </div>
    <div
      class="countdown-time-list"
      :style="{
        fontSize: 0.4 / Math.max(timeLeftArray.length, 3.6) + 'em'
      }"
    >
      <div v-if="timeLeftArray.length === 0">
        到站
      </div>
      <template v-else>
        <div
          v-for="item in timeLeftArray"
          :key="item[1]"
          class="item"
        >
          <div class="num">
            <SevenSegmentDisplay :value="leftPad(item[0])" />
          </div>
          <div class="label">
            {{ item[1] }}
          </div>
        </div>
      </template>
    </div>
    <div
      v-if="widgetsSize !== BookmarkSize.small"
      class="end-time"
    >
      {{ timeFormat(eventEndTime) }}
    </div>

    <v-modal
      v-model="editModalVisible"
      :width="400"
    >
      <div style="padding: 20px">
        <countdown-editor
          :data="$props.data"
          @confirm="handleDataChange"
        />
      </div>
    </v-modal>
  </div>
</template>

<script lang="ts">
import {
  bookmarkUpdateService,
} from '@database/services/bookmark-service'
import { ref, computed, Ref, watch, onBeforeUnmount, ComputedRef } from 'vue'
import { Bookmark, BookmarkSize } from '@database/entity/bookmark'
import { SevenSegmentDisplay } from 'vue3-seven-segment-display'
import CountdownEditor from './countdown-editor.vue'
import { leftPad, splitInFirstColon, timeFormat } from '@/assets/ts/utils'
import { anyColorToHsl, formatHslToHex } from '@/assets/ts/color-conversion'

const timeOneSecond = 1000
const timeOneMinutes = timeOneSecond * 60
const timeOneHour = timeOneMinutes * 60
const timeOneDay = timeOneHour * 24

type timeLeftList = [number, string][]
function calTimeLeft (endTime: number) {
  const now = new Date().getTime()
  let timeLeft = endTime - now
  if (timeLeft < 0) {
    return []
  }
  const daysLeft = Math.floor(timeLeft / timeOneDay)
  timeLeft -= daysLeft * timeOneDay

  const hoursLeft = Math.floor(timeLeft / timeOneHour)
  timeLeft -= hoursLeft * timeOneHour

  const minutesLeft = Math.floor(timeLeft / timeOneMinutes)
  timeLeft -= minutesLeft * timeOneMinutes

  const secondsLeft = Math.floor(timeLeft / timeOneSecond)
  const result: timeLeftList = []
  if (daysLeft > 0) {
    result.push([daysLeft, '天'])
  }
  if (result.length || hoursLeft > 0) {
    result.push([hoursLeft, '小时'])
  }
  if (result.length ||minutesLeft > 0) {
    result.push([minutesLeft, '分钟'])
  }
  if (result.length || secondsLeft > 0) {
    result.push([secondsLeft, '秒'])
  }
  return result
}

function startTimer(eventEndTime: Ref<number>, widgetsSize: ComputedRef<BookmarkSize>, timeLeftArray: Ref<timeLeftList> ) {
  const timer = setInterval(() => {
    let newTimeLeftList = calTimeLeft(eventEndTime.value)
    if (widgetsSize.value === BookmarkSize.small && newTimeLeftList.length) {
      newTimeLeftList = [newTimeLeftList[0]]
    }
    timeLeftArray.value = newTimeLeftList
    if (newTimeLeftList.length === 0) {
      stopTimer()
    }
  }, 200)
  const stopTimer = () => {
    clearInterval(timer)
  }
  return stopTimer
}
export default {
  components: { SevenSegmentDisplay, CountdownEditor },
  props: {
    data: {
      type: Bookmark,
      default() {
        return new Bookmark({})
      },
    },
    params: {
      type: String,
      default: '',
    },
  },
  setup(props: { data: Bookmark, params: string }) {
    const eventEndTime = ref(new Date().getTime() + 1000 * 60 * 60 * 1.43)
    const eventName = ref('倒计时')
    const timeLeftArray: Ref<timeLeftList> = ref([])
    const editModalVisible = ref(false)
    const defaultUndercoat = '#2B393D'

    const widgetsSize = computed(() => props.data.size)
    const widgetsUndercoat = computed(() => props.data.undercoat || defaultUndercoat)

    let stopTimer = startTimer(eventEndTime, widgetsSize, timeLeftArray)
    onBeforeUnmount(() => {
      stopTimer()
    })

    watch(
      () => props.data.value,
      (value: string | boolean) => {
        if (typeof value === 'string') {
          const [, widgetsParams] = splitInFirstColon(value)
          if (widgetsParams) {
            const paramsSeprator = '-|-'
            const [eventNameInParams, eventTimeInParams] = widgetsParams.split(paramsSeprator)
            eventName.value = eventNameInParams
            eventEndTime.value = parseInt(eventTimeInParams, 10)

            stopTimer = startTimer(eventEndTime, widgetsSize, timeLeftArray)
          }
        }
      },
      {
        immediate: true,
      }
    )

    const textColor = ref(defaultUndercoat)
    watch(
      () => props.data.undercoat,
      (value) => {
        const [h, , l] = anyColorToHsl(value || defaultUndercoat)
        if (l < 0.6) {
          // 区块亮度小于 60%，文本使用和区块同色系的浅色色
          textColor.value = formatHslToHex(h, 0.2, 0.85)
        } else {
          // 区块亮度大于等于 60%，文本使用和区块同色系的深色
          textColor.value = formatHslToHex(h, 0.2, 0.2)
        }
      },
      {
        immediate: true,
      }
    )
    return {
      BookmarkSize,
      widgetsSize,
      textColor,
      widgetsUndercoat,
      eventEndTime,
      eventName,
      timeLeftArray,
      editModalVisible,
      handleClick() {
        editModalVisible.value = true
      },
      handleDataChange(params: {undercoat: string, value: string}) {
        props.data.undercoat = params.undercoat
        props.data.value = params.value
        bookmarkUpdateService(props.data)
        editModalVisible.value = false
      },
      leftPad,
      timeFormat,
    }
  },
}
</script>
