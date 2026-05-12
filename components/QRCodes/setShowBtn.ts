export interface RouteConfigItem {
  show: boolean;
  keyword: string;
}

export interface QrcodeConfigItem {
  type: string;
  template: "reply" | "static";
  prefix?: string;
  suffix?: string;
  content?: string;
}

export const downloadButtonConfig: {
  routes: Record<string, RouteConfigItem>;
  default: RouteConfigItem;
} = {
  routes: {
    "/fonts": { show: true, keyword: "免费商用字体" },
    "/document": { show: true, keyword: "文档库" },
    "/materialLibrary": { show: true, keyword: "素材库" },
    "/chinese": { show: false, keyword: "中国色彩" },
    "/gradient": { show: false, keyword: "渐变色彩" },
    "/pantong": { show: false, keyword: "潘通色彩" },
    "/mogaoCommunity": { show: false, keyword: "莫高社区" },
  },
  default: { show: false, keyword: "资源" },
};

export const qrcodeConfig: Record<string, QrcodeConfigItem> = {
  wechat: {
    type: "wechat",
    template: "static",
    content: "获取设计资源",
  },
  guide: {
    type: "guide",
    template: "reply",
    prefix: "回复",
    suffix: "获取使用指南",
  },
};

export const getRouteConfig = (routePath: string): RouteConfigItem => {
  return downloadButtonConfig.routes[routePath] ?? downloadButtonConfig.default;
};

export const getQrcodeConfig = (source: string): QrcodeConfigItem => {
  return qrcodeConfig[source] ?? qrcodeConfig.wechat;
};
