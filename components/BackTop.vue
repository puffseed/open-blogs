<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";

// 控制返回顶部按钮的显示/隐藏
const isVisible = ref(false);

// 监听滚动事件
const handleScroll = () => {
  // 当滚动超过200px时显示返回顶部按钮
  isVisible.value = window.scrollY > 200;
};

// 返回顶部功能
const backToTop = () => {
  window.scrollTo({
    top: 0,
    behavior: "smooth", // 平滑滚动
  });
};

// 组件挂载时添加滚动监听
onMounted(() => {
  window.addEventListener("scroll", handleScroll);
});

// 组件卸载时移除滚动监听
onUnmounted(() => {
  window.removeEventListener("scroll", handleScroll);
});
</script>
<!-- 使用示例
<BackTop />
放在布局或页面中即可，滚动超过 200px 时显示，点击平滑回到顶部。
-->
<!-- 返回顶部组件 -->
<template>
  <div class="back-top" :class="{ show: isVisible }" @click="backToTop">
    <div class="box hand">
      <p class="text">置顶</p>
      <i class="iconfont icon-BackTop"></i>
    </div>
  </div>
</template>

<style scoped lang="less">
.back-top {
  position: fixed;
  bottom: 4rem;
  right: 2rem;
  cursor: pointer;
  transition: all 0.3s ease;
  color: var(--white);
  font-size: 14px;
  display: none; // 默认隐藏按钮
  pointer-events: none; // 默认不可点击

  .box {
    width: var(--size-32);
    height: var(--size-32);
    background: var(--black);
    border-radius: var(--size-12);
    display: flex;
    justify-content: center;
    align-items: center;
    transition: all 0.3s ease;

    .text {
      margin: 0;
      font-size: var(--fs-12);
    }

    i {
      display: none;
      font-size: var(--fs-24);
    }
  }

  // 鼠标悬停效果
  .box:hover {
    background: rgba(0, 0, 0, 0.7);
    transform: translateY(-4px);

    .text {
      display: none;
    }

    i {
      display: block;
    }
  }

  // 显示状态
  &.show {
    display: block;
    pointer-events: auto;
  }
}
</style>
