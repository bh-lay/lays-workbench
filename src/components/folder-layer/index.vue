<style lang="stylus" scoped>
.folder-layer
  position fixed
  top 0
  left 0
  width 100%
  height 100%
  display flex
  align-items center
  justify-content center
  z-index 1000
  &.hidden
    // 各种方法保证视觉上弹窗不可见，且不影响动画显示
    pointer-events none
    visibility hidden
    opacity 0
    width 0
    height 0
    transition .1s 1s
.mask
  position absolute
  top 0
  left 0
  width 100%
  height 100%
  background rgba(0, 0, 0, .7)
.container
  position relative
  width 675px
  min-height 260px
  padding 40px
  border-radius 30px
  background #252b31
  overflow auto
  &::-webkit-scrollbar
    width 0
    height 0
@media screen and (max-width: 770px)
  .container
    flex-shrink 1
    margin 20px
</style>

<template>
<teleport to="body">
  <div :class="['folder-layer', visible ? 'visible' : 'hidden']">
    <transition name="fade-slow">
      <div v-if="visible" class="mask" @click="$emit('update:visible', false)"></div>
    </transition>
    <transition name="zoom">
      <div v-if="visible" class="container" @click.stop>
        <name-editor :modelValue="name" @update:modelValue="handleNameChange" />
        <div class="btn-list">
          <bookmark-list :parent-id="id"
            @open-bookmark-editor="$emit('open-bookmark-editor', $event)"
          />
        </div>
      </div>
    </transition>
  </div>
</teleport>
</template>

<script>
import {
  ref,
  nextTick,
  watch,
  onMounted,
  onBeforeUpdate,
} from 'vue';
import NameEditor from './name-editor.vue'
import BookmarkList from './bookmark-list.vue'

export default {
  emits: ['update:visible', 'name-change', 'open-bookmark-editor', 'after-close'],
  props: {
    id: {
      type: String,
      default: ''
    },
    name: {
      type: String,
      default: ''
    },
    visible: {
      type: Boolean,
      default: false,
    },
  },
  components: { NameEditor, BookmarkList },
  setup(props, context) {
    watch(() => props.visible, visible => {
      if (!visible) {
        context.emit('after-close', props.id)
      }
    },)
    return {
      handleNameChange(newValue) {
        context.emit('name-change', newValue)
      },
    };
  },
};
</script>
