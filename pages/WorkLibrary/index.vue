<script setup lang="ts">
import SystemJump from "~/components/Systems/SystemJump.vue";
// 作品集入口：默认展示 莫高作品页
await navigateTo('/WorkLibrary/mogao', { replace: true });
</script>

<template>
  <SystemJump text="莫高作品" />
</template>
