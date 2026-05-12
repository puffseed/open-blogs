<script setup lang="ts">
/**
 * SystemJump 跳转占位组件
 *
 * 使用说明
 * ---------
 * 1. 文案：固定「正在跳转」+ 动态文字（通过 prop text 传入），展示为「正在跳转到 {text}…」
 * 2. 布局：上图下文字（上方为图标，下方为上述文案）
 * 3. 背景：深色平滑渐变（左紫靛→右暗青蓝）+ 柔和光晕与轻微呼吸动效
 * 4. 背景为纯 CSS 实现，无需额外依赖。
 *
 * 使用示例
 * ---------
 *   <SystemJump text="渐变色彩" />
 *   <SystemJump text="MasterGo" />
 *   <SystemJump text="字体库" />
 *   <SystemJump text="书签集" />
 *   <SystemJump />   // 仅显示「正在跳转…」
 *
 * Props
 * -----
 *   text?: string  动态显示文字，会拼接为「正在跳转到 {text}…」；不传则显示「正在跳转…」
 */
const props = withDefaults(
  defineProps<{
    /** 动态文字，展示为「正在跳转到 {text}…」 */
    text?: string
  }>(),
  { text: '' }
)

const displayText = computed(() =>
  props.text ? `正在跳转到${props.text}…` : '正在跳转…'
)
</script>

<template>
  <div class="system-jump">
    <div class="system-jump-content">
      <p class="system-jump-text">{{ displayText }}</p>
    </div>
  </div>
</template>

<style scoped lang="less">
.system-jump {
  position: relative;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  overflow: hidden;

  .system-jump-content {
    position: relative;
    z-index: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1rem;
    padding: 2rem;
    text-align: center;
  }

  .system-jump-text {
    margin: 0;
    font-size: 14px;
    line-height: 1.5;
    color: rgba(32, 32, 32, 0.88);
  }
}
</style>
