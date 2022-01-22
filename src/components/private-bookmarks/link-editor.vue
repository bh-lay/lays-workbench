<style lang="stylus" scoped>
.link-editor
  padding 15px 20px 20px
  background #26262c
.header
  margin-bottom 10px
  line-height 30px
  font-weight bold
  font-size 16px
  color #888
.label
  margin 15px 0 5px
  font-size 12px
  color #666
input
  box-sizing border-box
  width 100%
  height 40px
  padding 0 12px
  background #2f2f37
  border 1px solid #1c1c21
  border-radius 4px
  color #888
  transition .4s
  &:focus
    outline none
    border-color #2154ba
.footer
  padding-top 15px
  text-align right
  .v-button
    margin-left 10px
</style>
<template>
  <div class="link-editor">
    <div class="header">
      <span v-if="type === 'edit'">修改书签</span>
      <span v-else>添加书签</span>
    </div>
    <div class="body">
      <div class="label">
        名称
      </div>
      <input
        v-model="name"
        v-focus
        type="text"
      >
      <div class="label">
        网址
      </div>
      <input
        v-model="value"
        type="text"
      >
    </div>
    <div class="footer">
      <v-button @click="$emit('cancel')">
        取消
      </v-button>
      <v-button @click="handleConfirm">
        确定
      </v-button>
    </div>
  </div>
</template>

<script lang="ts">
import { ref } from 'vue'
export default {
  props: {
    type: {
      type: String,
      default: 'create',
    },
    linkName: {
      type: String,
      default: '',
    },
    linkValue: {
      type: String,
      default: '',
    },
  },
  emits: ['confirm', 'cancel'],
  setup(props, context) {
    const isEditMode = props.type === 'edit'

    const name = ref(isEditMode ? props.linkName : '')
    const value = ref(isEditMode ? props.linkValue : '')

    return {
      name,
      value,
      handleConfirm() {
        context.emit('confirm', {
          name: name.value,
          value: value.value,
        })
      },
    }
  },
}
</script>
