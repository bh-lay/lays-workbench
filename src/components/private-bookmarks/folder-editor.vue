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
      <v-input
        v-model="name"
        v-focus
        type="text"
        placeholder="目录名"
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
    folderName: {
      type: String,
      default: '',
    },
  },
  emits: ['confirm', 'cancel'],
  setup(props: {
    type: string,
    folderName: string
  }, context) {
    const name = ref(props.type === 'edit' ? props.folderName : '')
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
