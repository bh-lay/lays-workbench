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
  &:hover
    background #181b20
    color #c1c5cd
  &:active,
  &.active
    background #16181d
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
    width 20px
    height 20px
  &:hover
    background #181b20
  &:active,
  &.active
    background #16181d
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
          v-for="iconTypeItem in iconTypeConfigList"
          :key="iconTypeItem.name"
          :active="iconType === iconTypeItem.name"
          @click="iconType = iconTypeItem.name"
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
import { ref, watch, PropType } from 'vue'
import { BookmarkIcon } from '@/database/entity/bookmark'

const iconTypeConfigList = [
  {
    name: 'text',
    label: '文字图标',
    default: '好看',
  },
  {
    name: 'mdi',
    label: 'mdi图标',
    default: 'mdi-heart-pulse',
  },
  {
    name: 'crab',
    label: '抓取图标',
    default: '',
  },
]
// 根据 iconType 获取对应配置
function getIconTypeConfig (iconType: string) {
  for(let i = 0; i < iconTypeConfigList.length; i++) {
    if (iconTypeConfigList[i].name === iconType) {
      return iconTypeConfigList[i]
    }
  }
  return iconTypeConfigList[0]
}

/**
 * 从图标数据，获取图标类型，用户输入值
 *   mdi:play   ->  ['mdi', 'mdi-play']
 *   text:play  ->  ['text', 'play']
 *   crab       ->  ['crab', '']
 */
function decodeModelValue(iconConfig: BookmarkIcon) {
  const iconSplit = (iconConfig || '').split(':')
  if (iconSplit[0] === 'mdi') {
    return ['mdi', 'mdi-' + iconSplit[1]]
  } else if (iconConfig === 'crab') {
    return ['crab', '']
  }
  return ['text', iconSplit[1]]
}

/**
 * 从图标类型、用户输入值，生成图标数据
 *   ['mdi', 'mdi-play']  ->  mdi:play
 *   ['text', 'play']     ->  text:play
 *   ['crab', '']         ->  crab
 */
function encodeModelValue(newIconType: string, inputValue: string): BookmarkIcon {
  if (newIconType === 'mdi') {
    const iconName = (inputValue || '').replace(/^mdi-/, '')
    // 经历过 replace 前后，值若不相等，则认为是合法的 mdi 配置
    if (inputValue !== iconName) {
      return `mdi:${iconName}`
    } else {
      // 否则，更正数据
      return 'mdi:'
    }
  } else if (newIconType === 'crab') {
    return 'crab'
  }
  return `text:${inputValue || ''}`
}

export default {
  props: {
    modelValue: {
      type: String as PropType<BookmarkIcon>,
      default: 'text: ',
    },
  },
  emits: ['update:modelValue'],
  setup(props: {
    modelValue: BookmarkIcon
  }, context) {
    const iconType = ref('')
    const inputValue = ref('')
    const iconTypeLabel = ref('')

    // 从应用图标数据，更新编辑器视图
    function applyBookmarkIcon(bookmarkIcon: BookmarkIcon) {
      // 从图标数据，获取图标类型，用户输入值
      const [ newIconType, newInputValue ] = decodeModelValue(bookmarkIcon)
      // 当图标类型和用户输入值相同时，不处理
      if (newIconType === iconType.value && newInputValue === inputValue.value) {
        return
      }
      // 更新数据
      iconType.value = newIconType
      inputValue.value = newInputValue
      iconTypeLabel.value = getIconTypeConfig(newIconType).label
    }
    // 监听用户交互操作行为
    function watchUserIntractive() {
      // 监听图标类型变化
      const unWatchIconType = watch(iconType, newIconType => {
        let defaultInputValue = getIconTypeConfig(newIconType).default
        let newModelValue: BookmarkIcon = encodeModelValue(newIconType, defaultInputValue)
        applyBookmarkIcon(newModelValue)
        context.emit('update:modelValue', newModelValue)
      })
      // 监听用户输入
      const unWatchInput = watch(inputValue, newInputValue => {
        // 避免粘贴时出现重复的 mdi-，尝试去删除
        if (newInputValue.match(/^mdi-mdi-/)) {
          newInputValue = newInputValue.replace(/^mdi-/, '')
        }
        const newModelValue = encodeModelValue(iconType.value, newInputValue)
        applyBookmarkIcon(newModelValue)
        context.emit('update:modelValue', newModelValue)
      })
      // 标记解除监听回调
      unWatchUserIntractive = () => {
        unWatchIconType()
        unWatchInput()
      }
    }
    // 解除用户交互操作行为监听
    let unWatchUserIntractive = () => {
      // nothind
    }
    // 监听父组件传入的数据变动
    watch(
      () => props.modelValue,
      (newValue: BookmarkIcon) => {
        // 解除用户操作监听
        unWatchUserIntractive()
        // 更新编辑器数据
        applyBookmarkIcon(newValue)
        // 创建用户操作监听
        watchUserIntractive()
      },
      {
        immediate: true,
      }
    )
    return {
      iconType,
      iconTypeLabel,
      iconTypeConfigList,
      inputValue,
      openMdiHelp() {
        window.open('https://material.iconhelper.cn/', 'material-help')
      },
    }
  },
}
</script>
