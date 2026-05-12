import { f } from "vue-router/dist/router-CWoNjPRp.mjs";

/**
 * 生产环境才加载的脚本标识
 * npm run prod 时加载，npm run dev 时不加载
 * 在 plugins/init.client.ts 中根据此配置执行加载
 */
export const prodOnlyScripts: string[] = ["DisableZoom", "WebsiteAntiScraping"];

/**
 * 站点基础信息（用于 nuxt.config title、layouts/Header/LOGO 等）
 */
export const siteConfig = {
  /** 站点名称 */
  siteName: "波仔椿",
} as const;

/**
 * 个人信息配置（用于 pages/Home/InformationBar.vue）
 */
export const userInfoConfig = {
  /** 用户姓名 */
  name: "陈春波",
  /** 设计师箴言数组（打字机效果） */
  proverbs: [
    "设计的关键是沟通",
    "设计是解决问题,不是创造美",
    "好的设计让复杂变简单",
    "设计是形式追随功能",
    "细节决定成败,设计成就未来",
    "好的设计是看不见的设计",
    "设计是创造有意义的秩序",
    "用户体验是设计的核心",
    "设计是艺术与科学的结合",
    "好的设计应该是直观的",
    "设计是为了解决用户的问题",
    "设计是一种思维方式",
  ],
  /** 个人信息项（职业、状态、城市等） */
  infoItems: [
    { icon: "icon-Occupation", text: "UI/UX设计" },
    { icon: "icon-WorkStatus", text: "在职" },
    { icon: "icon-City", text: "北京" },
  ],
} as const;

/**
 * 技术栈配置（用于 layouts/Footer/TechnologyStack.vue）
 */
export const technologyStackConfig = [
  "Vue3",
  "TypeScript",
  "Nuxt",
  "Less",
  "TRAE CN",
  "Inscode云部署",
] as const;

/**
 * 版权配置（用于 components/Systems/SystemCopyright.vue）
 */
export const copyrightConfig = {
  /** 版权起始年份 */
  startYear: 2025,
  /** 站点域名 */
  domain: "https://chenchunbo.cn",
  /** 链接文字（与 siteName 一致） */
  siteName: "波仔椿",
  ICP: "京ICP备2026012271号-1",
  publicNetwork: "京公网安备11011402055614号",
} as const;

/**
 * 首页菜单项（用于 pages/index.vue）
 * iconKey 对应 ~/assets/images/[iconKey].png，由 index.vue 通过 iconMap 解析
 */
export interface HomeMenuItem {
  name: string;
  path: string;
  iconKey: string;
  isDisabled?: boolean;
  message?: string;
  isNew?: boolean;
}

export const homeMenuConfig: HomeMenuItem[] = [
  { name: "原色空间", path: "/ColorSpace", iconKey: "secaiku", isNew: true },
  {
    name: "免费资源",
    path: "/ResourceLibrary",
    iconKey: "ziyuanku",
    isNew: false,
  },
  { name: "书签大全", path: "/Bookmark", iconKey: "wangzhiku", isNew: false },
  {
    name: "应用商店",
    path: "/AppStore",
    iconKey: "yingyongku",
    isDisabled: true,
    message: "应用库暂未开放，戳公众号看最新设计资讯",
  },
  {
    name: "我的作品",
    path: "/WorkLibrary",
    iconKey: "wodezuopin",
    isNew: false,
  },
  {
    name: "AI Agent",
    path: "/Agents",
    iconKey: "wodezuopin",
    isDisabled: true,
    message: "正在开发中～",
  },
];

/**
 * 时间展示配置（用于 layouts/Header/Time.vue）
 * 格式：年、月、日、星期、时分秒，可单独控制显示与隐藏
 */
export const timeDisplayConfig = {
  showYear: true, //年
  showMonth: true, //月份
  showDay: true, //日期
  showWeekday: true, //星期
  showHour: true, //小时
  showMinute: true, //分钟
  showSecond: true, //秒
  /** 各部分之间的分隔符 */
  separator: " ", //分隔符
} as const;

/**
 * 移动端导航菜单配置
 * 用于控制哪些页面在移动端显示导航菜单图标
 */
export const mobileNavigationConfig = {
  /** 在移动端显示导航菜单的路由路径前缀 */
  nestedRoutes: [
    "/ColorSpace",
    "/ResourceLibrary",
    "/Bookmark",
    // '/WorkLibrary'
  ],
} as const;

/**
 * 页面布局配置
 * 用于自定义不同页面的布局元素显示（如版权声明等）
 */
export interface PageLayoutConfig {
  /** 是否显示版权声明 */
  showCopyright?: boolean;
  /** 是否显示欢迎动画 */
  showWelcome?: boolean;
}

export interface PageConfig {
  /** 路径匹配模式：精确路径或路径前缀 */
  [pathPattern: string]: PageLayoutConfig | undefined;
}

/**
 * 页面配置
 * key 为路由路径（支持精确匹配，如 /ResourceLibrary/openDetail）
 */
export const pageConfig: PageConfig = {
  /** 首页：显示欢迎动画 */
  "/": {
    showWelcome: false,
  },
  /** 文档详情页：不显示版权声明 */
  "/ResourceLibrary/openDetail": {
    showCopyright: false,
  },
  /** 工作台页面：不显示版权声明 */
  "/documentEditing": {
    showCopyright: false,
  },
};

/**
 * 获取当前路径对应的页面配置
 * @param path 当前路由路径
 */
export function getPageLayoutConfig(path: string): Partial<PageLayoutConfig> {
  const exact = pageConfig[path];
  if (exact) return exact;

  for (const [pattern, config] of Object.entries(pageConfig)) {
    if (path.startsWith(pattern + "/") || path === pattern) {
      return config ?? {};
    }
  }

  return {};
}
