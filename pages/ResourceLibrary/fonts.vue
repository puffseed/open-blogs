<script setup lang="ts">
import SystemDataFiltering from "~/components/Systems/SystemDataFiltering.vue";

import CardLayout from "~/components/Cards/CardLayout.vue";
import { ref, onMounted } from "vue";

useHead({
  title: "商用字体",
});

// 当前选中的分类
const selectedCategory = ref("全部");

// 复制提示组件状态

// 字体数据
const fonts = ref<any[]>([]);

// 筛选后的字体数据
const filteredFonts = ref<any[]>([]);

// 处理筛选后的数据
const handleFiltered = (data: any[]) => {
  filteredFonts.value = data;
};

interface FontItem {
  name: string;
  type: string;
  format?: string;
}

// 下载中状态，防止重复点击
const downloading = ref(false);

// 下载字体文件功能：通过服务端接口获取文件并触发下载
const downloadFont = async (font: FontItem) => {
  if (downloading.value) return;
  const format = font.format || ".ttf";
  const ext = format.startsWith(".") ? format.substring(1) : format;
  const filename = `${font.name}.${ext}`;

  try {
    downloading.value = true;
    const params = new URLSearchParams({
      type: font.type,
      name: font.name,
      format: format,
    });
    const res = await fetch(`/api/download-font?${params}`);

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      const msg = data?.error || res.statusText;
      if (res.status === 404) {
        alert(`字体文件暂未提供直接下载，请通过公众号回复「${font.name}」领取`);
      } else {
        alert(msg || "下载失败，请稍后重试");
      }
      return;
    }

    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "网络异常";
    console.error("下载字体失败:", msg);
    alert(`下载失败，请检查网络后重试。也可通过公众号回复「${font.name}」领取`);
  } finally {
    downloading.value = false;
  }
};

onMounted(async () => {
  const data = await import("~/json/ResourceLibrary/fonts.json");
  fonts.value = data.default;
  filteredFonts.value = data.default;
});
</script>
<!-- 商用字体 -->
<template>
  <div class="commercial-font-library">
    <!-- 复制成功提示 -->

    <!-- 数据筛选 -->
    <SystemDataFiltering
      v-model="selectedCategory"
      :data="fonts"
      categoryField="type"
      @filtered="handleFiltered"
    />
    <!-- 字体卡片容器 -->
    <CardLayout
      :largeCols="4"
      :webCols="3"
      :tabletCols="2"
      :mobileCols="1"
      gap="1.5rem"
    >
      <div
        v-for="(item, index) in filteredFonts"
        :key="index"
        class="card hand"
      >
        <div class="top">
          <p class="font-title" :style="{ fontFamily: item.fontFamily }">
            {{ item.name }}
          </p>
          <div class="download-btn-container">
            <!-- 下载 -->
            <i
              class="download-btn iconfont icon-Download"
              :class="{ 'is-loading': downloading }"
              :title="downloading ? '下载中…' : '下载字体'"
              @click="downloadFont(item)"
            ></i>
          </div>

          <div class="font-reply">
            <i>公众号回复「</i>
            <i style="font-weight: bold">{{ item.name }}</i>
            <i>」领取</i>
          </div>
        </div>
        <div class="bottom">
          <p class="tag">可商用</p>
          <p class="font-name">{{ item.name }}</p>
        </div>
      </div>
    </CardLayout>
  </div>
</template>
<style scoped lang="less">
.commercial-font-library {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;

  .card {
    padding: var(--size-12);
    background: var(--background);
    border-radius: var(--size-12);
    width: 100%;
    border: 1px solid var(--border);

    .top {
      width: 100%;
      height: 120px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      background-color: var(--info-bg);
      border: 1px solid var(--border);
      border-radius: var(--size-6);
      position: relative;

      .font-title {
        font-size: var(--fs-24);
        color: var(--font-color);
      }

      .font-reply {
        display: none;
        position: absolute;
        bottom: 0.6rem;
        font-size: var(--fs-12);
        font-weight: bold;
        color: var(--primary);
      }

      .download-btn-container {
        position: absolute;
        top: 0.6rem;
        right: 0.6rem;
        font-size: var(--fs-16);
        font-weight: bold;
        color: var(--secondaryText);

        .download-btn {
          width: var(--size-20);
          height: var(--size-20);
          padding: 2px;
          border-radius: var(--size-4);
          margin-left: var(--size-6);
        }

        .download-btn:hover {
          color: var(--primary);
          background-color: var(--white);
        }

        .download-btn.is-loading {
          opacity: 0.6;
          pointer-events: none;
        }
      }
    }

    .top:hover {
      background-color: var(--hover);

      .font-reply {
        display: block;
      }
    }

    .bottom {
      margin-top: var(--size-12);
      display: flex;
      align-items: center;
      justify-content: space-between;

      .tag {
        font-size: var(--fs-12);
        color: var(--secondaryText);
        padding: 2px 12px;
        border-radius: var(--size-20);
        background-color: var(--background);
      }

      .font-name {
        font-size: 14px;
        color: var(--mainText);
      }
    }
  }

  .card:hover {
    box-shadow: 0 0 12px rgba(0, 0, 0, 0.1);
  }
}
</style>
