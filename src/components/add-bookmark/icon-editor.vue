<style lang="stylus" scoped>
.icon-editor
  display flex
  background #1a1d23
.dropdown-button
  display flex
  align-items center
  width 90px
  line-height 38px
  text-align center
  font-size 12px
  color #565d6c
  transition .1s
  span
    width 50px
    flex-grow 1
    text-align center
  &:hover,
  &.active
    background #2e333e
    color #c1c5cd
:global(.dropdown-button svg)
  fill currentColor !important
input
  display block
  width 20px
  padding 0 20px
  flex-grow 1
  background transparent
  border none
  color #c1c5cd
  &:focus
    outline none
.mdi-help
  display flex
  width 40px
  align-items center
  justify-content center
  cursor pointer
  color #727e97
  transition .15s
  svg
    width 14px
  &:hover
    background #292e38
  &:active
    background #555e72
.crab-message
  width 10px
  flex-grow 1
  padding-left 15px
  line-height 38px
  font-size 12px
  color #666
</style>

<template>
  <div class="icon-editor">
    <v-dropdown :arrow="true">
      <span>{{ iconTypeLabel }}</span>
      <template #body>
        <v-dropdown-item
          v-for="iconTypeItem in iconTypeList"
          :key="iconTypeItem.value"
          :class="[iconType === iconTypeItem.value ? 'active' : '']"
          @click="iconType = iconTypeItem.value"
        >
          {{ iconTypeItem.label }}
        </v-dropdown-item>
      </template>
    </v-dropdown>
    <input
      v-if="iconType !== 'crab'"
      v-model="inputValue"
      :maxlength="iconType === 'mdi' ? 30 : 6"
      type="text"
    >
    <div
      v-else
      class="crab-message"
    >
      将尝试自动抓取图标
    </div>
    <div
      v-if="iconType === 'mdi'"
      class="mdi-help"
      @click="openMdiHelp"
    >
      <v-mdi name="mdi-help" />
    </div>
  </div>
</template>

<script lang="ts">
import { ref, watch } from 'vue'
import { BookmarkIcon } from '@/database/entity/bookmark'
const iconTypeList = [
  {
    value: 'text',
    label: '文字图标',
  },
  {
    value: 'mdi',
    label: 'mdi图标',
  },
  {
    value: 'crab',
    label: '抓取图标',
  },
]
// 根据 icon type 获取对应文字说明
function getIconTypeLabel (iconType: string) {
  for(let i = 0; i < iconTypeList.length; i++) {
    if (iconTypeList[i].value === iconType) {
      return iconTypeList[i].label
    }
  }
  return '文字'
}
function formatIconData(iconConfig: BookmarkIcon) {
  const iconSplit = (iconConfig || '').split(':')
  let types = ''
  let value = ''
  let userEditText = ''
  if (iconSplit[0] === 'mdi') {
    types = 'mdi'
    value = iconSplit[1]
    userEditText = 'mdi-' + iconSplit[1]
  } else if (iconConfig === 'crab') {
    types = 'crab'
    value = ''
    userEditText = ''
  } else {
    types = 'text'
    value = '淦'
    userEditText = iconSplit[1]
  }
  return {
    types,
    value,
    userEditText,
  }
}
export default {
  props: {
    modelValue: {
      type: String,
      default: null,
    },
  },
  emits: ['update:modelValue'],
  setup(props, context) {
    const iconType = ref('')
    const iconTypeLabel = ref('')
    const iconValue = ref('')
    const inputValue = ref('')
    // 从参数解析数据
    function parseFromModelValue(newValue: string) {
      const { types, value, userEditText } = formatIconData(newValue as BookmarkIcon)
      if (types === iconType.value && value === iconValue.value) {
        return
      }
      iconType.value = types
      iconValue.value = value
      inputValue.value = userEditText
      iconTypeLabel.value = getIconTypeLabel(types)
    }
    watch(iconType, newIconType => {
      // 获取对应的说明文字
      iconTypeLabel.value = getIconTypeLabel(newIconType)
      // 生成对应的默认值，并获取文本
      let newModelValue: BookmarkIcon = 'crab'
      if (newIconType === 'mdi') {
        newModelValue = 'mdi:play'
      } else if (newIconType === 'text') {
        newModelValue = 'text:好看'
      } else {
        newModelValue = 'crab'
      }
      parseFromModelValue(newModelValue)
      context.emit('update:modelValue', newModelValue)
    })
    watch(inputValue, newValue => {
      const newIconType = iconType.value
      // 生成对应的默认值，并获取文本
      let newModelValue = ''
      if (newIconType === 'mdi') {
        iconValue.value = newValue.replace(/^mdi-/, '')
        newModelValue = 'mdi:' + iconValue.value
      } else if (newIconType === 'text') {
        iconValue.value = newValue
        newModelValue = 'text:' + newValue
      } else {
        // 理论上执行不到这一行
        return
      }
      context.emit('update:modelValue', newModelValue)
    })
    watch(() => props.modelValue, (newValue: string) => {
      parseFromModelValue(newValue)
    })
    parseFromModelValue(props.modelValue)
    return {
      iconType,
      iconTypeLabel,
      iconValue,
      iconTypeList,
      inputValue,
      openMdiHelp() {
        window.open('https://material.iconhelper.cn/', 'about:blank')
      },
    }
  },
}
</script>
