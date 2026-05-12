<script setup lang="ts">
// 列表/卡片无数据时的缺省页
defineProps<{
  /** 自定义提示文案，默认：暂无数据，敬请期待 */
  text?: string;
}>();
</script>

<!-- 使用示例
<SystemNoData />
<SystemNoData text="暂无收藏" />
列表/卡片内无数据时：
<div v-if="list.length">...</div>
<SystemNoData v-else text="暂无作品，敬请期待" />
-->
<template>
  <div class="system-no-data">
    <i class="iconfont icon-Prompt no-data-icon" aria-hidden="true" />
    <p class="no-data-text">{{ text ?? '暂无数据，敬请期待' }}</p>
  </div>
</template>

<style scoped lang="less">
.system-no-data {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  padding: 2rem 1rem;
  color: var(--mainText, #666);
  min-height: 120px;

  .no-data-icon {
    font-size: 48px;
    color: var(--placeholder, #c0c0c0);
    line-height: 1;
  }

  .no-data-text {
    margin: 0;
    font-size: 14px;
    line-height: 1.5;
  }
}
</style>
