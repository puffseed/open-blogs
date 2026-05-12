import { siteConfig } from "./config/pageConfig";

export default defineNuxtConfig({
  /** 关闭遥测，避免 @nuxt/telemetry 与 Nuxt 3.6 内置 @nuxt/kit 版本不一致导致 isNuxtMajorVersion 报错 */
  telemetry: false,

  devtools: { enabled: false },

  nitro: {
    compatibilityDate: '2026-04-05',
  },

  runtimeConfig: {
    public: {
      /** 环境标识：prod=生产环境（加载防复制/防扒），dev=开发环境 */
      envMode: process.env.ENV_MODE || 'dev',
    },
  },
  
  devServer: {
    port: 8848,
    host: '0.0.0.0'
  },
  
  modules: [
    '@pinia/nuxt',
    '@nuxtjs/color-mode'
  ],
  
  css: [
    '~/assets/iconfont/iconfont.css',
    '~/styles/index.less',
  ],

  typescript: {    
    strict: true,
    typeCheck: false
  },
  
  vite: {
    css: {
      preprocessorOptions: {
        less: {
          javascriptEnabled: true
        }
      }
    }
  },
  
  app: {
    head: {
      htmlAttrs: {
        lang: 'zh-CN'
      },
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width,initial-scale=1.0,minimum-scale=1.0,maximum-scale=1.0,user-scalable=no' },
        { name: 'theme-color', content: '#1890FF' },
        { name: 'description', content: '波仔椿,UI设计师,AIGC方向,专注于用户体验设计。提供专业的色彩库、应用库和作品集,致力于创造"看不见的优秀设计!"' },
        { name: 'keywords', content: 'UI设计师,UX设计师,AIGC,大模型,用户体验设计,色彩库,应用库,作品集' },
        { name: 'robots', content: 'all' },
        { name: 'author', content: '波仔椿、bozaichun' },
        { name: 'revisit-after', content: '7 days' },
        { name: 'renderer', content: 'webkit' },
        { 'http-equiv': 'X-UA-Compatible', content: 'IE=Edge,chrome=1' },
        { name: 'Content-Language', content: 'zh-CN' }
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
        { rel: 'canonical', href: 'https://chenchunbo.inscode.cc' }
      ],
      title: siteConfig.siteName,
      titleTemplate: (titleChunk) => {
        if (titleChunk === siteConfig.siteName) {
          return siteConfig.siteName;
        }
        return `${siteConfig.siteName} ｜ ${titleChunk}`;
      }
    }
  },
  
  imports: {
    dirs: ['utils']
  },
  
  components: [
    { path: '~/components', pathPrefix: false }
  ],
  
  pages: true,

  hooks: {
    'pages:extend'(pages) {
      // 确保 openDetail 详情页路由被正确注册
      const hasOpenDetail = pages.some((p) => p.path === '/ResourceLibrary/openDetail');
      if (!hasOpenDetail) {
        pages.push({
          name: 'ResourceLibrary-openDetail',
          path: '/ResourceLibrary/openDetail',
          file: '~/pages/ResourceLibrary/openDetail/index.vue',
        });
      }
    },
  },
})
