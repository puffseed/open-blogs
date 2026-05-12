<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";
import { userInfoConfig } from "@/config/pageConfig";

// 设计师箴言（来自配置）
const proverbs = [...userInfoConfig.proverbs];

// 当前显示的箴言索引
const currentIndex = ref(0);
// 当前显示的文本（打字机效果）
const displayText = ref("");
// 当前打字位置
const typingPosition = ref(0);
// 状态：0=打字中，1=暂停，2=删除中
const state = ref(0);
// 定时器ID
let timer: ReturnType<typeof setTimeout> | null = null;

// 打字机效果
const typeWriter = () => {
  switch (state.value) {
    case 0: // 打字中
      if (typingPosition.value < proverbs[currentIndex.value].length) {
        // 增加一个字符
        displayText.value = proverbs[currentIndex.value].substring(0, typingPosition.value + 1);
        typingPosition.value++;
        timer = setTimeout(typeWriter, 200); // 打字速度
      } else {
        // 打字完成，进入暂停状态
        state.value = 1;
        timer = setTimeout(typeWriter, 3000); // 暂停时间
      }
      break;
    case 1: // 暂停中
      // 暂停结束，进入删除状态
      state.value = 2;
      timer = setTimeout(typeWriter, 500); // 准备删除
      break;
    case 2: // 删除中
      if (typingPosition.value > 0) {
        // 删除一个字符
        displayText.value = proverbs[currentIndex.value].substring(0, typingPosition.value - 1);
        typingPosition.value--;
        timer = setTimeout(typeWriter, 50); // 删除速度
      } else {
        // 删除完成，切换到下一个箴言
        currentIndex.value = (currentIndex.value + 1) % proverbs.length;
        state.value = 0;
        timer = setTimeout(typeWriter, 500); // 准备下一个
      }
      break;
  }
};

// 组件挂载时启动打字机效果
onMounted(() => {
  typeWriter();
});

// 组件销毁时清除定时器
onUnmounted(() => {
  if (timer) {
    clearTimeout(timer);
  }
});
</script>
<!-- 个人信息栏 -->
<template>
  <div class="information-bar">
    <div class="avatar-container">
      <div class="top">
        <div class="image-box">
          <img class="avatar-image" src="/assets/images/Avatar.jpg" alt="" />
        </div>

        <div class="icon-container">
          <i class="icon iconfont icon-Male"></i>
        </div>
      </div>
      <!-- <p class="ip-name">{{ userInfoConfig.name }}</p> -->
    </div>

    <div class="container">
      <p class="proverb">{{ displayText }}</p>
      <div class="texts">
        <p v-for="(info, idx) in userInfoConfig.infoItems" :key="idx" class="item">
          <i class="icon iconfont" :class="info.icon"></i>{{ info.text }}
        </p>
      </div>
    </div>
  </div>
</template>
<style scoped lang="less">
.information-bar {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.6rem;

  //头像
  .avatar-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-top: var(--size-12);

    .top {
      width: 168px;
      height: 168px;
      border-radius: 50%;
      background-color: var(--border);
      position: relative;
      margin-bottom: var(--size-30);

      .image-box {
        .avatar-image {
          width: 100%;
          height: 100%;
          border-radius: 50%;
          position: relative;
        }
      }


      .icon-container {
        width: var(--size-30);
        height: var(--size-30);
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 50%;
        position: absolute;
        bottom: 0;
        right: var(--size-30);
        background-color: var(--primary);

        .icon {
          font-size: var(--fs-20);
          color: var(--white);
        }
      }
    }

    .ip-name {
      padding-top: 0.6rem;
      font-size: var(--fs-24);
      font-weight: bold;
      color: var(--title);
    }
  }

  //容器
  .container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 0.6rem;
    margin-bottom: var(--size-40);

    .texts {
      display: flex;
      align-items: center;
      justify-content: center;

      .item {
        display: flex;
        align-items: center;
        font-size: var(--fs-14);
        color: var(--title);
        padding: 0px 12px;
      }

      .icon {
        font-size: var(--fs-18);
        color: var(--text);
      }
    }

    .proverb {
      height: var(--size-40);
      line-height: var(--size-40);
      font-size: var(--fs-20);
      font-family: 'NanBeiCiGongPu';
      background: linear-gradient(244deg, #368bf9 0%, #4d6cf8 100%);
      -webkit-background-clip: text;
      background-clip: text;
      color: transparent;
      letter-spacing: 0.12em;
    }
  }
}
</style>
