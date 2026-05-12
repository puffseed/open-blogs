<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";

const props = defineProps<{
  title: string;
}>();

const router = useRouter();

const handleBack = () => {
  router.back();
};
</script>

<template>
  <div class="app-header">
    <button class="back-btn" @click="handleBack">
      <i class="iconfont icon-back"></i>
      <span>返回</span>
    </button>
    <h1 class="app-title">{{ title }}</h1>
    <div class="header-right"></div>
  </div>
</template>

<style scoped lang="less">
.app-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 24px;
  background-color: white;
  border-bottom: 1px solid #e0e0e0;
  margin-bottom: 24px;

  .back-btn {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 8px 16px;
    border: 1px solid #e0e0e0;
    border-radius: 4px;
    background-color: white;
    color: #333;
    font-size: 14px;
    cursor: pointer;
    transition: all 0.2s ease;

    &:hover {
      background-color: #f5f5f5;
    }

    .iconfont {
      font-size: 16px;
    }
  }

  .app-title {
    font-size: 20px;
    font-weight: 600;
    color: #333;
    margin: 0;
  }

  .header-right {
    width: 80px; // 为了保持标题居中
  }
}
</style>