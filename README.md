# 开源博客项目

## 项目简介

开源博客个人网站是一个基于 Vue 3 + Vite + TypeScript 构建的现代化个人作品集和资源分享平台，提供了色彩库、资源库、书签集等多种功能模块，支持响应式设计，适配桌面端和移动端。

## 技术栈

- **前端框架**：Vue 3.2.37（Composition API + `<script setup>`）
- **类型系统**：TypeScript 5.6
- **状态管理**：Pinia 3.0.4
- **路由管理**：Vue Router 4.6.4
- **构建工具**：Vite 5.0.1
- **CSS预处理器**：Less 4.5.1
- **样式管理**：CSS变量 + 响应式设计

## 项目架构

### 基础架构

项目采用 Vue 3 的 Composition API 与 `<script setup lang="ts">`，结合 Vite 与 TypeScript，实现模块化、类型安全的开发模式。主要架构如下：

```
src/
├── assets/         # 静态资源
├── components/     # 通用组件
├── json/           # 静态数据
├── layout/         # 布局组件
├── router/         # 路由配置（.ts）
├── stores/         # 状态管理（.ts）
├── utils/          # 工具脚本
├── views/          # 页面组件
├── App.vue         # 根组件
├── main.ts         # 入口文件
└── vite-env.d.ts   # 类型声明
```

### 核心模块

1. **布局模块** (`layout/`)：包含Header、Footer等公共布局组件
2. **路由模块** (`router/`)：采用模块化路由管理，按功能分类
3. **组件模块** (`components/`)：通用组件如BackTop、AnchorPoint等
4. **资源模块** (`assets/`)：包含图片、字体、样式等静态资源
5. **功能模块** (`views/`)：各页面功能实现

## 项目功能

### 主要功能模块

1. **首页** (`Home/`)
   - 个人信息展示
   - 功能模块导航
   - 响应式布局

2. **色彩库** (`ColorSpace/`)
   - 中国传统色彩
   - 渐变色方案
   - 潘通色彩库
   - 色彩搭配学习

3. **资源库** (`ResourceLibrary/`)
   - 文档库
   - 字体库
   - 素材库

4. **书签集** (`Bookmark/`)
   - AI相关资源
   - 设计师资源

5. **应用库** (`applicationCenter/`)
   - 实用工具集合

6. **作品集** (`WorkLibrary/`)
   - 个人项目展示

7. **时间胶囊** (`TimeMachine/`)
   - 时间记录功能

8. **微信公众号** (`WechatOfficialAccount/`)
   - 公众号信息展示

9. **关于** (`About/`)
   - 个人简介

10. **赞助** (`Sponsorship/`)
    - 支持作者方式

### 特色功能

1. **响应式设计**：适配桌面端、平板和移动端
2. **自动变灰**：在特殊纪念日自动切换为黑白模式
3. **网站防扒**：生产环境下启用反爬虫功能
4. **禁用缩放**：生产环境下禁用页面缩放
5. **动态导航**：移动端自适应导航菜单

## 项目结构

```
├── public/              # 公共资源
├── src/                 # 源代码
│   ├── assets/          # 静态资源
│   │   ├── bg/          # 背景图片
│   │   ├── font/         # 字体文件
│   │   ├── iconfont/     # 字体图标
│   │   ├── images/       # 图片资源
│   │   ├── js/           # 工具脚本
│   │   ├── style/        # 样式文件
│   │   ├── base.css      # 基础样式
│   │   └── main.css      # 主样式
│   ├── components/       # 通用组件
│   ├── json/             # 静态数据
│   ├── layout/           # 布局组件
│   │   ├── Footer/       # 页脚组件
│   │   ├── Header/       # 头部组件
│   │   └── MainContent/  # 主内容组件
│   ├── router/           # 路由配置（.ts）
│   │   ├── module/       # 路由模块
│   │   └── index.ts      # 路由入口
│   ├── stores/           # 状态管理（.ts）
│   ├── utils/            # 工具脚本
│   ├── views/            # 页面组件
│   ├── App.vue           # 根组件
│   ├── main.ts           # 入口文件
│   └── vite-env.d.ts     # 类型声明
├── .gitignore            # Git忽略文件
├── index.html            # HTML模板
├── package.json          # 项目配置
├── tsconfig.json         # TypeScript 配置
├── vite.config.ts        # Vite 配置
└── README.md             # 项目说明
```

## 启动项目

### 开发环境

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev
```

开发服务器启动后，可通过以下地址访问：
- 本地访问：http://localhost:5173/
- 网络访问：http://你的IP:5173/

### 生产环境

```bash
# 类型检查（可选）
npm run typecheck

# 构建项目
npm run build

# 预览构建结果
npm run preview
```

## 环境配置

### 系统要求

- Node.js 16.0+
- npm 7.0+

### 依赖管理

项目使用npm进行依赖管理，主要依赖包括：

- Vue 3.2.37
- Vue Router 4.6.4
- Pinia 3.0.4
- Vite 5.0.1
- TypeScript 5.6
- Less 4.5.1

## 项目特点

1. **现代化技术栈**：Vue 3 + Vite + TypeScript + Composition API（`<script setup lang="ts">`）
2. **类型安全**：全项目 TypeScript，路由、Store、组件均带类型定义与 `vue-tsc` 校验
3. **模块化设计**：清晰的目录结构和代码组织
4. **响应式布局**：适配各种设备屏幕
5. **性能优化**：Vite 构建，按需加载
6. **安全性**：生产环境下启用防扒功能
7. **可维护性**：组件化开发，代码复用率高

## 贡献指南

欢迎提交Issue和Pull Request来改进项目！

1. Fork本项目
2. 创建特性分支 (`git checkout -b feature/amazing-feature`)
3. 提交更改 (`git commit -m 'Add some amazing feature'`)
4. 推送到分支 (`git push origin feature/amazing-feature`)
5. 打开Pull Request

## 许可证

本项目采用MIT许可证，详见LICENSE文件。

## 联系方式

- 微信公众号：波仔椿
- 语雀：https://yuque.com/chenchunbo
- CSDN：https://chenchunbo.blog.csdn.net/
- GitHub：https://github.com/bozaichun

---

**波仔椿个人网站** © 2024 - 2026 | 保留所有权利
