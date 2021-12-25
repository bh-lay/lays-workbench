<template>
  <svg 
    viewBox="0 0 24 24"
    :fill="fill"
    :height="size"
    :width="size"
    class="mdi-icon"
    :style="{ transform: `rotate(${rotate}deg)`, display: 'inline-block' }"
  >
    <title v-if="title">{{ title }}</title>
    <path :d="icon" />
  </svg>
</template>

<script lang="ts">
type libType = {[key:string]: string}
let lib: libType = {}

function toCamelCase(str: string) {
  const result = str.replace(/(?:^\w|[A-Z]|\b\w)/g, (letter, index) => {
    return index === 0 ? letter.toLowerCase() : letter.toUpperCase()
  })

  return result.replace(/\s+|[-]/g, '')
}
export default {
  name: 'VMdi',
  props: {
    name: {
      type: String,
      default: '',
    },
    title: {
      type: String,
      default: '',
    },
    size: {
      type: [String, Number],
      default: 24,
    },
    fill: {
      type: String,
      default: 'currentColor',
    },
    rotate: {
      type: Number,
      default: 0,
    },
    path: {
      type: String,
      default: '',
    },
  },
  add(icons: libType) {
    if (typeof icons === 'object' && icons !== null) {
      lib = icons
    }
  },
  computed: {
    icon() {
      if (this.path) return this.path
      const icon = lib[toCamelCase(this.name as string)]
      if (typeof icon === 'undefined') {
        console.warn(`[${this.name}] Name of the icon is incorrect`)
        return
      }

      return icon
    },
  },
}
</script>