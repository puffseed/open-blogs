<script setup lang="ts">
import { computed } from "vue";
import BackTop from "~/components/BackTop.vue";
import QRCodes from "~/components/QRCodes/index.vue";
import SettingsModal from "~/components/SettingsModal.vue";
import CardSkeleton from "~/components/Cards/CardSkeleton.vue";
import ListSkeleton from "~/components/ListSkeleton.vue";
import SystemCopyright from "~/components/Systems/SystemCopyright.vue";
import FilingInformation from "~/components/FilingInformation.vue";
import GlobalDraftBox from "~/components/Documents/GlobalDraftBox.vue";
import {
  cardSkeletonDefaults,
  listSkeletonDefaults,
  shouldShowCardSkeleton,
  shouldShowListSkeleton,
} from "../../config/skeleton.config";
import { getPageLayoutConfig } from "../../config/pageConfig";
import { useCounterStore } from "../../stores/counter";

const counterStore = useCounterStore();
const route = useRoute();

/** 路由切换中（由 plugins/route-transition.client.ts 维护），用于显示全局骨架屏 */
const isNavigating = useState<boolean>("route-transitioning", () => false);
/** 骨架屏目标路由（用于区分卡片型/列表型） */
const skeletonTargetPath = useState<string>("skeleton-target-path", () => "");

/** 当前应显示的骨架屏类型 */
const skeletonType = computed<"card" | "list" | null>(() => {
  const path = skeletonTargetPath.value || route.path;
  if (shouldShowCardSkeleton(path)) return "card";
  if (shouldShowListSkeleton(path)) return "list";
  return null;
});

/** 是否显示版权声明（由 pageConfig 控制） */
const showCopyright = computed(() => {
  const config = getPageLayoutConfig(route.path);
  return config.showCopyright !== false;
});
</script>

<template>
  <div class="main-content">
    <ClientOnly>
      <template #default>
        <div class="page-transition-wrapper">
          <Transition name="skeleton-fade" mode="out-in">
            <div
              v-if="isNavigating"
              key="skeleton"
              class="page-skeleton"
              role="status"
              aria-label="加载中"
            >
              <CardSkeleton
                v-if="skeletonType === 'card'"
                :card-count="cardSkeletonDefaults.cardCount"
              />
              <ListSkeleton
                v-else-if="skeletonType === 'list'"
                :line-count="listSkeletonDefaults.lineCount"
              />
              <CardSkeleton
                v-else
                :card-count="cardSkeletonDefaults.cardCount"
              />
            </div>
            <div v-else key="page" class="page-slot">
              <slot />
            </div>
          </Transition>
        </div>
      </template>
      <template #fallback>
        <div class="page-transition-wrapper">
          <div class="page-slot">
            <slot />
          </div>
        </div>
      </template>
    </ClientOnly>
    <!-- 返回顶部按钮 -->
    <BackTop />
    <div class="copyright-box">
      <!-- 版权声明（详情页等可通过 pageConfig 隐藏） -->
      <SystemCopyright v-if="showCopyright" />
      <FilingInformation v-if="showCopyright" />
    </div>

    <!-- 微信公众号二维码遮罩层 -->
    <div
      v-if="counterStore.showWechatQRCode"
      class="download-mask"
      @click="counterStore.hideWechatQRCodeModal()"
    >
      <div class="mask-content" @click.stop>
        <QRCodes source="wechat" />
      </div>
    </div>
    <!-- 全局草稿箱入口（有草稿时右下角显示，角标为数量） -->
    <GlobalDraftBox />

    <!-- 使用指南二维码遮罩层 -->
    <div
      v-if="counterStore.showGuideQRCode"
      class="download-mask"
      @click="counterStore.hideGuideQRCodeModal()"
    >
      <div class="mask-content" @click.stop>
        <QRCodes source="guide" :appName="counterStore.currentGuideAppName" />
      </div>
    </div>
    <!-- 设置模态框遮罩层 -->
    <div
      v-if="counterStore.showSettings"
      class="download-mask"
      @click="counterStore.hideSettingsModal()"
    >
      <div class="mask-content" @click.stop>
        <SettingsModal />
      </div>
    </div>
  </div>
</template>
<style scoped lang="less">
.main-content {
  width: 100%;
  position: relative;
  background-color: var(--background);
  .copyright-box {
    display: flex;
    justify-content: center;
    padding: 0.3rem 1rem;
    background: var(--black);
  }
  .page-transition-wrapper {
    width: 100%;
    min-height: 100vh;
    position: relative;
  }

  .page-skeleton {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 1;
    padding: 1.5rem;
    box-sizing: border-box;
  }

  .page-slot {
    position: relative;
    z-index: 0;
  }

  .skeleton-fade-enter-active,
  .skeleton-fade-leave-active {
    transition: opacity 0.15s ease;
  }

  .skeleton-fade-enter-from,
  .skeleton-fade-leave-to {
    opacity: 0;
  }

  // 下载二维码遮罩层
  .download-mask {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.5);
    backdrop-filter: blur(5px);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 10000;
    cursor: pointer;

    .mask-content {
      cursor: default;
      padding: var(--size-20);
      border-radius: var(--size-12);
      background-color: var(--white);
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
    }
  }
}

@media (max-width: 768px) {
  .copyright-box {
    flex-direction: column;
  }
}
</style>
