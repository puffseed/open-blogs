<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";

interface AppItem {
  id: string;
  name: string;
  description: string;
  cover: string;
  path: string;
}

const route = useRoute();
const appData = ref<AppItem | null>(null);
const loading = ref(true);
const error = ref<string | null>(null);

onMounted(async () => {
  try {
    loading.value = true;
    const appId = route.query.id as string;
    
    if (!appId) {
      error.value = "缺少应用ID参数";
      return;
    }
    
    // 加载AppStore数据
    const appStoreData = await import("~/json/AppStore.json");
    const modules = appStoreData.default.modules;
    
    // 查找对应ID的应用
    let foundApp: AppItem | null = null;
    for (const module of modules) {
      const app = module.apps.find((item: AppItem) => item.id === appId);
      if (app) {
        foundApp = app;
        break;
      }
    }
    
    if (foundApp) {
      appData.value = foundApp;
    } else {
      error.value = "未找到对应的应用";
    }
  } catch (err) {
    error.value = "加载应用详情失败";
    console.error(err);
  } finally {
    loading.value = false;
  }
});
</script>

<template>
  <div class="app-detail">
    <div v-if="loading" class="loading">
      <p>加载中...</p>
    </div>
    <div v-else-if="error" class="error">
      <p>{{ error }}</p>
    </div>
    <div v-else-if="appData" class="app-content">
      <div class="app-header">
        <div class="app-icon">
          <img :src="appData.cover" :alt="appData.name" />
        </div>
        <div class="app-info">
          <h1 class="app-name">{{ appData.name }}</h1>
          <p class="app-description">{{ appData.description }}</p>
        </div>
      </div>
      <div class="app-body">
        <h2>应用详情</h2>
        <div class="detail-item">
          <span class="label">应用ID:</span>
          <span class="value">{{ appData.id }}</span>
        </div>
        <div class="detail-item">
          <span class="label">应用路径:</span>
          <span class="value">{{ appData.path }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="less">
.app-detail {
  padding: 24px;
  max-width: 600px;
  margin: 0 auto;

  .loading, .error {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 300px;
    font-size: 16px;
  }

  .error {
    color: #ff4d4f;
  }

  .app-content {
    .app-header {
      display: flex;
      align-items: center;
      margin-bottom: 24px;
      padding-bottom: 24px;
      border-bottom: 1px solid #e0e0e0;

      .app-icon {
        width: 80px;
        height: 80px;
        border-radius: 16px;
        overflow: hidden;
        margin-right: 24px;

        img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
      }

      .app-info {
        flex: 1;

        .app-name {
          font-size: 24px;
          font-weight: 600;
          color: #333;
          margin: 0 0 8px 0;
        }

        .app-description {
          font-size: 16px;
          color: #666;
          margin: 0;
          line-height: 1.4;
        }
      }
    }

    .app-body {
      h2 {
        font-size: 18px;
        font-weight: 600;
        color: #333;
        margin: 0 0 16px 0;
      }

      .detail-item {
        display: flex;
        margin-bottom: 12px;

        .label {
          width: 80px;
          font-weight: 500;
          color: #666;
        }

        .value {
          flex: 1;
          color: #333;
        }
      }
    }
  }
}
</style>
