export interface MenuItem {
  path: string;
  name: string;
}
// 菜单配置接口
export interface MenusConfig {
  [key: string]: MenuItem[];
}
// 二级菜单配置
export const menusConfig: MenusConfig = {
  // 原色空间
  "/ColorSpace": [
    { path: "/ColorSpace/basic", name: "基础色" },
    { path: "/ColorSpace/chinese", name: "中国色" },
    { path: "/ColorSpace/pantong", name: "潘通色" },
    { path: "/ColorSpace/gradient", name: "渐变色" },
    // { path: '/ColorSpace/colorMatching', name: '色彩搭' }
  ],
  // 免费资源
  "/ResourceLibrary": [
    { path: "/ResourceLibrary/document", name: "文档模板" },
    { path: "/ResourceLibrary/fonts", name: "商用字体" },
    // { path: '/ResourceLibrary/otherResource', name: '其他资源' },
  ],
  // 书签大全
  "/Bookmark": [
    { path: "/Bookmark/pm", name: "产品经理" },
    { path: "/Bookmark/ui", name: "UI设计师" },
    { path: "/Bookmark/web", name: "前端开发" },
    { path: "/Bookmark/backstage", name: "后端开发" },
  ],
  // 作品集
  "/WorkLibrary": [
    { path: "/WorkLibrary/mogao", name: "莫高作品" },
    // { path: '/WorkLibrary/modao', name: '墨刀作品' },
  ],
  // '/timeMachine': [
  //   { path: '/timeMachine', name: '时光机首页' },
  //   { path: '/timeMachine/TimeCapsule', name: '时间胶囊' }
  // ]
};
