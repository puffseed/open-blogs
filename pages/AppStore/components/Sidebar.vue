<script setup lang="ts">
import { ref } from "vue";

const searchQuery = ref("");

interface Module {
  name: string;
  icon: string;
  apps: any[];
}

const props = defineProps<{
  modules: Module[];
  selectedModule: Module | null;
}>();

const emit = defineEmits<{
  (e: "select-module", module: Module): void;
}>();

const handleModuleClick = (module: Module) => {
  emit("select-module", module);
};
</script>
<template>
  <div class="sidebar">
    <div class="sidebar-content">
      <div class="search-bar">
        <input
          type="text"
          v-model="searchQuery"
          placeholder="搜索应用"
          class="search-input"
        />
        <i class="iconfont icon-bozai"></i>
      </div>
      <div class="menu-list">
        <div
          v-for="(module, index) in modules"
          :key="index"
          class="menu-item"
          :class="{
            active: selectedModule && selectedModule.name === module.name,
          }"
          @click="handleModuleClick(module)"
        >
          <i class="iconfont" :class="module.icon"></i>
          <span>{{ module.name }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="less">
.sidebar {
  width: 200px;
  flex-shrink: var(--size-0);
  height: 100%;
  border-right: 1px solid var(--border);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  padding: var(--size-12);
  .sidebar-content {
    flex: 1;
    min-height: var(--size-0);
    overflow-y: auto;
    overflow-x: hidden;
    scrollbar-width: none;
  }
  // 搜索栏
  .search-bar {
    position: relative;
    background: var(--white);
    border: 1px solid var(--border);
    border-radius: 8px;
    padding: 12px;
    display: flex;
    align-items: center;
    margin-bottom: 12px;

    .search-input {
      flex: 1;
      border: none;
      background: transparent;
      outline: none;
      font-size: var(--fs-12);
      color: var(--secondaryText);

      &::placeholder {
        color: var(--disabledText);
      }
    }

    .iconfont {
      font-size: 16px;
      color: var(--secondaryText);
      margin-left: 8px;
    }
  }
  // 菜单列表
  .menu-list {
    display: flex;
    flex-direction: column;
    gap: var(--size-8);
    .menu-item {
      display: flex;
      align-items: center;
      gap: var(--size-12);
      padding: var(--size-12);
      border-radius: var(--size-8);
      cursor: pointer;
      transition: all 0.2s ease;

      &:hover {
        background: var(--hover);
      }

      &.active {
        background: var(--hover);

        span {
          color: var(--primary);
        }
      }

      .iconfont {
        font-size: var(--fs-16);
        color: var(--primary);
        transition: all 0.2s ease;
      }

      span {
        font-size: var(--fs-14);
        color: var(--mainText);
        font-weight: bold;
        transition: all 0.2s ease;
      }
    }
  }
}
</style>
