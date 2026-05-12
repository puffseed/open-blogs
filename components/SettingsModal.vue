<script setup>
import { useCounterStore } from "../stores/counter";
import DarkModes from "../layouts/Header/DarkModes.vue";

const counterStore = useCounterStore();
</script>
<template>
  <div class="settings-modal">
    <div class="settings-header">
      <h3 class="settings-title">设置</h3>
      <div class="settings-close" @click="counterStore.hideSettingsModal()">
        <i class="iconfont icon-Close"></i>
      </div>
    </div>
    <div class="settings-content">
      <div class="settings-item">
        <span class="settings-label">主题模式</span>
        <DarkModes />
      </div>
    </div>
  </div>
</template>
<style scoped lang="less">
.settings-modal {
  background-color: var(--white);
  border-radius: var(--size-12);
  padding-top: var(--size-0);
  padding-bottom: var(--size-0);
  padding-left: var(--size-12);
  padding-right: var(--size-12);
  min-width: 300px;

  .settings-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: var(--size-16);
    border-bottom: 1px solid var(--border);
    padding-bottom: var(--size-12);

    .settings-title {
      margin: 0;
      font-size: var(--fs-18);
      color: var(--mainText);
      font-weight: 600;
    }

    .settings-close {
      cursor: pointer;
    }
  }

  .settings-content {
    .settings-item {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: var(--size-12) 0;

      .settings-label {
        font-size: var(--fs-14);
        color: var(--mainText);
      }
    }
  }
}
</style>
