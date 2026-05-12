<script setup>
import { copyrightConfig } from "@/config/pageConfig";
/**
 * 备案信息组件
 * @description 显示公安备案信息
 */
</script>

<template>
  <div class="filing-info-container">
    <a
      href="https://beian.miit.gov.cn/#/Integrated/index"
      target="_blank"
      rel="noopener noreferrer"
      class="filing-info"
    >
      <span class="filing-text">{{ copyrightConfig.ICP }}</span>
    </a>
    <a
      href="https://beian.mps.gov.cn/#/query/webSearch?code=11011402055614"
      target="_blank"
      rel="noopener noreferrer"
      class="filing-info"
    >
      <img
        src="https://beian.mps.gov.cn/img/logo01.dd7ff50e.png"
        alt="公安备案"
        class="filing-icon"
      />
      <span class="filing-text">{{ copyrightConfig.publicNetwork }}</span>
    </a>
  </div>
</template>

<style scoped lang="less">
.filing-info-container {
  margin-left: var(--size-12);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--size-4);
  gap: var(--size-24);
}

.filing-info {
  display: flex;
  align-items: center;
  gap: var(--size-6);
  text-decoration: none;
  color: var(--secondaryText);
  font-size: var(--fs-12);
  transition: color 0.2s ease;

  &:hover {
    color: var(--primary);
  }

  .filing-icon {
    width: 16px;
    height: 16px;
    object-fit: contain;
  }

  .filing-text {
    white-space: nowrap;
  }
}
</style>
