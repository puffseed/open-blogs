<script setup lang="ts">
import SystemJump from "~/components/Systems/SystemJump.vue";
// 色彩库入口：默认展示基础色彩页，客户端立即重定向
await navigateTo('/ColorSpace/basic', { replace: true });
</script>

<template>
  <SystemJump text="基础色" />
</template>
