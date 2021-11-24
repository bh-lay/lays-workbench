<style lang="stylus" scoped>
.icon-editor
  display flex
  background #e7eaef
  border 1px solid #e7eaef
.dropdown-button
  display flex
  align-items center
  width 90px
  background #f3f4f7
  line-height 38px
  text-align center
  font-size 12px
  color #3d4c5c
  transition .1s
  span
    width 50px
    flex-grow 1
    text-align center
  svg
    transition .2s
    fill #b6bcce
  &:hover
    background #fff
  &.active
    svg
      transform rotate(180deg) !important
.icon-type-selector
  width 120px
  padding 15px 0
  .dropdown-item
    padding 0 20px
    line-height 34px
    font-size 14px
    color #555
    cursor pointer
    transition .15s
    &:hover
      background: #f4f4f4
input
  display block
  width 20px
  padding 0 20px
  flex-grow 1
  background transparent
  border none
  &:focus
    outline none
.mdi-help
  display flex
  width 40px
  align-items center
  justify-content center
  background: #f3f4f7
  cursor pointer
  color #3d4c5c
  transition .15s
  svg
    width 14px
  &:hover
    background #fff
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
    <dropdown>
      <span>{{ iconTypeLabel }}</span>
      <v-mdi name="mdi-menu-down" />
      <template v-slot:body>
        <div class="icon-type-selector">
          <dropdown-item
            v-for="iconTypeItem in iconTypeList"
            :key="iconTypeItem.value"
            :class="[iconType === iconTypeItem.value ? 'active' : '']"
            @click="iconType = iconTypeItem.value"
          >{{iconTypeItem.label}}</dropdown-item>
        </div>
      </template>
    </dropdown>
    <input
      v-if="iconType !== 'crab'"
      :maxlength="iconType === 'mdi' ? 30 : 6"
      v-model="inputValue"
      type="text"
    />
    <div v-else class="crab-message">将尝试自动抓取图标</div>
    <div v-if="iconType === 'mdi'" class="mdi-help" @click="openMdiHelp">
      <v-mdi name="mdi-help" />
    </div>
  </div>
</template>

<script>
import { ref, watch } from 'vue'
import bookmarkItem from '../bookmark-item.vue';
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
  }
]
// 根据 icon type 获取对应文字说明
function getIconTypeLabel (iconType) {
  for(let i = 0; i < iconTypeList.length; i++) {
    if (iconTypeList[i].value === iconType) {
      return iconTypeList[i].label
    }
  }
  return 'text'
}
function formatIconData(iconConfig) {
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
  components: { bookmarkItem },
  props: {
    modelValue: {
      type: String,
      default: null,
    },
  },
  setup(props, context) {
    const iconType = ref('')
    const iconTypeLabel = ref('')
    const iconValue = ref('')
    const inputValue = ref('')
    // 从参数解析数据
    function parseFromModelValue(newValue) {
      const { types, value, userEditText } = formatIconData(newValue)
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
      let newModelValue = ''
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
        iconValue.value = newValue.replace(/^mdi\-/, '')
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
    watch(() => props.modelValue, newValue => {
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
    };
  },
};
</script>
