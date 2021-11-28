<style lang="stylus" scoped>
.contextmenu-body
  position fixed
  width 120px
  padding 15px 0
  border-radius 4px
  background #fff
  box-shadow 2px 2px 10px rgba(0, 0, 0, .2), 1px 1px 3px rgba(0, 0, 0, .2)
  overflow hidden
  z-index 1000
</style>

<template>
  <teleport to="body">
    <transition name="slidedown">
      <div
        class="contextmenu-body"
        v-if="visible"
        v-clickoutside="onClickoutside"
        :style="{
          top: top + 'px',
          left: left + 'px',
        }"
      >
        <slot />
      </div>
    </transition>
  </teleport>
</template>

<script>
export default {
  name: 'contextmenu',
  data() {
    return {
      top: 0,
      left: 0,
      visible: false,
    };
  },
  methods: {
    onClickoutside() {
      this.visible = false;
    },
  },
};
</script>
