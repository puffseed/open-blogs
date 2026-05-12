<script setup lang="ts">
import { ref, watch, onUnmounted } from "vue";

const props = withDefaults(
  defineProps<{
    text?: string;
    targetElement?: HTMLElement | null;
  }>(),
  { text: "", targetElement: null }
);

const showFloatingBox = ref(false);
const floatingBoxPosition = ref({ x: 0, y: 0 });
const hoverTimer = ref<ReturnType<typeof setTimeout> | null>(null);

const handleMouseEnter = (event: MouseEvent) => {
  // 清除之前的定时器
  if (hoverTimer.value) {
    clearTimeout(hoverTimer.value);
  }
  
  // 1秒后显示悬浮框
  hoverTimer.value = setTimeout(() => {
    const target = event.target as HTMLElement;
    if (!target) return;
    const rect = target.getBoundingClientRect();
    floatingBoxPosition.value = {
      x: rect.left + rect.width / 2,
      y: rect.top - 30
    };
    
    showFloatingBox.value = true;
  }, 1000);
};

// 处理鼠标离开事件
const handleMouseLeave = () => {
  // 清除定时器
  if (hoverTimer.value) {
    clearTimeout(hoverTimer.value);
    hoverTimer.value = null;
  }
  
  // 隐藏悬浮框
  showFloatingBox.value = false;
};

watch(
  () => props.targetElement,
  (newElement, oldElement) => {
    if (oldElement) {
      oldElement.removeEventListener("mouseenter", handleMouseEnter as EventListener);
      oldElement.removeEventListener("mouseleave", handleMouseLeave);
    }
    if (newElement) {
      newElement.addEventListener("mouseenter", handleMouseEnter as EventListener);
      newElement.addEventListener("mouseleave", handleMouseLeave);
    }
  },
  { immediate: true }
);

onUnmounted(() => {
  if (props.targetElement) {
    props.targetElement.removeEventListener("mouseenter", handleMouseEnter as EventListener);
    props.targetElement.removeEventListener("mouseleave", handleMouseLeave);
  }
  if (hoverTimer.value) {
    clearTimeout(hoverTimer.value);
  }
});
</script>
<!-- 使用示例
<FloatingBox text="悬浮说明" :target-element="targetRef" />
需传入目标 DOM 的 ref（targetElement），鼠标悬停约 1 秒后显示悬浮框文案。
-->
<template>
  <div 
    v-if="showFloatingBox" 
    class="floating-box"
    :style="{
      left: `${floatingBoxPosition.x}px`,
      top: `${floatingBoxPosition.y}px`,
    }"
  >
    {{ text }}
  </div>
</template>
<style scoped lang="less">
.floating-box {
  padding: var(--size-8) var(--size-16);
  background-color: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(8px);
  color: var(--white);
  font-size: var(--fs-12);
  font-weight: bold;
  border-radius: var(--size-8);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  position: fixed;
  z-index: 1000;
  pointer-events: none;
}
</style>