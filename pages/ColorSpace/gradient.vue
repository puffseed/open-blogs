<script setup lang="ts">
import { ref, onMounted } from "vue";

useHead({
  title: "渐变色",
});
import SystemCopy from "~/components/Systems/SystemCopy.vue";
import CardLayout from "~/components/Cards/CardLayout.vue";

interface GradientItem {
  name: string;
  code: string;
  fullCode: string;
  color: string;
}

const colors = ref<GradientItem[]>([]);

const processColorsData = (data: any[]) => {
  colors.value = data.map((item) => {
    const gradientValue = item.code.replace("background: ", "");
    return {
      name: item.name,
      code: gradientValue,
      fullCode: item.code,
      color: item.color,
    };
  });
};

onMounted(async () => {
  const data = await import("~/json/ColorSpace/gradient.json");
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
<!-- 渐变色 -->
<template>
  <div class="gradient">
    <CardLayout :largeCols="4" :webCols="3" :tabletCols="2" gap="1.5rem">
      <div class="card" v-for="item in colors" :key="item.name">
        <p class="title hand" @click="copyToClipboard(item.name)">
          {{ item.name }}
        </p>
        <div class="box" :style="{ background: item.code }"></div>
        <div class="name">
          <p>{{ item.color }}</p>
          <div class="open-btn hand" @click="copyToClipboard(item.fullCode)">
            <i class="iconfont icon-rgb"></i>
          </div>
        </div>
      </div>
    </CardLayout>
    <SystemCopy v-if="showCopy" :content="copyContent" :message="'复制成功'" />
  </div>
</template>

<style scoped lang="less">
.gradient {
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
