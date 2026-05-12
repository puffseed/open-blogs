<script setup lang="ts">
import { ref, onMounted, onUnmounted, nextTick } from "vue";

const showWelcome = ref(true);

/**
 * 组件挂载后，3秒后自动隐藏欢迎页
 */
onMounted(() => {
  nextTick(() => {
    setTimeout(() => {
      showWelcome.value = false;
    }, 3000);
  });
});
</script>

<template>
  <div v-if="showWelcome" class="welcome-container">
    <div class="welcome-content">
      <div class="logo-animation">
        <span class="char">波</span>
        <span class="char">仔</span>
        <span class="char">椿</span>
      </div>
      <p class="brand-name">BOZAICHUN</p>
    </div>
  </div>
</template>

<style scoped lang="less">
.welcome-container {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #000000;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10000;
  animation: fadeOut 0.5s ease-out 2.5s forwards;

  @keyframes fadeOut {
    to {
      opacity: 0;
      visibility: hidden;
    }
  }

  .welcome-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--size-12);
    // 文字动画
    .logo-animation {
      display: flex;
      gap: var(--size-20);
      font-weight: bold;
      color: #e6e6e6;

      .char {
        font-size: 66px;
        opacity: 0;
        animation: writeChar 2s ease-out forwards;

        &:nth-child(1) {
          animation-delay: 0.2s;
        }
        &:nth-child(2) {
          animation-delay: 0.8s;
        }
        &:nth-child(3) {
          animation-delay: 1.4s;
        }
      }
    }
    // 英文字母
    .brand-name {
      font-size: var(--size-24);
      font-weight: bold;
      color: var(--mainText);
      letter-spacing: 8px;
      margin: 0;
      text-transform: uppercase;
      opacity: 0;
      animation: fadeIn 0.5s ease-out 2s forwards;
    }
  }
}

@keyframes writeChar {
  0% {
    opacity: 0;
    transform: scale(0.5) rotate(-10deg);
  }
  50% {
    opacity: 1;
    transform: scale(1.1) rotate(2deg);
  }
  100% {
    opacity: 1;
    transform: scale(1) rotate(0deg);
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
