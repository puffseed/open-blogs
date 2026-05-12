// 网站防扒功能 - 打造网站最安全防线
(function() {
  // 检测是否为爬虫或自动化工具
  const isBot = () => {
    // 检测常见爬虫User-Agent
    const botKeywords = ['bot', 'crawler', 'spider', 'scrapy', 'python-requests', 'curl', 'wget', 'httpie'];
    const userAgent = navigator.userAgent.toLowerCase();
    return botKeywords.some(keyword => userAgent.includes(keyword));
  };

  // 1. 禁用右键菜单
  const disableRightClick = () => {
    document.addEventListener('contextmenu', (e) => {
      e.preventDefault();
      // 可选：显示提示信息
    //   alert('右键菜单已禁用');
    });
  };

  // 2. 禁用F12和开发工具快捷键
  const disableDevTools = () => {
    // 使用事件捕获阶段，在事件冒泡到目标元素之前拦截
    const handleKeyDown = (e) => {
      // 禁用F12
      if (e.key === 'F12') {
        e.preventDefault();
        e.stopPropagation();
        return false;
      }
      
      // 禁用Ctrl+Shift+I、Ctrl+Shift+J、Ctrl+Shift+C
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'I' || e.key === 'J' || e.key === 'C')) {
        e.preventDefault();
        e.stopPropagation();
        return false;
      }
      
      // 禁用Ctrl+U查看源代码
      if ((e.ctrlKey || e.metaKey) && e.key === 'U') {
        e.preventDefault();
        e.stopPropagation();
        return false;
      }
      
      // 禁用Ctrl+Shift+K
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'K') {
        e.preventDefault();
        e.stopPropagation();
        return false;
      }
    };
    
    // 在window对象和document对象上同时监听，确保能捕获到事件
    window.addEventListener('keydown', handleKeyDown, true); // true表示使用捕获阶段
    document.addEventListener('keydown', handleKeyDown, true);
    
    // 同时监听keypress事件作为补充
    const handleKeyPress = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'u') {
        e.preventDefault();
        e.stopPropagation();
        return false;
      }
    };
    
    window.addEventListener('keypress', handleKeyPress, true);
    document.addEventListener('keypress', handleKeyPress, true);
  };

  // 3. 无限debugger断点（防止调试）
  const infiniteDebugger = () => {
    // 使用Function构造函数创建闭包，防止被简单的正则表达式检测到
    const antiDebug = new Function('debugger');
    setInterval(() => {
      antiDebug();
    }, 1000);
  };

  // 4. 检测开发者工具是否打开
  const detectDevTools = () => {
    let threshold = 160;
    
    // 创建一个不可见的元素，检测其尺寸变化
    const element = document.createElement('div');
    element.style.width = '100px';
    element.style.height = '100px';
    element.style.position = 'fixed';
    element.style.top = '-200px';
    element.style.left = '-200px';
    element.style.opacity = '0';
    element.style.zIndex = '-9999';
    element.style.overflow = 'scroll';
    element.style.visibility = 'hidden';
    
    document.body.appendChild(element);
    
    const checkDevTools = () => {
      const elementWidth = element.offsetWidth - element.clientWidth;
      const elementHeight = element.offsetHeight - element.clientHeight;
      
      if (elementWidth > threshold || elementHeight > threshold) {
        // 开发者工具已打开
        // 可选：执行一些操作，如重定向或显示警告
        // window.location.href = 'about:blank';
        // alert('检测到开发者工具，页面将关闭');
      }
    };
    
    setInterval(checkDevTools, 500);
  };

  // 5. 防止页面内容选择和复制
  const disableSelection = () => {
    document.addEventListener('selectstart', (e) => {
      e.preventDefault();
    });
    
    document.addEventListener('copy', (e) => {
      e.preventDefault();
    });
  };

  // 6. 防止iframe嵌套
  const preventFrame = () => {
    if (window.top !== window.self) {
      // 页面被嵌入iframe中
      window.top.location.href = window.self.location.href;
    }
  };

  // 7. 混淆JavaScript代码（简单版）
  const obfuscateCode = () => {
    // 这里可以添加更复杂的代码混淆逻辑
    // 简单示例：将一些关键变量名替换为随机字符串
    // 注意：过度混淆可能会影响性能和可维护性
  };

  // 初始化所有防扒功能
  const initAntiScraping = () => {
    // 检测到爬虫时执行的操作
    if (isBot()) {
      // 可选：重定向到其他页面
      // window.location.href = 'about:blank';
      // 或显示警告
      // alert('检测到自动化工具访问');
    }
    
    // 启用所有防扒功能
    disableRightClick();
    disableDevTools();
    infiniteDebugger();
    detectDevTools();
    disableSelection();
    preventFrame();
    obfuscateCode();
  };

  // 页面加载完成后初始化
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAntiScraping);
  } else {
    initAntiScraping();
  }
})();

