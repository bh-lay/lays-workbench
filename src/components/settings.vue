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
  &:hover,
  &.active
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
</style>

<template>
  <div
    :class="['settings-btn', settingVisible ? 'active' : '']"
    @mousedown.prevent
    @click="toggleVisible"
  >
    <v-mdi name="mdi-tune" />
  </div>
  <teleport to="body">
    <div v-show="settingModalVisible" class="settings-modal">
      <transition name="fade-slow">
        <div v-if="settingModalVisible && settingVisible" class="settings-mask"></div>
      </transition>
      <transition name="side-layer">
        <div
          class="settings-panel"
          v-if="settingModalVisible && settingVisible"
          v-clickoutside="handleClickoutSide"
          @mousedown.prevent
        >
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
import { ref, watch } from 'vue';

export default {
  setup() {
    const settingVisible = ref(false);
    const settingModalVisible = ref(false)
    
    let timer = null
    watch(settingVisible, isVisilbe => {
      clearTimeout(timer)
      if (isVisilbe) {
        settingModalVisible.value = true
      } else {
        timer = setTimeout(() => {
          settingModalVisible.value = false
        }, 1000)
      }
    })
    return {
      settingVisible,
      settingModalVisible,
    };
  },
  methods: {
    toggleVisible() {
      this.settingVisible = !this.settingVisible
    },
    handleClickoutSide() {
      this.settingVisible = false
    },
  },
};
</script>
