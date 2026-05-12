<script setup lang="ts">
import { copyrightConfig } from "@/config/pageConfig";

const currentYear = ref(new Date().getFullYear());
</script>
<!-- 使用示例
<SystemCopyright />
全局版权声明，用于主内容区（如首页）底部展示。
-->
<!-- 全局版权声明：用于主内容区（如首页）展示，白底居中 -->
<template>
  <div class="system-copyright">
    <div class="system-copyright-left">
      <p>Copyright</p>
      <i class="iconfont icon-copyright"></i>
      <p>{{ copyrightConfig.startYear }} - {{ currentYear }}</p>
      <a :href="`${copyrightConfig.domain}`" target="_blank"
        >&nbsp;{{ copyrightConfig.siteName }}&nbsp;</a
      >
      <p>.All Rights Reserved</p>
    </div>
  </div>
</template>

<style scoped lang="less">
.system-copyright {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  font-size: 14px;
  color: var(--secondaryText);

  .system-copyright-left {
    display: flex;
    align-items: center;
    font-size: var(--fs-12);
  }

  a {
    color: inherit;
  }

  a:hover {
    color: var(--primary);
    text-decoration: underline;
  }

  /* 平板端、移动端：上下布局 */
  @media (max-width: 1024px) {
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 0.75rem;
    padding: 1rem 1.5rem;
    text-align: center;
  }

  @media (max-width: 768px) {
    padding: 0.75rem 1rem;
    font-size: 13px;
  }
}
</style>
