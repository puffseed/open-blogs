<script setup lang="ts">
import { menusConfig } from "../../config/MenusConfig";

interface NavItemWithActive {
  path: string;
  name: string;
  isActive: boolean;
}

const mainNavRoutes = [
  { path: '/', name: '首页' },
  { path: '/about', name: '关于' },
  { path: '/ColorSpace', name: '原色空间' },
  { path: '/resourceLibrary', name: '资源库' },
  { path: '/WorkLibrary', name: '作品集' },
  { path: '/apps', name: '应用集' },
  { path: '/Bookmark', name: '书签集' },
  { path: '/timeMachine', name: '时光机' },
  { path: '/sponsorship', name: '赞助与支持' }
];

const props = withDefaults(
  defineProps<{
    visible: boolean;
  }>(),
  { visible: false }
);

const emit = defineEmits<{
  close: [];
}>();

const route = useRoute();
const router = useRouter();

const currentKey = computed(() => {
  if (route.path === '/') return '/';
  for (const key of Object.keys(menusConfig)) {
    if (route.path.startsWith(key)) return key;
  }
  return '/';
});

const navigationRoutes = computed(() => {
  if (currentKey.value === '/') return mainNavRoutes;
  return menusConfig[currentKey.value] ?? [];
});

const navItemsWithActive = computed<NavItemWithActive[]>(() => {
  return navigationRoutes.value.map((item) => {
    const isActive =
      item.path === '/'
        ? route.path === '/'
        : route.path === item.path || route.path.startsWith(item.path + '/');
    return { ...item, isActive };
  });
});

const handleNavClick = (path: string) => {
  router.push(path);
  emit('close');
};

watch(() => route.path, () => {
  emit('close');
});
</script>

<template>
  <!-- 遮罩层 -->
  <Transition name="fade">
    <div
      v-if="visible"
      class="mobile-navigation-overlay"
      @click="emit('close')"
    />
  </Transition>

  <!-- 右侧侧边栏 -->
  <Transition name="slide-right">
    <nav v-if="visible && navItemsWithActive.length > 0" class="mobile-navigation">
      <div class="mobile-navigation-header">
        <h3 class="mobile-navigation-title">导航菜单</h3>
        <button
          type="button"
          class="mobile-navigation-close"
          aria-label="关闭"
          @click="emit('close')"
        >
          <i class="iconfont icon-Close" />
        </button>
      </div>

      <div class="mobile-navigation-content">
        <NuxtLink
          v-for="item in navItemsWithActive"
          :key="item.path"
          :to="item.path"
          class="mobile-navigation-item"
          :class="{ 'mobile-navigation-item-active': item.isActive }"
          @click="handleNavClick(item.path)"
        >
          <span class="mobile-navigation-text">{{ item.name }}</span>
          <div v-if="item.isActive" class="mobile-navigation-indicator">
            <span class="mobile-navigation-dot mobile-navigation-dot-left" />
            <span class="mobile-navigation-line" />
            <span class="mobile-navigation-dot mobile-navigation-dot-right" />
          </div>
        </NuxtLink>
      </div>
    </nav>
  </Transition>
</template>

<style scoped lang="less">
.mobile-navigation-overlay {
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 9998;
  backdrop-filter: blur(2px);
}

.mobile-navigation {
  position: fixed;
  top: 0;
  right: 0;
  width: 280px;
  height: 100vh;
  background-color: var(--white);
  box-shadow: -2px 0 8px rgba(0, 0, 0, 0.15);
  z-index: 9999;
  display: flex;
  flex-direction: column;
  overflow-y: auto;

  .mobile-navigation-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: var(--size-16) var(--size-20);
    border-bottom: 1px solid var(--dividerLine);

    .mobile-navigation-title {
      font-size: var(--fs-16);
      font-weight: bold;
      color: var(--title);
      margin: 0;
    }

    .mobile-navigation-close {
      width: var(--size-32);
      height: var(--size-32);
      display: flex;
      align-items: center;
      justify-content: center;
      border: none;
      background: transparent;
      cursor: pointer;
      color: var(--mainText);
      transition: color 0.2s ease;

      &:hover {
        color: var(--primary);
      }

      .iconfont {
        font-size: 18px;
      }
    }
  }

  .mobile-navigation-content {
    flex: 1;
    padding: var(--size-12) 0;
    overflow-y: auto;
  }

  .mobile-navigation-item {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    text-decoration: none;
    padding: var(--size-16) var(--size-20);
    border-bottom: 1px solid var(--dividerLine);
    transition: background-color 0.2s ease;
    color: inherit;

    &:hover {
      background-color: var(--hover);
    }

    .mobile-navigation-text {
      font-size: 15px;
      color: var(--secondaryText);
      font-weight: normal;
      transition: color 0.2s ease, font-weight 0.2s ease;
      will-change: color, font-weight;
    }

    &.mobile-navigation-item-active {
      background-color: var(--primaryBackground);

      .mobile-navigation-text {
        color: var(--primary);
        font-weight: bold;
      }
    }

    .mobile-navigation-indicator {
      display: flex;
      align-items: center;
      justify-content: flex-start;
      margin-top: var(--size-8);
      width: 100%;
      height: var(--size-4);
      position: relative;

      .mobile-navigation-dot {
        width: var(--size-4);
        height: var(--size-4);
        border-radius: 50%;
        background-color: var(--primary);
        flex-shrink: 0;
        z-index: 2;
      }

      .mobile-navigation-line {
        flex: 1;
        height: 2px;
        background-color: var(--primary);
        margin: 0 2px;
        align-self: center;
      }
    }
  }
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.slide-right-enter-active,
.slide-right-leave-active {
  transition: transform 0.3s ease;
}

.slide-right-enter-from,
.slide-right-leave-to {
  transform: translateX(100%);
}
</style>
