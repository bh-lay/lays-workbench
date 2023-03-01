<style lang="stylus" scoped>
.custom-link
  padding 20px 0
.input-item
  margin-bottom 20px
  .label
    height 14px
    margin-bottom 6px
    line-height 14px
    font-size 12px
    color #6f6f85
.undercoat
  display inline-block
  width 50px
  height 26px
  border 4px solid #1a1d23
  border-radius 4px
  text-align center
  &:before
    content: '底色'
    display block
    width 24px
    height 100%
    writing-mode vertical-lr
    background #1a1d23
    line-height 20px
    font-size 12px
    color #565d6c
.size-selector
  margin-left 10px
.footer
  display flex
  justify-content space-between
  padding-top 20px
  text-align right
</style>

<template>
  <div class="custom-link">
    <div class="input-item">
      <div class="label">
        事件名称
      </div>
      <v-input
        v-model="eventName"
        type="text"
        placeholder="输入事件名称"
        maxlength="20"
      />
    </div>
    <div class="input-item">
      <div class="label">
        目的时间 <small style="float: right;">例：2024-12-23 12:23:21</small>
      </div>
      <v-input
        v-model="eventTime"
        v-focus
        type="text"
        placeholder="输入目标时间"
      />
    </div>
    <div class="footer">
      <v-dropdown
        class="undercoat"
        type="plain"
        :style="{
          background: undercoat
        }"
      >
        <template #body>
          <color-selector v-model="undercoat" />
        </template>
      </v-dropdown>
      <v-button @click="confirm">
        确定
      </v-button>
    </div>
  </div>
</template>

<script lang="ts">
import { Bookmark, bookmarkOriginData } from '@database/entity/bookmark'
import { Message } from '@/ui-lib/message/index'
import ColorSelector from '../../add-bookmark/color-selector.vue'
import { splitInFirstColon } from '@/assets/ts/utils'
import { ref } from 'vue'
import { timeFormat } from '@/assets/ts/utils'

export default {
  components: { ColorSelector },
  props: {
    data: {
      type: Bookmark,
      default() {
        return null
      },
    },
  },
  emits: ['confirm'],
  setup(props: {
    data: Bookmark
  }, context) {
    const paramsSeprator = '-|-'
    const propsBookmark = props.data as bookmarkOriginData
    const widgetsValue = propsBookmark.value as string || ''
    const [widgetsType, widgetsParams] = splitInFirstColon(widgetsValue)

    const undercoat = ref(propsBookmark.undercoat)
    const eventName = ref(propsBookmark.name)
    const eventTime = ref(timeFormat(new Date().getTime() + 1000 * 60 * 60 * 24 * 30))
    if (widgetsParams) {
      const [eventNameInParams, eventTimeInParams] = widgetsParams.split(paramsSeprator)
      if (eventNameInParams) {
        eventName.value = eventNameInParams
        eventTime.value = timeFormat(parseInt(eventTimeInParams, 10))
      }
    }
    return {
      undercoat,
      eventName,
      eventTime,
      confirm() {
        if (!eventName.value) {
          new Message({
            message: '事件名没有写哦～',
          })
          return
        }
        if (!eventTime.value) {
          new Message({
            message: '事件截止时间一定要填哦～',
          })
          return
        }
        const eventTimeStample = new Date(eventTime.value).getTime()
        context.emit('confirm', {
          undercoat: undercoat.value,
          value: `${widgetsType}:${eventName.value}${paramsSeprator}${eventTimeStample}`,
        })
      },
    }
  },
}
</script>
