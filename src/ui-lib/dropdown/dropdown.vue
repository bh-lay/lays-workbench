<style lang="stylus" scoped>
.dropdown-button
  cursor pointer
  svg
    transition .2s
    fill #b6bcce
.dropdown-body
  position fixed
  border-radius 4px
  background #fff
  box-shadow 2px 2px 10px rgba(0, 0, 0, .2), 1px 1px 3px rgba(0, 0, 0, .2)
  overflow hidden
  z-index 1002
</style>

<template>
  <div :class="['dropdown-button', visible ? 'active' : '']" ref="button" @click="show">
    <slot />
    <v-mdi v-if="arrow" name="mdi-menu-down" :rotate="visible ? -180 : 0" />
    <teleport to="body">
      <transition name="slidedown">
        <div
          class="dropdown-body"
          v-if="visible"
          v-clickoutside="onClickoutside"
          :style="{
            top: top + 'px',
            left: left + 'px',
            background: undercoat || '#fff'
          }"
        >
          <slot name="body" />
        </div>
      </transition>
    </teleport>
  </div>
</template>

<script>
export default {
  name: 'dropdown',
  props: {
    arrow: {
      type: Boolean,
      default: false,
    },
    undercoat: {
      type: String,
      default: '#fff'
    },
  },
  data() {
    return {
      left: 0,
      right: 0,
      visible: false,
    };
  },
  methods: {
    onClickoutside() {
      this.visible = false;
    },
    show() {
      if (this.visible) {
        return;
      }
      this.visible = true;
      const buttonBRC = this.$refs.button.getBoundingClientRect();
      this.left = buttonBRC.left;
      this.top = buttonBRC.top + buttonBRC.height;
    },
  },
};
</script>
