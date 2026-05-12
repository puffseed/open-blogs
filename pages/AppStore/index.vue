<script setup lang="ts">
import { ref, onMounted, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import Sidebar from "./components/Sidebar.vue";
import ListPage from "./components/ListPage.vue";

interface Module {
  name: string;
  icon: string;
  apps: AppItem[];
}

interface AppItem {
  id: string;
  name: string;
  description: string;
  cover: string;
  path: string;
  rank?: number;
}

const modules = ref<Module[]>([]);
const selectedModule = ref<Module | null>(null);
const route = useRoute();
const router = useRouter();

onMounted(async () => {
  try {
    const appStoreData = await import("~/json/AppStore.json");
    modules.value = appStoreData.default.modules;
    // 默认选中第一个模块
    if (modules.value.length > 0) {
      selectedModule.value = modules.value[0];
    }
    // 检查路由参数，加载对应应用
    checkRouteParams();
  } catch (error) {
    console.error("加载AppStore数据失败:", error);
  }
});

// 监听路由参数变化
watch(() => route.query, () => {
  checkRouteParams();
}, { deep: true });

const checkRouteParams = async () => {
  // 同时处理大小写的id参数
  const appId = (route.query.id || route.query.Id) as string;
  if (appId) {
    try {
      const appStoreData = await import("~/json/AppStore.json");
      const allApps = appStoreData.default.modules.flatMap(module => module.apps);
      const app = allApps.find((item: AppItem) => item.id === appId);
      if (app && app.path) {
        // 直接重定向到应用的path路径
        router.replace(app.path);
      }
    } catch (error) {
      console.error("加载应用数据失败:", error);
    }
  }
};

const handleModuleSelect = (module: Module) => {
  selectedModule.value = module;
  // 为每个应用添加rank属性
  selectedModule.value.apps.forEach((app, index) => {
    app.rank = index + 1;
  });
  // 清除路由参数
  router.push({
    path: route.path.split('/').slice(0, 2).join('/')
  });
};

const handleUseApp = (app: AppItem) => {
  if (app.path) {
    // 直接重定向到应用的path路径
    router.push(app.path);
  }
};
</script>

<template>
  <div class="application-component">
    <div class="app-view">
      <Sidebar
        :modules="modules"
        :selectedModule="selectedModule"
        @select-module="handleModuleSelect"
      />
      <div class="main-content">
        <!-- 应用列表页 -->
        <div class="app-list-page">
          <div class="content-header">
            <h1 class="page-title">{{ selectedModule?.name || "应用商店" }}</h1>
          </div>
          <ListPage 
            v-if="selectedModule" 
            :apps="selectedModule.apps" 
            @use-app="handleUseApp"
          />
          <div v-else class="empty-state">
            <p>请选择一个分类</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="less">
.application-component {
  padding-top: 50px;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  width: 100%;
  height: 100%;
  z-index: 10;
  background-color: #f5f5f5;
}
.app-view {
  display: flex;
  width: 100%;
  height: 100%;
  overflow: hidden;

  .main-content {
    padding: var(--size-24);
    flex: 1;
    min-width: 0;
    height: 100%;
    overflow-y: auto;
    
    .app-list-page {
      .content-header {
        margin-bottom: 24px;

        .page-title {
          font-size: 24px;
          font-weight: 600;
          color: #333;
          margin: 0;
        }
      }

      .empty-state {
        display: flex;
        align-items: center;
        justify-content: center;
        height: 300px;
        background-color: white;
        border-radius: 8px;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);

        p {
          font-size: 16px;
          color: #999;
        }
      }
    }
  }
}
</style>
