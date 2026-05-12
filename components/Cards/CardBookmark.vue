<script setup lang="ts">
import type { BookmarkItem } from "~/types/bookmark";

const props = defineProps<{
  item: BookmarkItem;
}>();

const emit = defineEmits<{
  click: [item: BookmarkItem];
}>();

const handleClick = () => {
  emit("click", props.item);
};
</script>
<!-- 使用示例
<CardBookmark
  v-for="item in BookmarkList"
  :key="item.id"
  :item="item"
  @click="handleBookmarkClick"
/>
书签卡片：左侧首字图标 + 右侧名称与描述。
-->
<template>
  <div class="card hand" @click="handleClick">
    <div class="left Bookmark-icon-wrap">
      <span class="Bookmark-icon">{{ item.name.charAt(0) }}</span>
    </div>
    <div class="right">
      <p class="name">{{ item.name }}</p>
      <p class="description" :title="item.description">
        {{ item.description }}
      </p>
    </div>
  </div>
</template>

<style scoped lang="less">
.card {
  display: flex;
  align-items: flex-start;
  width: 100%;
  padding: var(--size-12);
  background: var(--background);
  border: 1px solid var(--border);
  border-radius: var(--size-12);
  cursor: pointer;
  transition: all 0.3s ease;

  .left {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-right: var(--size-12);
    position: relative;
    flex-shrink: 0;

    &.Bookmark-icon-wrap {
      width: var(--size-40);
      height: var(--size-40);
    }

    .Bookmark-icon {
      width: var(--size-40);
      height: var(--size-40);
      border-radius: 50%;
      // background-color: var(--background);
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 18px;
      font-weight: bold;
      color: var(--title);
      transition: transform 0.3s ease;
    }
  }

  .right {
    display: flex;
    flex-direction: column;
    flex: 1;
    min-width: 0;

    .name {
      font-size: 14px;
      font-weight: bold;
      color: var(--title);
    }

    .description {
      font-size: var(--fs-12);
      color: var(--mainText);
      max-height: var(--size-20);
      line-height: var(--size-20);
      overflow: hidden;
    }
  }

  &:hover {
    border-color: var(--primary);
    box-shadow: 0 0 12px rgba(0, 0, 0, 0.1);
    transform: translateY(-2px);
    .name{
      color: var(--primary);
      text-decoration: underline;
    }

    .left .Bookmark-icon {
      transform: scale(1.08);
    }
  }
}
</style>
