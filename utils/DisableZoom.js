// 禁用页面缩放功能
(function() {
  // 1. 禁用 Ctrl+鼠标滚轮缩放
  const disableZoomByScroll = (e) => {
    if ((e.ctrlKey || e.metaKey) && (e.deltaY !== 0)) {
      e.preventDefault();
      e.stopPropagation();
      return false;
    }
  };

  // 2. 禁用缩放快捷键 (Ctrl+/-, Ctrl+0)
  const disableZoomByKeyboard = (e) => {
    // 禁用 Ctrl+加号/等号
    if ((e.ctrlKey || e.metaKey) && (e.key === '+' || e.key === '=')) {
      e.preventDefault();
      e.stopPropagation();
      return false;
    }
    
    // 禁用 Ctrl+减号/下划线
    if ((e.ctrlKey || e.metaKey) && (e.key === '-' || e.key === '_')) {
      e.preventDefault();
      e.stopPropagation();
      return false;
    }
    
    // 禁用 Ctrl+0 重置缩放
    if ((e.ctrlKey || e.metaKey) && e.key === '0') {
      e.preventDefault();
      e.stopPropagation();
      return false;
    }
  };

  // 3. 禁用触摸设备的双指缩放
  const disableTouchZoom = (e) => {
    if (e.touches.length > 1) {
      e.preventDefault();
      e.stopPropagation();
      return false;
    }
  };

  // 4. 添加页面元标签防止缩放（需要在HTML中设置，但也可以通过JS动态添加）
  const addMetaTag = () => {
    // 检查是否已经存在视口元标签
    let metaTag = document.querySelector('meta[name="viewport"]');
    
    if (metaTag) {
      // 更新现有元标签
      metaTag.setAttribute('content', 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no');
    } else {
      // 创建新的元标签
      metaTag = document.createElement('meta');
      metaTag.name = 'viewport';
      metaTag.content = 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no';
      document.head.appendChild(metaTag);
    }
  };

  // 初始化所有禁用缩放功能
  const initDisableZoom = () => {
    // 在捕获阶段监听事件，确保优先捕获
    window.addEventListener('wheel', disableZoomByScroll, { passive: false, capture: true });
    window.addEventListener('keydown', disableZoomByKeyboard, { passive: false, capture: true });
    window.addEventListener('touchstart', disableTouchZoom, { passive: false, capture: true });
    window.addEventListener('touchmove', disableTouchZoom, { passive: false, capture: true });
    
    // 添加元标签
    addMetaTag();
  };

  // 页面加载完成后初始化
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initDisableZoom);
  } else {
    initDisableZoom();
  }
})();