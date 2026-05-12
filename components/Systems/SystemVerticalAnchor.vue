<!-- 垂直锚点组件 -->
<script setup lang="ts">
import { ref, watch, computed, onMounted, onBeforeUnmount } from "vue";

interface Props {
  /** 锚点数量（anchorIds 未传时生效），默认 5 */
  count?: number;
  /** 默认选中的索引（0 起） */
  defaultSelected?: number;
  /** 锚点对应的 DOM id 列表，传入后组件内部处理滚动联动 */
  anchorIds?: string[];
  /** 滚动到目标时的顶部偏移（如预留 header 高度），默认 80 */
  scrollOffset?: number;
  /** 滚动检测时的偏移量，默认 150 */
  scrollDetectOffset?: number;
}

const props = withDefaults(defineProps<Props>(), {
  count: 5,
  defaultSelected: 0,
  anchorIds: () => [],
  scrollOffset: 80,
  scrollDetectOffset: 150,
});

const emit = defineEmits<{
  change: [index: number];
}>();

const dotCount = computed(() =>
  props.anchorIds.length > 0 ? props.anchorIds.length : props.count
);

const selectedIndex = ref(props.defaultSelected);

watch(
  () => props.defaultSelected,
  (val) => {
    if (val >= 0 && val < dotCount.value) {
      selectedIndex.value = val;
    }
  }
);

const scrollToSection = (index: number): void => {
  if (props.anchorIds.length === 0) {
    emit("change", index);
    return;
  }
  const id = props.anchorIds[index];
  if (!id) return;
  const el = document.getElementById(id);
  if (el) {
    const top =
      el.getBoundingClientRect().top + window.pageYOffset - props.scrollOffset;
    window.scrollTo({ top, behavior: "smooth" });
  }
  selectedIndex.value = index;
  emit("change", index);
};

const handleClick = (index: number): void => {
  selectedIndex.value = index;
  if (props.anchorIds.length > 0) {
    scrollToSection(index);
  } else {
    emit("change", index);
  }
};

const handleScroll = (): void => {
  if (props.anchorIds.length === 0) return;
  const offset = props.scrollDetectOffset;
  const scrollPos = window.pageYOffset + offset;
  for (let i = props.anchorIds.length - 1; i >= 0; i--) {
    const el = document.getElementById(props.anchorIds[i]);
    if (el) {
      const top = el.getBoundingClientRect().top + window.pageYOffset;
      if (scrollPos >= top) {
        selectedIndex.value = i;
        break;
      }
    }
  }
};

onMounted(() => {
  if (props.anchorIds.length > 0) {
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
  }
});

onBeforeUnmount(() => {
  if (props.anchorIds.length > 0) {
    window.removeEventListener("scroll", handleScroll);
  }
});
</script>

<template>
  <div class="vertical-anchor">
    <button
      v-for="i in dotCount"
      :key="i - 1"
      type="button"
      class="vertical-anchor-dot"
      :class="{ 'vertical-anchor-dot-active': i - 1 === selectedIndex }"
      :aria-label="`锚点 ${i}`"
      @click="handleClick(i - 1)"
    />
  </div>
</template>

<style scoped lang="less">
.vertical-anchor {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: var(--size-16);
  .vertical-anchor-dot {
    width: var(--size-8);
    height: var(--size-8);
    padding: 0;
    border: none;
    border-radius: 50%;
    background-color: var(--secondaryText);
    cursor: pointer;
    transition: all 0.2s ease;

    &:hover {
      background-color: var(--primary);
    }

    &.vertical-anchor-dot-active {
      background-color: var(--white);
      box-shadow: 0 0 0 2px var(--primary);
    }
  }
}
</style>

<!--
使用说明：
垂直锚点组件，用于页面侧边或内容区的纵向导航指示

1. 基础用法（无滚动联动，默认 5 个锚点）：
   <SystemVerticalAnchor @change="handleChange" />

2. 传入 anchorIds 自动处理滚动联动（推荐）：
   <section id="anchor-0">...</section>
   <section id="anchor-1">...</section>
   <SystemVerticalAnchor
     :anchor-ids="['anchor-0', 'anchor-1']"
     class="fixed right-6 top-1/2 -translate-y-1/2"
   />

3. 自定义偏移与锚点数量：
   <SystemVerticalAnchor
     :anchor-ids="ids"
     :scroll-offset="80"
     :scroll-detect-offset="150"
   />

Props:
  - anchorIds: string[] - 锚点对应的 DOM id，传入后内部处理滚动与选中同步
  - count: number - 锚点数量（anchorIds 未传时生效，默认 5）
  - defaultSelected: number - 默认选中索引（默认 0）
  - scrollOffset: number - 滚动到目标时的顶部偏移，默认 80
  - scrollDetectOffset: number - 滚动检测偏移，默认 150

Events:
  - change: (index: number) => void - 点击锚点时触发
-->
