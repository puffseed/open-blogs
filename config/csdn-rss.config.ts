/**
 * CSDN 博客 RSS 订阅配置
 * 格式说明：CSDN 使用 RSS 2.0，地址为 rss.csdn.net/{用户名}/rss/map
 * 参考：https://blog.csdn.net/ 帮助中心 - 订阅与 RSS
 */
export const csdnRssConfig = {
  /** 当前订阅的 RSS 地址（weixin_48337566 的博客地图订阅） */
  feedUrl:
    "https://rss.csdn.net/weixin_48337566/rss/map?spm=1001.2014.3001.5494",
  /** 博客首页（「更多订阅」卡片跳转） */
  blogUrl: "https://blog.csdn.net/weixin_48337566",
} as const;
