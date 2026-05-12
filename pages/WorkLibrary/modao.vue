<script setup lang="ts">
import SystemDataFiltering from "~/components/Systems/SystemDataFiltering.vue";
import CardLayout from "~/components/Cards/CardLayout.vue";
import SystemNoData from "~/components/Systems/SystemNoData.vue";
import { ref, onMounted } from "vue";
useHead({
  title: "墨刀作品"
});
// 当前选中的分类
const selectedCategory = ref("全部");

// 作品数据（暂无墨刀数据时可置空，后续可接入 json）
const WorkLibraryData = ref<any[]>([]);

// 筛选后的作品数据
const filteredWorks = ref<any[]>([]);

// 处理筛选后的数据
const handleFiltered = (data: any[]) => {
  filteredWorks.value = data;
};

interface WorkItem {
  path: string;
  [key: string]: unknown;
}

const openWork = (work: WorkItem) => {
  window.open(work.path, "_blank");
};

onMounted(async () => {
  // 暂无墨刀作品数据，可后续接入：import("~/assets/json/WorkLibrary/modaoCommunity.json")
  WorkLibraryData.value = [];
  filteredWorks.value = [];
});
</script>
<!-- 墨刀 -->
<template>
  <div class="modaoWorks">
    <!-- 数据筛选 -->
    <SystemDataFiltering
      v-model="selectedCategory"
      :data="WorkLibraryData"
      categoryField="type"
      @filtered="handleFiltered"
    />
    <!-- 作品卡片容器 -->
    <CardLayout :largeCols="4" :webCols="3" :tabletCols="2" :mobileCols="1" gap="1.5rem">
      <template v-if="filteredWorks.length">
        <div
          v-for="(item, index) in filteredWorks"
          :key="item.path ?? item.name ?? index"
          class="card hand"
          @click="openWork(item)"
        >
          <div class="top">
            <img :src="item.cover" :alt="item.name" />
            <p class="view-work">查看作品</p>
          </div>
          <div class="bottom">
            <p class="tag">陈春波</p>
            <p class="name">{{ item.name }}</p>
          </div>
        </div>
      </template>
      <div v-else class="empty-wrap">
        <SystemNoData text="暂无作品，敬请期待" />
      </div>
    </CardLayout>
  </div>
</template>
<style scoped lang="less">
.modaoWorks {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;

  .empty-wrap {
    grid-column: 1 / -1;
  }

  .card {
    width: 100%;
    padding: var(--size-12);
    background-color: var(--white);
    border-radius: var(--size-12);
    cursor: pointer;

    .top {
      width: 100%;
      height: 120px;
      border-radius: var(--size-6);
      position: relative;
      overflow: hidden;

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
