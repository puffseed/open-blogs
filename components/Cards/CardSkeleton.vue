<script setup lang="ts">
/**
 * 卡片型骨架屏
 * 用于 config/skeleton.config 中配置为卡片型的路由（如原色空间卡片页）
 * 结构参考 ColorSpace/chinese 的 CardLayout + 卡片
 */
withDefaults(
  defineProps<{
    /** 卡片占位数量 */
    cardCount?: number;
  }>(),
  {
    cardCount: 8,
  }
);
</script>

<!-- 使用示例
<CardSkeleton />
<CardSkeleton :cardCount="6" />
用于 config/skeleton.config 中配置为卡片型的路由加载占位。
-->
<template>
  <div class="card-skeleton" role="status" aria-label="加载中">
    <div
      class="skeleton-card-layout"
      :style="{
        '--gap': '1.5rem',
        '--large-cols': 4,
        '--web-cols': 3,
        '--tablet-cols': 2,
        '--mobile-cols': 1,
      }"
    >
      <div
        v-for="i in cardCount"
        :key="i"
        class="skeleton-card"
      >
        <div class="skeleton-block skeleton-card-title" />
        <div class="skeleton-block skeleton-card-box" />
        <div class="skeleton-card-name">
          <div class="skeleton-block skeleton-card-line" />
          <div class="skeleton-block skeleton-card-line" />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="less">
.card-skeleton {
  width: 100%;
  display: flex;
  flex-direction: column;
}

.skeleton-card-layout {
  width: 100%;
  flex: 1;
  display: grid;
  grid-template-columns: repeat(var(--mobile-cols), 1fr);
  gap: var(--gap);
  justify-items: center;
  margin-top: 0.5rem;

  @media (min-width: 576px) {
    grid-template-columns: repeat(var(--tablet-cols), 1fr);
    max-width: 576px;
    margin-left: auto;
    margin-right: auto;
  }

  @media (min-width: 769px) {
    grid-template-columns: repeat(var(--web-cols), 1fr);
    max-width: 769px;
  }

  @media (min-width: 1200px) {
    grid-template-columns: repeat(var(--large-cols), 1fr);
    max-width: 1200px;
  }

  @media (max-width: 575px) {
    width: 90%;
    margin-left: auto;
    margin-right: auto;
  }
}

.skeleton-card {
  padding: var(--size-12);
  width: 100%;
  border-radius: var(--size-12);
  border: 1px solid var(--border, #eee);
  background-color: var(--white, #fff);
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.skeleton-card-title {
  height: 14px;
  width: 60%;
  margin: 0 auto 0.2rem;
}

.skeleton-card-box {
  height: 120px;
  width: 100%;
  border-radius: var(--size-6);
}

.skeleton-card-name {
  display: flex;
  justify-content: space-between;
  gap: 0.5rem;
  padding: 0 0.25rem;
  margin-top: var(--size-4);
}

.skeleton-card-line {
  height: 14px;
  flex: 1;
  max-width: 45%;
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
  .skeleton-block {
    --skeleton-from: #2a2a2a;
    --skeleton-to: #333;
  }
}

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
