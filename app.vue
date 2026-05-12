<script setup lang="ts">
import SystemWatermark from "~/components/Systems/SystemWatermark.vue";
import Welcome from "~/components/Welcome.vue";
import { getPageLayoutConfig } from "~/config/pageConfig";

const route = useRoute();

const shouldShowWelcome = computed(() => {
  const config = getPageLayoutConfig(route.path);
  return config.showWelcome === true;
});
</script>

<template>
  <NuxtLayout name="default">
    <NuxtPage />
  </NuxtLayout>
  <!-- 全局水印 -->
  <SystemWatermark />
  <!-- 欢迎动画 -->
  <Welcome v-if="shouldShowWelcome" />
</template>
