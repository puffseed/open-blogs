/**
 * 收藏功能工具函数
 */

// 收藏应用的本地存储键名
const FAVORITE_KEY = 'app_store_favorites';

/**
 * 获取所有收藏的应用
 * @returns 收藏的应用ID数组
 */
export function getFavorites(): string[] {
  try {
    const favorites = localStorage.getItem(FAVORITE_KEY);
    return favorites ? JSON.parse(favorites) : [];
  } catch (error) {
    console.error('获取收藏失败:', error);
    return [];
  }
}

/**
 * 添加应用到收藏
 * @param appId 应用ID
 */
export function addFavorite(appId: string): void {
  try {
    const favorites = getFavorites();
    if (!favorites.includes(appId)) {
      favorites.push(appId);
      localStorage.setItem(FAVORITE_KEY, JSON.stringify(favorites));
    }
  } catch (error) {
    console.error('添加收藏失败:', error);
  }
}

/**
 * 从收藏中移除应用
 * @param appId 应用ID
 */
export function removeFavorite(appId: string): void {
  try {
    const favorites = getFavorites();
    const updatedFavorites = favorites.filter(id => id !== appId);
    localStorage.setItem(FAVORITE_KEY, JSON.stringify(updatedFavorites));
  } catch (error) {
    console.error('移除收藏失败:', error);
  }
}

/**
 * 检查应用是否已收藏
 * @param appId 应用ID
 * @returns 是否已收藏
 */
export function isFavorite(appId: string): boolean {
  try {
    const favorites = getFavorites();
    return favorites.includes(appId);
  } catch (error) {
    console.error('检查收藏失败:', error);
    return false;
  }
}

/**
 * 切换应用的收藏状态
 * @param appId 应用ID
 * @returns 切换后的收藏状态
 */
export function toggleFavorite(appId: string): boolean {
  if (isFavorite(appId)) {
    removeFavorite(appId);
    return false;
  } else {
    addFavorite(appId);
    return true;
  }
}
