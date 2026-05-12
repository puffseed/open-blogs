export default defineNuxtPlugin(() => {
  if (process.client) {
    // 在页面渲染前立即应用主题，避免闪烁
    const savedMode = localStorage.getItem("themeMode");
    
    if (savedMode) {
      applyThemeImmediately(savedMode);
    } else {
      // 默认使用自适应模式
      applyAutoThemeImmediately();
    }
  }
});

/**
 * 立即应用主题（不依赖组件挂载）
 * @param mode 主题模式：auto, light, dark
 */
function applyThemeImmediately(mode: string) {
  if (mode === "auto") {
    applyAutoThemeImmediately();
  } else if (mode === "light") {
    document.documentElement.removeAttribute("data-theme");
  } else if (mode === "dark") {
    document.documentElement.setAttribute("data-theme", "dark");
  }
}

/**
 * 立即应用自适应主题（根据时间判断）
 */
function applyAutoThemeImmediately() {
  const now = new Date();
  const hour = now.getHours();
  const isDaytime = hour >= 6 && hour < 18;
  
  if (isDaytime) {
    document.documentElement.removeAttribute("data-theme");
  } else {
    document.documentElement.setAttribute("data-theme", "dark");
  }
}
