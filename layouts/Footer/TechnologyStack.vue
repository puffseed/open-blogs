<script setup lang="ts">
import { technologyStackConfig } from "@/config/pageConfig";
</script>
<!-- 技术栈：项目架构说明，供开发者参考 -->
<template>
  <div class="technology-stack">
    <p v-for="(item, index) in technologyStackConfig" :key="index">{{ item }}</p>
  </div>
</template>

<style scoped lang="less">
.technology-stack {
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: var(--fs-12);
  flex-wrap: wrap;
  gap: 0.35rem;

  p {
    margin: 0;
    padding: 0.25rem 0.5rem;
    border-radius: var(--size-4);
    background: var(--info-bg);
    color: var(--secondaryText);
    transition: none;
  }

  @media (max-width: 768px) {
    font-size: 11px;
    gap: 0.25rem;
    p {
      padding: 0.2rem 0.4rem;
    }
  }

  @media (max-width: 480px) {
    font-size: 11px;
    p {
      padding: 0.18rem 0.35rem;
    }
  }
}
</style>
