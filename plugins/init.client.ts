import { prodOnlyScripts } from "../config/pageConfig";

/** 生产环境脚本映射：config 中的标识 -> 实际模块路径 */
const prodScriptMap: Record<string, () => Promise<unknown>> = {
  DisableZoom: () => import("~/utils/DisableZoom.js"),
  WebsiteAntiScraping: () => import("~/utils/WebsiteAntiScraping.js"),
};

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.component('QRCodes', defineAsyncComponent(() => import('~/components/QRCodes/index.vue')));

  if (process.client) {
    import('~/utils/AutomaticallyTurnGray.js');

    // 根据 ENV_MODE 判断：prod 加载防复制/防扒脚本，dev 不加载
    const envMode = useRuntimeConfig().public.envMode as string;
    if (envMode === 'prod') {
      prodOnlyScripts.forEach((key) => {
        const load = prodScriptMap[key];
        if (load) {
          load().then(() => {
            console.log(`${key} 已加载（生产环境）`);
          });
        }
      });
      console.log('生产环境：已启用防复制/防扒逻辑');
    } else {
      console.log('开发环境：未启用防复制/防扒逻辑');
    }
  }
});
