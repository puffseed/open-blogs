<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from "vue";
import MainContent from "~/layouts/MainContent/index.vue";
import Header from "~/layouts/Header/index.vue";

const route = useRoute();
const isHeaderSticky = ref(false);
const scrollThreshold = 0;

const showHeader = computed(() => {
  // 详情页和工作台页不显示页关栏
  if (route.path === '/ResourceLibrary/openDetail' || route.path === '/documentEditing') return false;
  const noHeader = route.query.noHeader === 'true';
  return !noHeader;
});

const handleScroll = () => {
  const scrollY = window.scrollY || document.documentElement.scrollTop;
  isHeaderSticky.value = scrollY > scrollThreshold;
};

onMounted(() => {
  window.addEventListener("scroll", handleScroll);
});

onUnmounted(() => {
  window.removeEventListener("scroll", handleScroll);
});
</script>
<!-- 布局组件 -->
<template>
  <div class="App">
    <Header v-if="showHeader" :class="{ 'sticky-header': isHeaderSticky }" />
    <MainContent>
      <slot />
    </MainContent>
  </div>
</template>

<style scoped lang="less">
.App {
  width: 100%;
  display: flex;
  flex-direction: column;
}

:deep(.sticky-header) {
  position: sticky;
  top: 0;
  z-index: 9999;
  box-shadow: 0 2px var(--size-8) rgba(0, 0, 0, 0.1);
}
</style>
