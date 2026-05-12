export type SocialItemType = "external" | "internal" | "modal";

export interface SocialItem {
  name: string;
  iconName: string;
  text: string;
  type: SocialItemType;
  href?: string;
  path?: string;
}

export interface SocialConfig {
  webItems: string[];
  mobileItems: string[];
  items: SocialItem[];
}

export const socialConfig: SocialConfig = {
  webItems: [
    "TimeHourglass",
    "xiezuo",
    "weixin",
    "yuque",
    "csdn",
    "github",
    "bozai",
    "Set",
  ],
  mobileItems: ["weixin", "bozai"],
  items: [
    // {
    //   name: 'TimeHourglass',
    //   iconName: 'TimeHourglass',
    //   text: '时间胶囊',
    //   type: 'internal',
    //   path: '/timeMachine',
    // },
    // {
    //   name: "TimeHourglass",
    //   iconName: "TimeHourglass",
    //   text: "赞助",
    //   type: "internal",
    //   path: "/sponsorship",
    // },
    // {
    //   name: "xiezuo",
    //   iconName: "DocumentWriting",
    //   text: "工作台",
    //   type: "internal",
    //   path: "/documentEditing",
    // },
    {
      name: "weixin",
      iconName: "weixin",
      text: "微信公众号",
      type: "modal",
    },
    {
      name: "yuque",
      iconName: "yuque",
      text: "语雀",
      type: "external",
      href: "https://yuque.com/chenchunbo",
    },
    {
      name: "csdn",
      iconName: "csdn",
      text: "csdn",
      type: "external",
      href: "https://chenchunbo.blog.csdn.net/",
    },
    {
      name: "github",
      iconName: "github",
      text: "github",
      type: "external",
      href: "https://github.com/chenchunbo-git",
    },
    {
      name: "bozai",
      iconName: "bozai",
      text: "关于波仔",
      type: "external",
      href: "https://mastergo.com/community/profile/50100622154257",
    },
    {
      name: "Set",
      iconName: "Set",
      text: "设置",
      type: "modal",
    },
  ],
};
