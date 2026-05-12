<script setup lang="ts">
import SystemDataFiltering from "~/components/Systems/SystemDataFiltering.vue";
import CardLayout from "~/components/Cards/CardLayout.vue";
import { ref, onMounted } from "vue";

useHead({
  title: "文档模板"
});
import { encodeCipher } from "@/utils/urlCipher";

// 当前选中的分类
const selectedCategory = ref("全部");

// 规范模板数据
const documentData = ref<any[]>([]);

// 筛选后的数据
const filteredSpecifications = ref<any[]>([]);

// 处理筛选后的数据
const handleFiltered = (data: any[]) => {
  filteredSpecifications.value = data;
};

interface SpecificationItem {
  id?: string;
  title: string;
  tag: string;
  cover: string;
  type: string;
  fileType: string;
  iconColor: string;
  documentPath: string;
}

// 使用模板：另开新窗口预览文档（使用 id 密文，不暴露真实路径和标题）
const useTemplate = (item: SpecificationItem) => {
  const params = new URLSearchParams();
  if (item.id) {
    params.set("id", item.id);
    // id 模式下不传 title，由 API 返回，URL 不暴露「需求文档」等
  } else {
    // 兼容无 id 的旧数据：对 path、title 做密文编码，避免「需求文档」等中文暴露于地址栏
    const path = item.documentPath?.replace(/^\.\//, "") || "markdowns/1.md";
    params.set("path", encodeCipher(path));
    if (item.title) params.set("title", encodeCipher(item.title));
  }
  const url = `/ResourceLibrary/openDetail?${params.toString()}`;
  window.open(url, "_blank");
};

onMounted(async () => {
  try {
    const data = await import("~/json/ResourceLibrary/document.json");
    documentData.value = Array.isArray(data.default) ? data.default : [];
    filteredSpecifications.value = documentData.value;
  } catch (error) {
    console.error("无法加载规范模板数据:", error);
    documentData.value = [];
    filteredSpecifications.value = [];
  }
});
</script>
<!-- 规范模板 -->
<template>
  <div class="specification-template-library">
    <!-- 数据筛选 -->
    <SystemDataFiltering v-model="selectedCategory" :data="documentData" categoryField="type"
      @filtered="handleFiltered" />
    <!-- 模板卡片容器 -->
    <CardLayout :largeCols="4" :webCols="3" :tabletCols="2" :mobileCols="1" gap="1.5rem">
      <div v-for="(item, index) in filteredSpecifications" :key="item.documentPath ?? item.title ?? index"
        class="card hand" @click="useTemplate(item)">
        <div class="top">
          <img :src="item.cover" :alt="item.title" />
          <p class="view-work">查看模板</p>
          <img class="file-type" :src="item.icon" :alt="item.fileType" />
        </div>
        <div class="bottom">
          <p class="tag">{{ item.tag }}</p>
          <p class="name">{{ item.title }}</p>
        </div>
      </div>
    </CardLayout>
  </div>
</template>
<style scoped lang="less">
.specification-template-library {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;

  .card {
    width: 100%;
    padding: var(--size-12);
    background: var(--background);
    border: 1px solid var(--border);
    border-radius: var(--size-12);
    cursor: pointer;

    .top {
      width: 100%;
      height: 120px;
      border-radius: var(--size-6);
      position: relative;
      overflow: hidden;
      position: relative;

      .file-type {
        width: 40px;
        height: 40px;
        position: absolute;
        top: 0;
        right: 0;
        padding: var(--size-6);
        border-radius:0 0 0 var(--size-12);
        background-color:var(--white);
      }

      .view-work {
        display: none;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        font-size: var(--fs-12);
        font-weight: bold;
        color: var(--white);
        padding: var(--size-4) var(--size-16);
        border-radius: 25px;
        background-color: var(--primary);
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
        z-index: 2;
      }

      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        border-radius: var(--size-6);
        transition: all 0.3s ease;
      }

      &::before {
        content: "";
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: rgba(0, 0, 0, 0.4);
        opacity: 0;
        transition: opacity 0.3s ease;
        z-index: 1;
      }
    }

    &:hover {
      box-shadow: 0 0 12px rgba(0, 0, 0, 0.1);

      .top {
        .view-work {
          display: block;
          animation: fadeIn 0.3s ease;
        }

        img {
          transform: scale(1.05);
        }

        &::before {
          opacity: 1;
        }
      }
    }

    @keyframes fadeIn {
      from {
        opacity: 0;
        transform: translate(-50%, -50%) scale(0.8);
      }

      to {
        opacity: 1;
        transform: translate(-50%, -50%) scale(1);
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

      .name {
        font-size: 14px;
        color: var(--mainText);
      }
    }
  }
}
</style>
