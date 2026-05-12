<script setup lang="ts">
import { ref } from "vue";

interface AppItem {
  id: string;
  name: string;
  description: string;
  cover: string;
  path: string;
  rank?: number;
}

const props = defineProps<{
  app: AppItem;
}>();

const emit = defineEmits<{
  (e: 'use-app', app: AppItem): void;
}>();

const handleUse = () => {
  console.log(`使用应用: ${props.app.name}`);
  // 触发use-app事件，将应用数据传递给父组件
  emit('use-app', props.app);
};
</script>

<template>
  <div class="app-card">
    <div class="left">
      <div class="app-icon">
        <img :src="app.cover" :alt="app.name" />
      </div>
      <div class="app-info">
        <p class="app-name">{{ app.name }}</p>
        <p class="app-description">{{ app.description }}</p>
      </div>
    </div>

    <button class="app-use-btn" @click="handleUse">使用</button>
  </div>
</template>

<style scoped lang="less">
.app-card {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--size-12);
  border: 1px solid #e8e8e8;
  border-radius: 8px;
  transition: all 0.2s ease;
  height: 100%;

  &:hover {
    border: 1px solid #1890ff;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
  }
  .left {
    display: flex;
    align-items: center;
  }
  .app-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 50px;
    height: 50px;
    border-radius: var(--size-32);
    overflow: hidden;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }

  .app-info {
    display: flex;
    gap: var(--size-4);
    flex-direction: column;
    justify-content: center;
    padding-left: var(--size-12);
    .app-name {
      font-size: var(--fs-16);
      font-weight: bold;
      color: #595959;
    }

    .app-description {
      font-size: var(--fs-14);
      color: #8c8c8c;
    }
  }

  .app-use-btn {
    padding: 8px 16px;
    border: 1px solid #e8e8e8;
    border-radius: 4px;
    background-color: white;
    color: var(--primary);
    font-size: var(--fs-14);
    cursor: pointer;
    transition: all 0.2s ease;
    align-self: flex-start;

    &:hover {
      background-color: #e6f7ff;
    }

    &:active {
      background-color: #bae7ff;
    }
  }
}
</style>
