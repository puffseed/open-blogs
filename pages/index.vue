<script setup lang="ts">
import InformationBar from "./Home/InformationBar.vue";
import Footer from "~/layouts/Footer/index.vue";
import CardLayout from "~/components/Cards/CardLayout.vue";
import SystemVerticalAnchor from "~/components/Systems/SystemVerticalAnchor.vue";
import { ref, computed } from "vue";
import img1 from "~/assets/images/secaiku.png";
import img2 from "~/assets/images/ziyuanku.png";
import img3 from "~/assets/images/wangzhiku.png";
import img4 from "~/assets/images/yingyongku.png";
import img5 from "~/assets/images/wodezuopin.png";
import CsdnRSS from "./Home/CsdnRSS.vue";
import MasterSkills from "./Home/MasterSkills.vue";
import { homeMenuConfig, siteConfig } from "@/config/pageConfig";

interface MenuItem {
  name: string;
  path: string;
  icon: string;
  isDisabled?: boolean;
  message?: string;
  isNew?: boolean;
}

const iconMap: Record<string, string> = {
  secaiku: img1,
  ziyuanku: img2,
  wangzhiku: img3,
  yingyongku: img4,
  wodezuopin: img5,
};

const menuItems = computed<MenuItem[]>(() =>
  homeMenuConfig.map((item) => ({
    ...item,
    icon: iconMap[item.iconKey] || img5,
  }))
);

const showPopup = ref(false);
const popupMessage = ref("");

const handleMenuClick = (item: MenuItem) => {
  if (item.isDisabled) {
    popupMessage.value = item.message ?? "";
    showPopup.value = true;
    setTimeout(() => {
      showPopup.value = false;
    }, 3000);
  }
};

useHead({
  title: siteConfig.siteName,
  meta: [
    {
      name: "description",
      content: "波仔椿,资深UX/UI设计师,专注于用户体验设计。提供专业的色彩库、应用库和作品集,致力于创造'看不见的优秀设计!'",
    },
  ],
});
</script>
<!-- 首页 -->
<template>
  <div class="home">
    <section class="content">
      <InformationBar />
      <CardLayout :largeCols="6" :webCols="4" :tabletCols="3" :mobileCols="2" gap="1.5rem">
        <template v-for="item in menuItems" :key="item.path">
          <!-- 禁用状态 -->
          <div v-if="item.isDisabled" :style="{
            backgroundImage: `url(${item.icon})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
          }" class="btn hand" @click="handleMenuClick(item)">
            <p class="btn-text">{{ item.name }}</p>
          </div>
          <!-- 正常状态 -->
          <div v-else class="btn-wrapper">
            <NuxtLink :to="item.path" :style="{
              backgroundImage: `url(${item.icon})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat',
            }" class="btn">
              <p class="btn-text">{{ item.name }}</p>
            </NuxtLink>
            <!-- 上新角标（参考 system-table 的 MarkBox/insideBox） -->
            <div v-if="item.isNew" class="corner-badge-MarkBox">
              <div class="corner-badge-insideBox">上新</div>
            </div>
          </div>
        </template>
      </CardLayout>
      <!-- 指引图标 -->
      <i class="iconfont icon-BackTop bounce" style="margin-bottom: var(--size-32);"></i>
    </section>

    <div v-if="showPopup" class="popup-tip">
      <p>{{ popupMessage }}</p>
    </div>
    <!-- 掌握技能 -->
    <section id="anchor-0">
      <ModuleTitle title="掌握技能" />
      <MasterSkills />
    </section>
    <!-- 博客订阅 -->
    <section id="anchor-1">
      <ModuleTitle title="博客订阅" />
      <CsdnRSS />
    </section>

    <!-- 垂直锚点 -->
    <SystemVerticalAnchor class="home-vertical-anchor" :anchor-ids="['anchor-0', 'anchor-1']" />
  </div>
  <Footer />
</template>

<style scoped lang="less">
.home {
  width: 100%;
  padding-top: var(--size-24);
  position: relative;

  .home-vertical-anchor {
    position: fixed;
    right: var(--size-20);
    top: 50%;
    transform: translateY(-50%);
    z-index: 100;
  }

  .bounce {
    margin-top: var(--size-12);
    font-size: var(--size-32);
    color: var(--primary);
    animation: bounce 2s infinite;
  }

  .content {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;

    .btn-wrapper {
      position: relative;
      width: 100%;
      aspect-ratio: 1 / 1;
      max-width: 240px;
      overflow: visible;
    }

    /* 角标：与 system-table 的 MarkBox/insideBox 保持一致 */
    .corner-badge-MarkBox {
      width: 106px;
      height: 108px;
      overflow: hidden;
      position: absolute;
      top: calc(var(--size-6) * -1);
      right: calc(var(--size-6) * -1);
      z-index: 2;
      pointer-events: none;
    }

    .corner-badge-insideBox {
      line-height: 18px;
      text-align: center;
      transform: rotate(45deg);
      position: relative;
      padding: var(--size-8) 0;
      left: calc(var(--size-8) * -1);
      top: 25px;
      width: 150px;
      background: var(--error);
      color: var(--white);
      box-shadow: 0 5px 5px rgba(0, 0, 0, 0.3);
      letter-spacing: 1px;
      font-size: var(--fs-14);
      font-weight: 600;
    }

    .corner-badge-insideBox::before,
    .corner-badge-insideBox::after {
      content: '';
      border-top: var(--size-4) solid #b71c1c;
      border-left: var(--size-4) solid transparent;
      border-right: var(--size-4) solid transparent;
      position: absolute;
      bottom: calc(var(--size-4) * -1);
    }

    .corner-badge-insideBox::before {
      left: 0;
    }

    .corner-badge-insideBox::after {
      right: 0;
    }

    .btn {
      width: 100%;
      height: 100%;
      border-radius: var(--size-24);
      display: flex;
      justify-content: center;
      align-items: center;
      transition: all 0.3s ease-in-out;
      overflow: hidden;
      border: 0.3rem solid var(--white);

      &:hover {
        box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
        color: var(--primary);
        text-decoration: underline;
      }

      .btn-text {
        width: 100%;
        padding: var(--size-8) var(--size-12);
        background: rgba(255, 255, 255, 0.9);
        text-align: center;
        font-size: 1rem;
        font-weight: bold;
        color: #333333;
      }
    }
  }

  @media (max-width: 768px) {
    .corner-badge-MarkBox {
      width: 90px;
      height: 92px;
      top: calc(var(--size-4) * -1);
      right: calc(var(--size-4) * -1);
    }

    .corner-badge-insideBox {
      width: 130px;
      padding: var(--size-6) 0;
      top: var(--size-20);
      font-size: 11px;
    }
  }

  .popup-tip {
    position: fixed;
    top: 10%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: rgba(0, 0, 0, 0.8);
    color: var(--white);
    padding: 0.6rem 2rem;
    border-radius: var(--size-8);
    font-size: var(--fs-14);
    font-weight: bold;
    z-index: 9999;
    animation: fade 3s ease;
  }
}
</style>
