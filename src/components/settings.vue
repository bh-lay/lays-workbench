<style lang="stylus" scoped>
.settings-btn
  width 40px
  height 40px
  line-height 40px
  text-align center
  cursor pointer
  z-index 12
  svg
    height 20px
    vertical-align text-bottom
    fill #fff
    transition .2s ease-in-out
  &:hover
    svg
      fill #333

.settings-modal
  position fixed
  width 100%
  height 100%
  top 0
  left 0
  z-index 10
  perspective 800px
.settings-mask
  position relative
  height 100%
  background: rgba(0, 0, 0, .5)
  backdrop-filter blur(2px)
.settings-panel
  position absolute
  top 0
  right 0
  width 500px
  max-width: 100%
  height 100%
  background #fff
  z-index 11
.hidden
  // 各种方法保证视觉上弹窗不可见，且不影响动画显示
  pointer-events none
  visibility hidden
  opacity 0
  width 0
  height 0
  transition .1s 1s

.header
  padding 20px
  border-bottom 1px solid #eee
  text-align right
</style>

<template>
  <div
    class="settings-btn"
    @mousedown.prevent
    @click="settingVisible = true"
  >
    <v-mdi name="mdi-tune" />
  </div>
  <teleport to="body">
    <div :class="['settings-modal', settingVisible ? '' : 'hidden']">
      <transition name="fade-slow">
        <div v-if="settingVisible" class="settings-mask"></div>
      </transition>
      <transition name="side-layer">
        <div
          class="settings-panel"
          v-if="settingVisible"
          v-clickoutside="handleClickoutSide"
          @mousedown.prevent
        >
          <div class="header">
            <button @click="settingVisible = false">完成</button>
          </div>
          <p style="padding: 24px 50px;font-size:24px">
          设置功能正在开发中<br/>
          包含背景图设置、图标管理等功能
          </p>
        </div>
      </transition>
    </div>
  </teleport>
</template>

<script>
import { ref } from 'vue';

export default {
  setup() {
    const settingVisible = ref(false);
    return {
      settingVisible,
    };
  },
  methods: {
    handleClickoutSide() {
      this.settingVisible = false
    },
  },
};
</script>
