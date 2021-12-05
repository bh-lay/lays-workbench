<style lang="stylus" scoped>
.setting-group
  padding 24px 30px
  background #fff
.label
  margin-bottom 15px
  font-size 16px
</style>

<template>
  <div style="padding: 24px 50px;">
    <div class="setting-group">
      <div class="label">布局</div>
      <layout />
    </div>
  </div>
</template>

<script>
import { ref, watch } from 'vue';
import Layout from './layout.vue'

export default {
  components: { Layout },
};
</script>
