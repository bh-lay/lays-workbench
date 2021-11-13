<style lang="stylus" scoped>
.add-bookmark-modal
  padding 20px
.message
  padding-bottom 10px
  margin-bottom 20px
  border-bottom 1px solid #eee
</style>

<template>
  <div class="add-bookmark-modal">
    <div class="message">
      <h1>别催了</h1>
      <p>在写了，已经在写了！</p>
      <p>下个版本就上线～</p>
    </div>
    <div class="caption">
      <span class="active">链接</span>
      <span>Widgits</span>
    </div>
    <div class="input-item">
      <div class="label">名称</div>
      <input type="text" placeholder="请输入链接名称" />
    </div>
    <div class="input-item">
      <div class="label">链接地址</div>
      <input type="text" placeholder="请输入链接地址" />
    </div>
    <div class="input-item">
      <div class="label">图标</div>
      <div class="color-selector">
        底色选择器
      </div>
    </div>
    <div class="input-item">
      <div class="label">底色</div>
      <div class="color-selector">
        底色选择器
      </div>
    </div>
  </div>
</template>

<script>
// import { ref } from 'vue';
export default {
  setup() {
    return {};
  },
};
</script>
