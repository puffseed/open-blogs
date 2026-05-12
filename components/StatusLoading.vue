<script setup lang="ts">
// StatusLoading 组件 - 全局加载状态组件
const props = defineProps({
  // 是否显示加载状态
  show: {
    type: Boolean,
    default: false
  },
  // 加载提示文字
  text: {
    type: String,
    default: "正在处理中..."
  }
});
</script>
<!-- 使用示例
<StatusLoading :show="isLoading" />
<StatusLoading :show="loading" text="提交中..." />
全局加载遮罩，show 为 true 时显示，可自定义 text。
-->
<template>
  <div v-if="show" class="status-loading-overlay">
    <div class="status-loading-content">
      <div class="loading-spinner"></div>
      <p class="loading-text">{{ text }}</p>
    </div>
  </div>
</template>

<style scoped lang="less">
.status-loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;

  .status-loading-content {
    background-color: white;
    padding: var(--size-32);
    border-radius: var(--size-12);
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--size-16);

    .loading-spinner {
      width: var(--size-40);
      height: var(--size-40);
      border: var(--size-4) solid #f3f3f3;
      border-top: var(--size-4) solid var(--primary);
      border-radius: 50%;
      animation: spin 1s linear infinite;
    }

    .loading-text {
      font-size: var(--fs-16);
      color: var(--mainText);
      margin: 0;
    }
  }
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
</style>