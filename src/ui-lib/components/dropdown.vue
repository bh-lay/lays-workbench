<style lang="stylus" scoped>
.dropdown-body
  position absolute
  background #fff
  z-index 1000
  cursor pointer
.dropdown-body
  border-radius 4px
  box-shadow 2px 2px 10px rgba(0, 0, 0, .2), 1px 1px 3px rgba(0, 0, 0, .2)
  overflow hidden
</style>

<template>
  <div class="dropdown-button" ref="button" @click="show"><slot /></div>
  <teleport to="body"
    >"
    <transition name="slidedown">
      <div
        class="dropdown-body"
        v-if="visible"
        v-clickoutside="onClickoutside"
        :style="{
          top: top + 'px',
          left: left + 'px',
        }"
      >
        <slot name="body" />
      </div>
    </transition>
  </teleport>
</template>

<script>
export default {
  emits: ['after-open', 'after-close'],
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
      const buttonBRC = this.$refs.button.getBoundingClientRect()
      this.left = buttonBRC.left
      this.top = buttonBRC.top + buttonBRC.height
    },
  },
};
</script>
