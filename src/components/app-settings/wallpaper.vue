<style lang="stylus" scoped>
.gallery
  height 150px
  background #333
  .v-button
    position absolute
    top 50%
    left 50%
    transform translate(-50%, -50%)
</style>

<template>
  <gallery :src="src">
    <v-dropdown-item-plain>
      <v-button
        type="primary"
        @click="$emit('next')"
      >
        修改
      </v-button>
    </v-dropdown-item-plain>
  </gallery>
</template>

<script setup lang="ts">
import Gallery from '@/components/gallery.vue'

defineProps({
  src: {
    type: String,
    default: '',
  },
})
defineEmits(['next'])
</script>
