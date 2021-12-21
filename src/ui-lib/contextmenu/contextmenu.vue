<style lang="stylus">
.contextmenu-body
  position fixed
  padding 15px 0
  border-radius 4px
  box-shadow 2px 2px 10px rgba(0, 0, 0, .2), 1px 1px 3px rgba(0, 0, 0, .2)
  overflow hidden
  z-index 1000
  background #2f2f37
  .contextmenu-item
    color #bdbdc7
    &:hover
      background: #26262c
.contextmenu-item
  padding 0 20px
  line-height 42px
  font-size 14px
  cursor pointer
  transition .15s
</style>

<template>
  <teleport to="#v-ui">
    <transition name="slidedown">
      <div
        class="contextmenu-body"
        v-if="visible"
        v-clickoutside="onClickoutside"
        @click.stop
        @contextmenu.prevent
        :style="{
          width: width + 'px',
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
  props: {
    width: {
      type: [String, Number],
      default: 140,
    },
  },
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
