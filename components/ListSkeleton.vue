<script setup lang="ts">
/**
 * 列表型骨架屏
 * 用于文档详情、列表详情等页面的加载占位，结构参考 openDetail 的 header + 内容区
 */
withDefaults(
  defineProps<{
    /** 内容区占位行数 */
    lineCount?: number;
    /** 是否隐藏顶部栏（内嵌到已有 header 的页面时使用） */
    hideHeader?: boolean;
  }>(),
  {
    lineCount: 12,
    hideHeader: false,
  },
);

const lineWidths = [
  "95%",
  "88%",
  "92%",
  "70%",
  "85%",
  "90%",
  "75%",
  "98%",
  "82%",
  "65%",
];
function lineWidth(index: number): string {
  return lineWidths[(index - 1) % lineWidths.length];
}
</script>

<!-- 使用示例
<ListSkeleton />
<ListSkeleton :line-count="8" />
<ListSkeleton :line-count="12" :hide-header="true" />
用于 config/skeleton.config 中配置为列表型的路由加载占位；
hideHeader 为 true 时仅渲染内容区，适用于内嵌到已有 header 的页面（如 openDetail）
-->
<template>
  <div class="list-skeleton" role="status" aria-label="加载中">
    <!-- 模拟顶部栏（hideHeader 时在内容区嵌入使用） -->
    <!-- <div v-if="!hideHeader" class="list-skeleton-header">
      <div class="skeleton-block skeleton-btn" />
      <div class="skeleton-block skeleton-title" />
      <div class="skeleton-block skeleton-btn" />
    </div> -->
    <!-- 模拟内容区（文档/列表行） -->
    <div class="list-skeleton-content">
      <div
        v-for="i in lineCount"
        :key="i"
        class="skeleton-line"
        :style="{ width: lineWidth(i as number) }"
      />
    </div>
  </div>
</template>

<style scoped lang="less">
.list-skeleton {
  width: 100%;
  height: 100%;
  min-height: 60vh;
  display: flex;
  flex-direction: column;
  padding: 0;
}

.list-skeleton-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--size-12) var(--size-24);
  border-bottom: 1px solid var(--border);
  background-color: var(--white);
  gap: var(--size-12);

  .skeleton-btn {
    width: var(--size-30);
    height: var(--size-30);
    border-radius: var(--size-24);
    flex-shrink: 0;
  }

  .skeleton-title {
    flex: 1;
    max-width: 280px;
    height: var(--fs-16);
    margin: 0 auto;
    border-radius: var(--size-8);
  }
}

.list-skeleton-content {
  flex: 1;
  padding: var(--size-24) var(--size-32);
  display: flex;
  flex-direction: column;
  gap: var(--size-12);
  max-width: 900px;
  margin: 0 auto;
  width: 100%;
}

.skeleton-line {
  height: var(--fs-16);
  border-radius: var(--size-8);
  background: linear-gradient(
    90deg,
    var(--skeleton-from, #f0f0f0) 25%,
    var(--skeleton-to, #e8e8e8) 50%,
    var(--skeleton-from, #f0f0f0) 75%
  );
  background-size: 200% 100%;
  animation: skeleton-shimmer 1.2s ease-in-out infinite;
}

.skeleton-block {
  background: linear-gradient(
    90deg,
    var(--skeleton-from, #f0f0f0) 25%,
    var(--skeleton-to, #e8e8e8) 50%,
    var(--skeleton-from, #f0f0f0) 75%
  );
  background-size: 200% 100%;
  animation: skeleton-shimmer 1.2s ease-in-out infinite;
  border-radius: var(--size-8);
}

@media (prefers-color-scheme: dark) {
  .skeleton-line,
  .skeleton-block {
    --skeleton-from: #2a2a2a;
    --skeleton-to: #333;
  }
}

:global([data-theme="dark"]) .skeleton-line,
:global(.dark) .skeleton-line,
:global([data-theme="dark"]) .skeleton-block,
:global(.dark) .skeleton-block {
  --skeleton-from: #2a2a2a;
  --skeleton-to: #333;
}

@keyframes skeleton-shimmer {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}
</style>
