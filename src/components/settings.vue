<style lang="stylus" scoped>
.settings-mask
  position fixed
  width 100%
  height 100%
  top 0
  left 0
  z-index 10
  background: rgba(0, 0, 0, .5)
  backdrop-filter blur(2px)
.settings-btn
  position absolute
  top 10px
  right 20px
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
      <p style="padding: 24px 50px;font-size:24px">
      12121212<br/>
      12121212<br/>
      12121212<br/>
      12121212<br/>
      12121212<br/>
      12121212<br/>
      12121212<br/>
      12121212<br/>
      12121212<br/>
      12121212<br/>
      12121212<br/>
      12121212<br/>
      12121212<br/>
      </p>
    </div>
  </transition>
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
    toggleVisible() {
      this.settingVisible = !this.settingVisible
    },
    handleClickoutSide() {
      this.settingVisible = false
    },
  },
};
</script>
