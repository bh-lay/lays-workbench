<style lang="stylus" scoped>
.item
  position relative
  display flex
  align-items center
  margin-bottom 10px
  padding-left 30px
  height 46px
  border-radius 4px
  color #bdbdc7
  cursor pointer
  transition .2s
  span
    padding-left 8px
    font-size 13px
  &:hover
    background rgba(0,0,0,0.2)
  &:active
    background rgba(0,0,0,0.4)
  &.active
    background rgba(0,0,0,0.2)
    color #198ae6
</style>

<template>
  <div
    v-for="item in categoryList"
    :key="item.name"
    :class="['item', modelValue === item.name ? 'active' : '']"
    @click="$emit('update:modelValue', item.name);"
  >
    <v-mdi
      :name="item.icon"
      size="18"
    />
    <span>{{ item.label }}</span>
  </div>
</template>

<script lang="ts">
const categoryList = [
  {
    name: 'define',
    label: '上传',
    icon: 'mdi-progress-upload',
  },
  {
    name: 'gallery',
    label: '壁纸库',
    icon: 'mdi-wallpaper',
  },
  {
    name: 'color',
    label: '纯色',
    icon: 'mdi-palette',
  },
]
export default {
  name: 'SettingsWallpaperCategory',
  props: {
    modelValue: {
      type: String,
      default: null,
    },
  },
  emits: ['update:modelValue'],
  setup() {
    return {
      categoryList,
    }
  },
}
</script>
