<script setup lang="ts">
import { ref, onMounted } from "vue";
import SystemCopy from "~/components/Systems/SystemCopy.vue";
import CardLayout from "~/components/Cards/CardLayout.vue";
useHead({
  title: "潘通色",
});
interface PanTongItem {
  name: string;
  hex: string;
  rgb: string;
  year: string;
}

const colors = ref<PanTongItem[]>([]);

const processColorsData = (data: any[]) => {
  colors.value = data.map((item) => ({
    name: item.name,
    hex: item.hex,
    rgb: item.rgb,
    year: item.year,
  }));
};

onMounted(async () => {
  const data = await import("~/json/ColorSpace/pantong.json");
  processColorsData(data.default);
});

const showCopy = ref(false);
const copyContent = ref("");

const copyToClipboard = async (color: string) => {
  try {
    await navigator.clipboard.writeText(color);
    copyContent.value = color;
    showCopy.value = true;
    setTimeout(() => {
      showCopy.value = false;
    }, 3000);
  } catch (err) {
    console.error("复制失败:", err);
  }
};
</script>
<!-- 潘通色 -->
<template>
  <div class="pantong">
    <CardLayout :largeCols="4" :webCols="3" :tabletCols="2" gap="1.5rem">
      <div class="card" v-for="item in colors" :key="item.name">
        <p class="title hand" @click="copyToClipboard(item.name)">
          {{ item.name }}
        </p>
        <div class="box" :style="{ background: item.hex }">
          <p class="year">{{ item.year }}</p>
        </div>
        <div class="name">
          <div class="color-left">
            <p>{{ item.hex }}</p>
            <div class="open-btn hand" @click="copyToClipboard(item.hex)">
              <i class="iconfont icon-hex"></i>
            </div>
          </div>
          <div class="color-right">
            <p>{{ item.rgb }}</p>
            <div class="open-btn hand" @click="copyToClipboard(item.rgb)">
              <i class="iconfont icon-rgb"></i>
            </div>
          </div>
        </div>
      </div>
    </CardLayout>
    <SystemCopy v-if="showCopy" :content="copyContent" :message="'复制成功'" />
  </div>
</template>

<style scoped lang="less">
.pantong {
  .card {
    padding: var(--size-12);
    background: var(--background);
    border-radius: var(--size-12);
    width: 100%;
    border: 1px solid var(--border);

    .title {
      font-size: 14px;
      font-weight: bold;
      margin-bottom: 0.8rem;
      width: 100%;
      text-align: center;
      color: var(--title);
    }

    .name {
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: space-between;
      color: var(--mainText);
      margin-top: var(--size-12);
      font-size: 14px;

      .color-left {
        display: flex;
        align-items: center;
        gap: var(--size-6);
      }

      .color-right {
        display: flex;
        align-items: center;
        gap: var(--size-6);
      }

      .open-btn {
        width: 24px;
        height: 24px;
        display: flex;
        align-items: center;
        justify-content: center;

        i {
          font-size: var(--fs-20);
        }

        &:hover {
          background-color: var(--primary);
          color: var(--white);
          border-radius: var(--size-6);
        }
      }
    }

    .box {
      width: 100%;
      height: 120px;
      border-radius: var(--size-6);
      display: flex;
      justify-content: center;
      align-items: center;
      color: var(--white);
      font-size: 14px;
      font-weight: bold;
      border: 0.5px solid var(--border);
      overflow: hidden;
      position: relative;

      .year {
        position: absolute;
        top: var(--size-8);
        left: var(--size-8);
        font-size: var(--fs-16);
        font-weight: bold;
        text-shadow: 0 0 4px rgba(0, 0, 0, 0.8);
        z-index: 2;
      }
    }

    &:hover {
      box-shadow: 0 0 12px rgba(0, 0, 0, 0.1);
    }
  }

  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: scale(0.8);
    }

    to {
      opacity: 1;
      transform: scale(1);
    }
  }
}
</style>
