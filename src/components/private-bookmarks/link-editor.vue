<style lang="stylus" scoped>
.link-editor
  padding 0 20px 20px
  background #26262c
.label
  margin-bottom 5px
  font-size 12px
  color #666
.v-input
  margin-bottom 15px
.footer
  padding-top 5px
  text-align right
  .v-button
    margin-left 10px
</style>
<template>
  <div class="link-editor">
    <div class="body">
      <div class="label">
        名称
      </div>
      <v-input
        v-model="name"
        v-focus
        type="text"
        placeholder="书签名"
      />
      <div class="label">
        网址
      </div>
      <v-input
        v-model="value"
        type="text"
        placeholder="网址"
      />
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
