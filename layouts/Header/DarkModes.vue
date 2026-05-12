<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";

// 主题模式：auto, light, dark
const currentMode = ref("auto");
let intervalId: number | null = null;

// 初始化主题
onMounted(() => {
  // 从本地存储获取主题设置
  const savedMode = localStorage.getItem("themeMode");
  if (savedMode) {
    currentMode.value = savedMode;
  }

  // 应用主题（插件已经初始化过，但这里再次确认状态一致）
  applyTheme();

  // 如果是自适应模式，设置定时器定期检查时间
  if (currentMode.value === "auto") {
    startAutoModeTimer();
  }
});

// 组件卸载时清除定时器
onUnmounted(() => {
  clearAutoModeTimer();
});

// 检查时间并更新主题
function checkTimeAndUpdateTheme() {
  if (currentMode.value !== "auto") return;

  const now = new Date();
  const hour = now.getHours();
  // 6:00-18:00 为白天模式，其他时间为夜晚模式
  const isDaytime = hour >= 6 && hour < 18;

  if (isDaytime) {
    document.documentElement.removeAttribute("data-theme");
  } else {
    document.documentElement.setAttribute("data-theme", "dark");
  }
}

// 设置主题
function setTheme(mode: string) {
  currentMode.value = mode;
  localStorage.setItem("themeMode", mode);
  applyTheme();
}

// 应用主题
function applyTheme() {
  if (currentMode.value === "auto") {
    checkTimeAndUpdateTheme();
    startAutoModeTimer();
  } else if (currentMode.value === "light") {
    clearAutoModeTimer();
    document.documentElement.removeAttribute("data-theme");
  } else if (currentMode.value === "dark") {
    clearAutoModeTimer();
    document.documentElement.setAttribute("data-theme", "dark");
  }
}

// 启动自适应模式定时器
function startAutoModeTimer() {
  clearAutoModeTimer();
  checkTimeAndUpdateTheme();
  intervalId = window.setInterval(checkTimeAndUpdateTheme, 60 * 60 * 1000);
}

// 清除自适应模式定时器
function clearAutoModeTimer() {
  if (intervalId !== null) {
    clearInterval(intervalId);
    intervalId = null;
  }
}

// 切换到自适应模式
function switchToAuto() {
  setTheme("auto");
}

// 切换到白天模式
function switchToLight() {
  setTheme("light");
}

// 切换到夜晚模式
function switchToDark() {
  setTheme("dark");
}
</script>
<!-- 暗黑模式组件 -->
<template>
  <div class="dark-modes">
    <button
      class="dark-mode-btn"
      :class="{ active: currentMode === 'auto' }"
      title="自适应"
      @click="switchToAuto"
    >
      <i class="iconfont icon-Auto"></i>
    </button>

    <button
      class="dark-mode-btn"
      :class="{ active: currentMode === 'dark' }"
      title="夜晚模式"
      @click="switchToDark"
    >
      <i class="iconfont icon-Nighttime"></i>
    </button>
    <button
      class="dark-mode-btn"
      :class="{ active: currentMode === 'light' }"
      title="白天模式"
      @click="switchToLight"
    >
      <i class="iconfont icon-Daytime"></i>
    </button>
  </div>
</template>
<style scoped lang="less">
.dark-modes {
  display: flex;
  align-items: center;
  gap: var(--size-12);
  border-radius: var(--size-24);
  border: 1px solid var(--border);
  padding: 2px 2px;
}
.dark-mode-btn {
  width: var(--size-24);
  height: var(--size-24);
  border-radius: var(--size-24);
  .iconfont {
    font-size: var(--size-16);
    color: var(--white);
  }
}
.dark-mode-btn:hover {
  background-color: var(--info-bg);
  .iconfont {
    color: var(--info);
  }
}

.dark-mode-btn.active {
  background-color: var(--primary-bg);
  .iconfont {
    color: var(--primary);
  }
}
</style>
