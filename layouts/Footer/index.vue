<script setup lang="ts">
import QRCode from "./QRCode.vue";
import TechnologyStack from "./TechnologyStack.vue";
import { useCounterStore } from "../../stores/counter";

const counterStore = useCounterStore();

const handleWechatClick = () => {
  counterStore.showWechatQRCodeModal();
};
</script>
<!-- 页脚：左-技术栈 | 中-二维码 | 右-占位 -->
<template>
  <div class="footer">
    <div class="footer-inner">
      <div class="footer-left">
        <TechnologyStack />
      </div>
      <div class="footer-center">
        <QRCode class="hand" @click="handleWechatClick()" />
      </div>
      <div class="footer-right">
        <p class="footer-collect-tip">
          防止下次找不到?按
          <i class="icon"> Ctrl</i>
          <span>+</span>
          <i class="icon"> D</i>
          收藏我吧~
        </p>
      </div>
    </div>
  </div>
</template>

<style scoped lang="less">
.footer {
  width: 100%;
  padding: 1rem 2rem;
  color: var(--title);
  background: var(--background);
}

.footer-inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1.5rem;
  max-width: 1200px;
  margin: 0 auto;

  .footer-left {
    flex: 1;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    min-width: 0;
  }

  .footer-center {
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .footer-right {
    flex: 1;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    min-width: 0;

    .footer-collect-tip {
      margin: 0;
      font-size: var(--fs-12);
      color: var(--mainText);

      .icon {
        font-size: 14px;
        color: var(--white);
        background: linear-gradient(
          135deg,
          #fbbf24 0%,
          #f59e0b 25%,
          #ef4444 50%,
          #dc2626 75%,
          #fbbf24 100%
        );
        background-size: 200% 200%;
        animation: icon-gradient 4s ease infinite;
        padding: 0.2rem 0.5rem;
        border-radius: 0.25rem;
      }
    }

    @keyframes icon-gradient {
      0%,
      100% {
        background-position: 0% 50%;
      }
      50% {
        background-position: 100% 50%;
      }
    }
  }

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 1rem;
    .footer-left {
      order: 3;
      justify-content: center;
    }
    .footer-center {
      order: 1;
    }
    .footer-right {
      order: 2;
      justify-content: center;
    }
  }
}
</style>
