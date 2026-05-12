<script setup lang="ts">
import { ref, watch, computed } from "vue";
import { mobileNavigationConfig } from "~/config/pageConfig";
import LOGO from "./LOGO.vue";
import Time from "./Time.vue";
import Operation from "./Operation.vue";
import NavigationMenu from "./NavigationMenu.vue";
import MobileNavigationMenu from "./MobileNavigationMenu.vue";
const showMobileMenu = ref(false);
const route = useRoute();

const showMobileMenuIcon = computed(() => {
  const currentPath = route.path;
  return mobileNavigationConfig.nestedRoutes.some((r) =>
    currentPath.startsWith(r),
  );
});

const toggleMobileMenu = () => {
  showMobileMenu.value = !showMobileMenu.value;
};

const closeMobileMenu = () => {
  showMobileMenu.value = false;
};

watch(
  () => route.path,
  () => {
    closeMobileMenu();
  },
);
</script>
<!-- 页关组件 -->
<template>
  <div class="header">
    <!-- 左侧 -->
    <div class="header-left">
      <LOGO />
      <Time />
    </div>
    <!-- 网页端/平板导航菜单 -->
    <div class="header-nav">
      <NavigationMenu />
    </div>
    <!-- 移动端导航菜单（右侧侧边栏 + 遮罩） -->
    <MobileNavigationMenu
      v-if="showMobileMenuIcon"
      :visible="showMobileMenu"
      @close="closeMobileMenu"
    />
    <!-- 右侧 -->
    <div class="header-right">
      <!-- 移动端菜单图标：只有非首页时才显示 -->
      <i
        class="menu-text hand iconfont icon-Menu"
        @click="toggleMobileMenu"
        v-if="showMobileMenuIcon"
      ></i>
      <Operation />
    </div>
  </div>
</template>
<style lang="less" scoped>
.header {
  width: 100%;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 1rem;
  z-index: 999;
  background: linear-gradient(244deg, #212121 0%, #3c3c3c 100%);
  background-size: 2px 2px;
  backdrop-filter: saturate(50%) blur(4px);
  position: relative;
  color: var(--white);
  .header-left {
    display: flex;
    align-items: center;

    // 移动端隐藏Time组件
    @media (max-width: 768px) {
      .time-container {
        display: none;
      }
    }
  }
  .header-nav {
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    /* 移动端隐藏网页端导航菜单 */
    @media (max-width: 768px) {
      display: none;
    }
  }
  .header-right {
    display: flex;
    align-items: center;
    .menu-text {
      width: var(--size-24);
      height: var(--size-24);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: var(--fs-16);
      border-radius: 0.5rem;
      &:hover {
        border-radius: 0.5rem;
        color: var(--primary);
        background-color: var(--white);
      }
      /* 网页端隐藏菜单图标，移动端显示 */
      @media (min-width: 769px) {
        display: none;
      }
    }
  }
}
</style>
