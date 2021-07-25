<style lang="stylus" scoped>
.settings-btn
  position absolute
  top 20px
  right 20px
  width 40px
  height 40px
  cursor pointer
  z-index 15
  &:hover
    background #333
.settings-panel
  position absolute
  top 0
  right 0
  width 500px
  height 100%
  background #fff
  z-index 10
</style>

<template>
  <div
    class="settings-btn"
    @mousedown.prevent
    @click="toggleVisible"
  >
    设置 {{ settingVisible }}
  </div>
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
