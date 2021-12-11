<style lang="stylus" scoped>
.link-editor
  padding 15px 20px
  background #26262c
.header
  margin-bottom 10px
  line-height 30px
  font-weight bold
  font-size 14px
  color #888
input
  background #2f2f37
  border 1px solid #111
.footer
  padding-top 15px
</style>
<template>
  <div class="link-editor">
    <div class="header">
      <span v-if="type === 'edit'">修改书签</span>
      <span v-else>添加书签</span>
    </div>
    <div class="body">
      <input type="text" v-model="name" />
      <input type="text" v-model="value" />
    </div>
    <div class="footer">
      <v-button type="dark" @click="$emit('cancel')">取消</v-button>
      <v-button type="dark" @click="handleConfirm">确定</v-button>
    </div>
  </div>
</template>

<script>
import { ref, watch } from 'vue';
export default {
  name: 'vue-folder-item',
  emits: ['confirm', 'cancel'],
  props: {
    type: {
      type: String,
      default: 'create'
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
  setup(props, context) {
    const name = ref('')
    const value = ref('')
    if (props.type === 'edit') {
      name.value = props.linkName
      value.value = props.linkValue
    }
    return {
      name,
      value,
      handleConfirm() {
        context.emit('confirm', {
          name: name.value,
          value: value.value
        })
      }
    };
  },
};
</script>
