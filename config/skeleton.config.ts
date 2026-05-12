/**
 * 骨架屏配置（分卡片型与列表型）
 * 仅下方指定路由会显示骨架屏，未配置的路由不显示
 */

/** 使用卡片型骨架屏的路由（如色彩库、字体库、作品集等卡片网格页） */
export const cardSkeletonRoutes: string[] = [
  "/ColorSpace/basic",
  "/ColorSpace/gradient",
  "/ColorSpace/pantong",
  "/ColorSpace/chinese",
  "/ColorSpace/colorMatching",
  "/ResourceLibrary/fonts",
  "/ResourceLibrary/document",
  "/WorkLibrary/MasterGo",
  "/WorkLibrary/Modao",
];

/** 使用列表型骨架屏的路由（如文档详情、列表详情等） */
export const listSkeletonRoutes: string[] = [
  "/ResourceLibrary/openDetail",
];

/** 所有需要显示骨架屏的路由（卡片 + 列表） */
export const skeletonRoutes: string[] = [
  ...cardSkeletonRoutes,
  ...listSkeletonRoutes,
];

/** 判断该路由是否显示骨架屏 */
export function shouldShowSkeleton(routePath: string): boolean {
  return skeletonRoutes.includes(routePath);
}

/** 判断该路由是否使用卡片型骨架屏 */
export function shouldShowCardSkeleton(routePath: string): boolean {
  return cardSkeletonRoutes.includes(routePath);
}

/** 判断该路由是否使用列表型骨架屏 */
export function shouldShowListSkeleton(routePath: string): boolean {
  return listSkeletonRoutes.includes(routePath);
}

/** 卡片骨架屏默认参数 */
export const cardSkeletonDefaults = {
  cardCount: 12,
} as const;

/** 列表骨架屏默认参数 */
export const listSkeletonDefaults = {
  lineCount: 12,
} as const;

/** @deprecated 兼容旧引用，请使用 cardSkeletonDefaults */
export const skeletonDefaults = cardSkeletonDefaults;
