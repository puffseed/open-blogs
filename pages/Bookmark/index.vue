<script setup lang="ts">
import SystemJump from "~/components/Systems/SystemJump.vue";
// 书签入口：默认展示产品经理页
await navigateTo('/Bookmark/pm', { replace: true });
</script>

<template>
  <SystemJump text="书签大全" />
</template>
