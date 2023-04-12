<style lang="stylus" scoped>
.dropdown-button
  cursor pointer
  svg
    transition .2s
    fill currentColor
.dropdown-body
  position fixed
  z-index 1002
  min-width 140px
.dropdown-body-default
  border-radius 4px
  background #2f2f37
  box-shadow 2px 2px 10px rgba(0, 0, 0, .2), 1px 1px 3px rgba(0, 0, 0, .2)
  padding 15px 0
</style>

<template>
  <div
    ref="buttonRef"
    :class="['dropdown-button', visible ? 'active' : '']"
    @click="onClickButton"
  >
    <slot />
    <v-mdi
      v-if="arrow"
      name="mdi-menu-down"
      :rotate="visible ? -180 : 0"
    />
    <teleport to="#v-ui">
      <transition name="slidedown">
        <div
          v-if="visible"
          ref="bodyRef"
          v-clickoutside="onClickoutside"
          :class="['dropdown-body', `dropdown-body-${type}`]"
          :style="{
            top: top + 'px',
            left: left + 'px',
          }"
        >
          <slot name="body" />
        </div>
      </transition>
    </teleport>
  </div>
</template>

<script setup lang="ts">
import { nextTick, provide, ref } from 'vue'

const props = defineProps({
  arrow: {
    type: Boolean,
    default: false,
  },
  placement: {
    type: String,
    default: 'bottom-left',
  },
  type: {
    type: String,
    // default、plain、dark
    default: 'default',
  },
})

provide('close-dropdown', () => {
  visible.value = false
})

const top = ref(0)
const left = ref(0)
const visible = ref(false)
const buttonRef = ref(null)
const bodyRef = ref(null)

function onClickButton() {
  if (visible.value) {
    return
  }
  visible.value = true
  const buttonNode = buttonRef.value as HTMLDivElement | null

  if (!buttonNode) {
    return
  }
  const buttonBRC = buttonNode.getBoundingClientRect()
  if (props.placement === 'bottom-right') {
    nextTick(() => {
      const bodyNode = bodyRef.value as HTMLDivElement | null
      let bodyWidth = 300
      if (bodyNode) {
        bodyWidth = bodyNode.clientWidth
      }
      top.value = buttonBRC.top + buttonBRC.height
      left.value = buttonBRC.left + buttonBRC.width - bodyWidth
    })
  } else {
    // default
    // if (props.placement === 'bottom-left')
    top.value = buttonBRC.top + buttonBRC.height
    left.value = buttonBRC.left
  }
}
function onClickoutside() {
  visible.value = false
}
</script>
