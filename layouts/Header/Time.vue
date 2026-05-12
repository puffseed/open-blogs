<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import { timeDisplayConfig } from "@/config/pageConfig";

// 仅客户端渲染时间，避免服务端与客户端时间不一致导致水合不匹配
const currentTime = ref<Date | null>(null);

// 计算问候语
const greeting = computed(() => {
  if (!currentTime.value) return "你好";
  const hour = currentTime.value.getHours();
  if (hour < 6) return "凌晨好";
  if (hour < 9) return "早上好";
  if (hour < 12) return "上午好";
  if (hour < 14) return "中午好";
  if (hour < 17) return "下午好";
  if (hour < 19) return "傍晚好";
  if (hour < 22) return "晚上好";
  return "夜深了";
});

// 星期映射
const weekdays = ["周日", "周一", "周二", "周三", "周四", "周五", "周六"];

// 根据配置组装时间展示：年、月、日、星期、时分秒
const timeText = computed(() => {
  if (!currentTime.value) return "--";
  const d = currentTime.value;
  const sep = timeDisplayConfig.separator;
  const parts: string[] = [];
  if (timeDisplayConfig.showYear) parts.push(`${d.getFullYear()}年`);
  if (timeDisplayConfig.showMonth) parts.push(`${d.getMonth() + 1}月`);
  if (timeDisplayConfig.showDay) parts.push(`${d.getDate()}日`);
  if (timeDisplayConfig.showWeekday) parts.push(weekdays[d.getDay()]);
  if (timeDisplayConfig.showHour || timeDisplayConfig.showMinute || timeDisplayConfig.showSecond) {
    const h = timeDisplayConfig.showHour ? String(d.getHours()).padStart(2, "0") : "";
    const m = timeDisplayConfig.showMinute ? String(d.getMinutes()).padStart(2, "0") : "";
    const s = timeDisplayConfig.showSecond ? String(d.getSeconds()).padStart(2, "0") : "";
    const timePart = [h, m, s].filter(Boolean).join(":");
    if (timePart) parts.push(timePart);
  }
  return parts.length ? parts.join(sep) : "--";
});

// 仅在客户端挂载后更新时间，并每秒刷新
onMounted(() => {
  currentTime.value = new Date();
  setInterval(() => {
    currentTime.value = new Date();
  }, 1000);
});
</script>
<!-- 时间组件 -->
<template>
  <div class="time-container">
    <p>{{ greeting }}</p>
    &nbsp;
    <p>{{ timeText }}</p>
  </div>
</template>
<style scoped lang="less">
.time-container {
  display: flex;
  align-items: center;
  color: inherit; // 继承父元素颜色

  p {
    font-size: var(--fs-12);
    font-weight: bold;
  }
}
</style>
