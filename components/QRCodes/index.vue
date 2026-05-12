<!-- 获取资源组件 -->
<script setup lang="ts">
import { computed } from "vue";
import { getRouteConfig, getQrcodeConfig } from "./setShowBtn";

const props = withDefaults(
  defineProps<{
    keyword?: string;
    source?: string;
    appName?: string;
  }>(),
  { keyword: "", source: "wechat", appName: "" }
);

// 路由实例
const route = useRoute();

// 获取二维码配置
const qrcodeConfig = computed(() => {
  return getQrcodeConfig(props.source);
});

// 计算显示的关键词，优先使用props传入的，否则使用配置文件中的值
const displayKeyword = computed(() => {
  if (props.source === 'guide' && props.appName) {
    return props.appName;
  }
  if (props.keyword) {
    return props.keyword;
  }
  // 从配置文件中获取关键词
  const routeConfig = getRouteConfig(route.path);
  return routeConfig.keyword || route.meta.title || '字体库';
});
</script>
<!-- 使用示例
<QRCodes />
<QRCodes source="wechat" keyword="字体库" />
<QRCodes source="guide" appName="某应用" />
获取资源/公众号二维码展示，source: wechat | guide，可传 keyword 或 appName 覆盖展示文案。
-->
<template>
  <div class="qrcode">
    <img src="/assets/images/wechat-qrcode.png" alt="二维码" />
    <p style="color: var(--secondaryText)">
      打开微信扫一扫，或搜索公众号「波仔椿」
    </p>
    <!-- 下载图标触发的显示结构 -->
    <div v-if="qrcodeConfig.template === 'reply'" class="keywords">
      <p style="color: var(--mainText)">{{ qrcodeConfig.prefix }}</p>
      <p style="font-weight: bold; font-size: 14px; color: var(--error-active)">
        「{{ displayKeyword }}」
      </p>
      <p style="color: var(--mainText)">{{ qrcodeConfig.suffix }}</p>
    </div>
    <!-- 微信公众号图标触发的显示结构 -->
    <div v-else-if="qrcodeConfig.template === 'static'" class="keywords">
      <p style="color: var(--mainText)">{{ qrcodeConfig.content }}</p>
    </div>
  </div>
</template>
<style scoped lang="less">
.qrcode {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  background-color: var(--white);
  border-radius: var(--size-12);
  border: 0.5px solid var(--border);
  padding: var(--size-12);
  img {
    width: 250px;
    height: 250px;
  }
  p {
    font-size: var(--fs-12);
    font-weight: bold;
  }
  .keywords {
    padding-top: var(--size-6);
    display: flex;
    justify-content: center;
    align-items: center;
  }
}
</style>
