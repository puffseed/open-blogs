<script setup lang="ts">
import { ref } from "vue";
import Card from "./Card.vue";

interface AppItem {
  id: string;
  name: string;
  description: string;
  cover: string;
  path: string;
}

const props = defineProps<{
  apps: AppItem[];
}>();

const emit = defineEmits<{
  (e: 'use-app', app: AppItem): void;
}>();

const handleUseApp = (app: AppItem) => {
  emit('use-app', app);
};
</script>

<template>
  <div class="app-list">
    <Card 
      v-for="app in apps" 
      :key="app.id" 
      :app="app"
      @use-app="handleUseApp"
    />
  </div>
</template>

<style scoped lang="less">
.app-list {
  display: flex;
  flex-wrap: wrap;
  gap: var(--size-16);
  border-radius: 8px;

  .app-card {
    flex: 1 1 calc(50% - 8px);
    min-width: 300px;
  }
}
</style>