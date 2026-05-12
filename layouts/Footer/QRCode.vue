<script setup lang="ts">
// 定义事件
const emit = defineEmits(['click']);

// 处理点击事件
const handleClick = () => {
  emit('click');
};
</script>
<!-- 二维码组件 -->
<template>
  <div class="qr-code" @click="handleClick">
    <img
      alt="QR Code"
      class="qr-code-img"
      src="/assets/images/wechat-qrcode.png"
    />
    <p>微信公众号</p>
  </div>
</template>
<style scoped lang="less">
.qr-code {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  .qr-code-img {
    width: var(--size-48);
    height: var(--size-48);
    border-radius: var(--size-6);
    border: 1px solid var(--border);
  }
  p {
    padding-top: 0.2rem;
    font-size: var(--fs-12);
    font-weight: bold;
    color: var(--mainText);
  }
}
</style>
