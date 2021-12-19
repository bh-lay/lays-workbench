<style lang="stylus" scoped>
.settings-btn
  width 36px
  height 36px
  display flex
  align-items center
  justify-content center
  cursor pointer
  border 1px solid rgba(255, 255, 255, .1)
  border-radius 4px
  transition .2s ease-in-out
  svg
    height 20px
    fill #fff
  &:hover
    border-color rgba(255, 255, 255, .5)
    background rgba(255, 255, 255, .2)
  &:active
    border-color #fff
    background rgba(255, 255, 255, .35)
.settings-modal
  position fixed
  width 100%
  height 100%
  top 0
  left 0
  z-index 10
.settings-mask
  position relative
  height 100%
  background rgba(0, 0, 0, .3)
.settings-panel
  display flex
  flex-direction column
  position absolute
  top 0
  right 0
  width 380px
  max-width: 100%
  height 100%
  background rgba(255, 255, 255, .5)
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
  position relative
  display flex
  justify-content space-between
  align-items center
  height 30px
  padding 10px 20px 10px 20px
  background #fff
  box-shadow 0 0 3px rgba(0, 0, 0, .2)
  .title
    font-size 14px
    color #333
  .modal-close
    width 32px
    height 32px
    display flex
    align-items center
    justify-content center
    color #aaa
    cursor pointer
    transition .15s
    &:hover
      color #333
      background #f4f4f4
    &:active
      background #eee
.scroll-body
  height 100px
  flex-grow 1
  overflow auto
  &::-webkit-scrollbar
    width 0
    height 0
</style>

<template>
  <div
    class="settings-btn"
    @mousedown.prevent
    @click="settingVisible = true"
  >
    <v-mdi name="mdi-tune" />
  </div>
  <teleport to="#v-ui">
    <div :class="['settings-modal', settingVisible ? '' : 'hidden']">
      <transition name="fade-slow">
        <div v-if="settingVisible" class="settings-mask"></div>
      </transition>
      <transition name="side-layer">
        <div
          class="settings-panel"
          v-if="settingVisible"
          @mousedown.prevent
        >
          <div class="header">
            <div class="title">应用配置</div>
            <div class="modal-close" @click="settingVisible = false">
              <v-mdi name="mdi-close" />
            </div>
          </div>
          <div class="scroll-body">
            <settings-list
              @wallpaper-setting="handleSetWallpaper"
            />
          </div>
        </div>
      </transition>
    </div>
  </teleport>
</template>

<script>
import { ref } from 'vue';
import SettingsList from './settings-list.vue'

export default {
  emits: [],
  components: { SettingsList },
  setup(props, context) {
    const settingVisible = ref(false);
    return {
      settingVisible,
      handleSetWallpaper() {
        settingVisible.value = false
      }
    };
  },
};
</script>
