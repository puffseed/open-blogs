import {
  shouldShowSkeleton,
} from "../config/skeleton.config";

/**
 * 路由切换时设置全局状态，供布局显示骨架屏（卡片型 / 列表型）
 * 业务规则：仅 config/skeleton.config 中配置的路由显示骨架屏
 */
export default defineNuxtPlugin(() => {
  const isNavigating = useState("route-transitioning", () => false);
  const skeletonTargetPath = useState<string>("skeleton-target-path", () => "");
  const router = useRouter();

  router.beforeEach((to: { path: string }) => {
    if (shouldShowSkeleton(to.path)) {
      isNavigating.value = true;
      skeletonTargetPath.value = to.path;
    }
  });

  router.afterEach(() => {
    nextTick(() => {
      requestAnimationFrame(() => {
        setTimeout(() => {
          isNavigating.value = false;
          skeletonTargetPath.value = "";
        }, 1200);
      });
    });
  });
});
