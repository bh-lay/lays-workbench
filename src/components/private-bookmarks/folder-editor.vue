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
      <span v-if="type === 'edit'">修改文件夹</span>
      <span v-else>添加文件夹</span>
    </div>
    <div class="body">
      <input
        v-model="name"
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
    folderName: {
      type: String,
      default: '',
    },
  },
  emits: ['confirm', 'cancel'],
  setup(props, context) {
    const name = ref('')
    if (props.type === 'edit') {
      name.value = props.folderName
    }
    return {
      name,
      handleConfirm() {
        context.emit('confirm', {
          name: name.value,
        })
      },
    }
  },
}
</script>
