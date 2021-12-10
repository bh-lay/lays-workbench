<style lang="stylus" scoped>
.folder-item
  display flex
  align-items center
  padding-right 15px
  &:hover
    .add-btn
      opacity 1
  &.active
    background #1679ca
    .label
      color #b6d9f7
.expand-btn
  display flex
  align-items center
  justify-content center
  width 30px
  height 30px
  margin-right 4px
  border-radius 20px
  cursor pointer
  svg
    transition .2s
    fill #aaa
  &:hover
    background #50505a
  &:active
    background #636780
    color #243542
.label
  width 50px
  flex-grow 1
  line-height 40px
  color #aaa
  font-size 13px
  cursor pointer
  transition .15s
  &:hover
    color #ddd
  &:active,
  &.active
    color #fff
.add-btn
  display flex
  align-items center
  justify-content center
  width 30px
  height 30px
  margin-right 4px
  border-radius 20px
  cursor pointer
  opacity 0
  svg
    width 18px
    transition .2s
    fill #aaa
  &:hover
    background #50505a
  &:active
    background #636780
    color #243542
</style>
<template>
  <div
    :class="['folder-item', active === data.id ? 'active' : '']"
    :style="{
      paddingLeft: deep * 15 + 'px'
    }"
  >
    <div :class="['expand-btn', isExpand ? 'expand' : '']" @click="isExpand = !isExpand">
      <v-mdi v-if="hasSubMenu" name="mdi-menu-down" :rotate="isExpand ? 0 : -90" />
    </div>
    <div class="label" @click="$emit('select', data.id)">{{ data.label }}</div>
    <div class="add-btn">
      <v-mdi name="mdi-plus" />
    </div>
  </div>
  <div v-if="isExpand" class="sub-folder">
    <slot />
  </div>
</template>

<script>
import { ref } from "vue";
// import FolderList from './folder-list.vue'
export default {
  // components: { FolderList },
  props: {
    data: {
      type: Object,
      default() {
        return {}
      },
    },
    deep: {
      type: Number,
      default: 0,
    },
    active: {
      type: String,
      default: 'root',
    },
    expand: {
      type: Boolean,
      default: false,
    },
  },
  setup(props) {
    const isExpand = ref(props.expand)
    return {
      isExpand,
      hasSubMenu: true,
    };
  },
};
</script>
