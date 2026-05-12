import { csdnRssConfig } from "../../config/csdn-rss.config";

/**
 * CSDN RSS 服务端代理，避免浏览器 CORS 限制
 * 数据源：config/csdn-rss.config.ts 中配置的订阅地址
 */
export default defineEventHandler(async (event) => {
  try {
    const res = await fetch(csdnRssConfig.feedUrl, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (compatible; NuxtRSS/1.0)",
      },
    });
    if (!res.ok) {
      throw new Error(`RSS 源请求失败: ${res.status}`);
    }
    const xml = await res.text();
    setResponseHeader(event, "Content-Type", "application/xml; charset=utf-8");
    return xml;
  } catch (e) {
    setResponseStatus(event, 502);
    return {
      error: e instanceof Error ? e.message : "获取 RSS 失败",
    };
  }
});
