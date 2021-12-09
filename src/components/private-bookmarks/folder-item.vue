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
  width 30px
  height 30px
  margin-right 4px
  border-radius 20px
  line-height 30px
  text-align center
  cursor pointer
  &:hover
    background #50505a
  &:active,
  &.active
    background #63aae3
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
  opacity 0
</style>
<template>
  <div
    :class="['folder-item', active === data.id ? 'active' : '']"
    :style="{
      paddingLeft: deep * 20 + 'px'
    }"
  >
    <div class="expand-btn" @click="isExpand = !isExpand">
      {{ isExpand ? 'v' : '>' }}
    </div>
    <div class="label" @click="$emit('select', data.id)">{{ data.label }}</div>
    <div class="add-btn">+</div>
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
  },
  setup(props) {
    const isExpand = ref(false)
    return {
      isExpand
    };
  },
};
</script>
