<script setup lang="ts">
import SystemJump from "~/components/Systems/SystemJump.vue";
// 免费资源入口：默认展示文档模板页
await navigateTo('/ResourceLibrary/document', { replace: true });
</script>

<template>
  <SystemJump text="免费资源" />
</template>
