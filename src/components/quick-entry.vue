<style scoped>
.btn-list {
    display: flex;
    justify-content: center;
    padding-top: 20px;
}
.btn-list .item {
    width: 90px;
    height: 90px;
    cursor: pointer;
}
.btn-list .item .icon {
    width: 50px;
    height: 50px;
    margin: 0 auto 10px;
    border-radius: 8px;
    background: #333;
    transition: .15s;
}
.btn-list .item .icon img {
    width: 100%;
}
.btn-list .item .title {
    width: 80px;
    height: 18px;
    margin: auto;
    line-height: 18px;
    text-align: center;
    font-size: 12px;
}
.btn-list .item:hover .icon {
    box-shadow: 2px 2px 8px rgba(0, 0, 0, .1),0 0 2px rgba(0, 0, 0, .3);
}
</style>

<template>
    <div class="btn-list">
      <div class="item">
        <div class="icon" style="background: #2196f3">
          <img src="../img/magic-m1.png" alt="" />
        </div>
        <div class="title">H3C m1</div>
      </div>
      <div class="item">
        <div class="icon" style="background: #4caf50">
          <img src="../img/magic-m2.png" alt="" />
        </div>
        <div class="title">H3C m2</div>
      </div>
      <div class="item">
        <div class="icon" style="background: #f44336"></div>
        <div class="title">PLEX</div>
      </div>
      <div class="item">
        <div class="icon" style="background: #607d8b"></div>
        <div class="title"></div>
      </div>
      <div class="item">
        <div class="icon" style="background: #673ab7"></div>
        <div class="title"></div>
      </div>
    </div>
</template>

<script>
import { ref } from "vue";

export default {
  setup() {
    const count = ref(0);
    const inc = () => {
      count.value++;
    };

    return {
      count,
      inc,
    };
  },
};
</script>
