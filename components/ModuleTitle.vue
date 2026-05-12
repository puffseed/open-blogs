<script setup lang="ts">
defineProps({
  title: {
    type: String,
    default: "模块标题",
  },
});
</script>
<!-- 使用示例
<ModuleTitle title="模块标题" />
<ModuleTitle title="我的作品" />
模块标题：标题文字 + 底部强调线。
-->
<!-- 模块标题组件 -->
<template>
  <div class="moduleTitle">
    <p class="ModuleTitleText">{{ title }}</p>
    <p class="Line"></p>
  </div>
</template>
<style scoped lang="less">
.moduleTitle {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: var(--black);
  border-radius: 0.2rem;
  margin: 0.5rem 0.5rem;

  .ModuleTitleText {
    font-size: var(--fs-20);
    color: var(--title);
    font-weight: bold;
    margin-bottom: 0.5rem;
  }

  .Line {
    width: var(--size-20);
    height: 3px;
    background-color: var(--primary);
  }
}
</style>
