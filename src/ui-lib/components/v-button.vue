<style lang="stylus" scoped>
.v-button
  display inline-block
  vertical-align bottom
  padding 10px 20px
  border-radius 4px
  line-height 18px
  font-size 14px
  text-decoration none
  cursor pointer
  transition .15s
  &:focus
    outline none
  & + .v-button
    margin-left 8px
  :deep .mdi-icon
    width 18px
    height 18px
    margin 0
    vertical-align bottom
.v-button.is-disabled
  cursor not-allowed
  opacity .5
  pointer-events none
.v-button-default
  background #2f2f37
  border 1px solid #515161
  color #bdbdc7
  &:hover
    background #3a3a40
  &:active
    background #212126
  &:focus
    border-color #2154ba
.v-button-primary
  background #2196f3
  border 1px solid #2196f3
  color #fff
  &:hover
    background #0b75cb
    border-color #0b75cb
  &:active
    background #0961aa
    border-color #0961aa
  &:focus
    border-color #2154ba
.v-button-secondary
  background transparent
  border 1px solid transparent
  color #bdbdc7
  &:hover
    background #3a3a40
  &:active
    background #212126
  &:focus
    border-color #2154ba
</style>

<template>
  <a
    v-if="href"
    :href="href"
    :target="target"
    :class="['v-button', 'v-button-' + type, { 'is-disabled': disabled }]"
    :aria-disabled="disabled ? 'true' : undefined"
  >
    <slot />
  </a>
  <button
    v-else
    :class="['v-button', 'v-button-' + type, { 'is-disabled': disabled }]"
    :disabled="disabled"
  >
    <slot />
  </button>
</template>

<script setup lang="ts">
defineProps({
  type: {
    type: String,
    default: 'default',
  },
  href: {
    type: String,
    default: undefined,
  },
  target: {
    type: String,
    default: undefined,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
})
</script>
