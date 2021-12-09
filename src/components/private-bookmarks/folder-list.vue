<style lang="stylus" scoped>
.folder-list
  background #4a4a50
</style>
<template>
  <div class="folder-list">
    <folder-item
      v-for="item in list"
      :key="item.id"
      :data="item"
      :deep="deep"
      :active="active"
      @select="$emit('select', $event)"
    >
      <vue-folder-list
        :parent="item.id"
        :deep="deep + 1"
        :active="active"
        @select="$emit('select', $event)"
      />
    </folder-item>
  </div>
</template>

<script>
import { ref } from 'vue';
import FolderItem from './folder-item.vue';
export default {
  name: 'vue-folder-list',
  components: { FolderItem },
  props: {
    parent: {
      type: String,
      default: '',
    },
    deep: {
      type: Number,
      default: 1,
    },
    active: {
      type: String,
      default: 'root',
    },
  },
  setup(props) {
    const list = ref([]);
    if (props.parent === 'root') {
      list.value = [
        {
          label: '社区论坛',
          id: '1',
        },
        {
          label: '个人博客',
          id: '2',
        },
        {
          label: '在线教学视频',
          id: '3',
        },
        {
          label: 'Git学习单',
          id: '4',
        },
      ];
    } else if (props.parent === '1') {
      list.value = [
        {
          label: '家庭网络管理',
          id: '7',
        },
        {
          label: '设计师平台',
          id: '9',
        },
      ];
    } else if (props.parent === '9') {
      list.value = [
        {
          label: '公司项目',
          id: '11',
        },
        {
          label: '备忘录',
          id: '10',
        },
      ];
    }
    return {
      list,
    };
  },
};
</script>
