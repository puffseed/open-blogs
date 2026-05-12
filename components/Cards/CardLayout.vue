<script setup lang="ts">
interface CardLayoutProps {
  /**
   * 卡片间距
   */
  gap?: string;
  /**
   * 大屏列数
   */
  largeCols?: number;
  /**
   * 网页端列数
   */
  webCols?: number;
  /**
   * 平板端列数
   */
  tabletCols?: number;
  /**
   * 移动端列数
   */
  mobileCols?: number;
}

const props = withDefaults(defineProps<CardLayoutProps>(), {
  gap: "1.5rem",
  largeCols: 4,
  webCols: 3,
  tabletCols: 2,
  mobileCols: 1,
});
</script>

<!-- 使用示例
<CardLayout :largeCols="4" :webCols="3" gap="2rem">
  <div class="card">卡片1</div>
  <div class="card">卡片2</div>
  <div class="card">卡片3</div>
</CardLayout>
-->
<template>
  <div
    class="CardLayout"
    :style="{
      '--gap': props.gap,
      '--large-cols': props.largeCols,
      '--web-cols': props.webCols,
      '--tablet-cols': props.tabletCols,
      '--mobile-cols': props.mobileCols,
    }"
  >
    <slot></slot>
  </div>
</template>
<!-- 卡片布局组件 -->
<style scoped lang="less">
.CardLayout {
  width: 100%;
  display: grid;
  grid-template-columns: repeat(var(--mobile-cols), 1fr);
  gap: var(--gap);
  justify-items: center;
  padding: 1.5rem 0;

  @media (min-width: 576px) {
    grid-template-columns: repeat(var(--tablet-cols), 1fr);
    max-width: 576px;
    margin: 0 auto;
  }

  @media (min-width: 769px) {
    grid-template-columns: repeat(var(--web-cols), 1fr);
    max-width: 769px;
    margin: 0 auto;
  }

  @media (min-width: 1200px) {
    grid-template-columns: repeat(var(--large-cols), 1fr);
    max-width: 1200px;
    margin: 0 auto;
  }

  @media (max-width: 575px) {
    width: 90%;
    margin: 0 auto;
  }
}
</style>
