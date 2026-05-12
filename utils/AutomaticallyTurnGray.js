// 网站自动变灰功能 - 纪念特殊日期
(function () {
  // 获取当前日期
  var myDate = new Date();
  var mon = myDate.getMonth() + 1; // 月份从0开始，需要+1
  var date = myDate.getDate();

  // 需要变灰的日期列表，包含日期和对应的提示文字
  var memorialDays = [
    { date: "5.12", text: "汶川地震全民默哀日" },
    { date: "7.7", text: "七七事变纪念日" },
    { date: "9.9", text: "毛主席逝世纪念日" },
    { date: "9.18", text: "九一八事变纪念日" },
    { date: "12.13", text: "南京大屠杀死难者国家公祭日" },
    // { date: "2.27", text: "测试变灰" },
  ];

  // 遍历日期列表，检查是否为特殊日期
  for (var memorialDay of memorialDays) {
    var d = memorialDay.date.split(".");
    if (mon == d[0] && date == d[1]) {
      // 创建并注入样式
      var style = document.createElement("style");
      style.innerHTML = `
        html {
          -webkit-filter: grayscale(100%);
          -moz-filter: grayscale(100%);
          -ms-filter: grayscale(100%);
          -o-filter: grayscale(100%);
          filter: grayscale(100%);
          filter: progid:DXImageTransform.Microsoft.BasicImage(grayscale=1);
        }
      `;
      document.head.appendChild(style);

      // 显示纪念提示（使用原生JavaScript，避免依赖jQuery和iziToast）
      // 创建提示元素
      var memorialNotice = document.createElement("div");
      memorialNotice.style.cssText = `
        position: fixed;
        top: 20px;
        left: 50%;
        transform: translateX(-50%);
        background-color: rgba(0, 0, 0, 0.8);
        color: white;
        padding: 10px 20px;
        border-radius: 5px;
        font-size: 14px;
        z-index: 9999;
        text-align: center;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
        animation: fadeInOut 14s ease-in-out forwards;
      `;
      memorialNotice.textContent =
        "今天是" + memorialDay.text + "，全站已切换为黑白模式";

      // 添加淡入淡出动画
      var animationStyle = document.createElement("style");
      animationStyle.innerHTML = `
        @keyframes fadeInOut {
          0% { opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { opacity: 0; visibility: hidden; }
        }
      `;
      document.head.appendChild(animationStyle);

      // 将提示添加到页面
      document.body.appendChild(memorialNotice);

      // 14秒后移除提示
      setTimeout(function () {
        if (memorialNotice.parentNode) {
          memorialNotice.parentNode.removeChild(memorialNotice);
        }
        if (animationStyle.parentNode) {
          animationStyle.parentNode.removeChild(animationStyle);
        }
      }, 10000);

      break; // 找到匹配的日期后跳出循环
    }
  }
})();
