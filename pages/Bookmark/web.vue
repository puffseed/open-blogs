<script setup lang="ts">
import SystemDataFiltering from "~/components/Systems/SystemDataFiltering.vue";
import CardLayout from "~/components/Cards/CardLayout.vue";
import CardBookmark from "~/components/Cards/CardBookmark.vue";
import type { BookmarkItem } from "~/types/bookmark";
import { ref, onMounted } from "vue";

useHead({
  title: "前端开发"
});

const selectedCategory = ref("全部");
const BookmarkData = ref<BookmarkItem[]>([]);
const filteredBookmark = ref<BookmarkItem[]>([]);

const handleFiltered = (data: BookmarkItem[]) => {
  filteredBookmark.value = data;
};

const openBookmark = (bookmark: BookmarkItem) => {
  window.open(bookmark.url, "_blank");
};

onMounted(async () => {
  const data = await import("~/json/Bookmark/web.json");
  BookmarkData.value = data.default;
  filteredBookmark.value = data.default;
});
</script>
<!-- 设计师书签集 -->
<template>
  <div class="Bookmark-collection-box">
    <SystemDataFiltering
      v-model="selectedCategory"
      :data="BookmarkData"
      categoryField="type"
      @filtered="handleFiltered"
    />
    <CardLayout :largeCols="4" :webCols="3" :tabletCols="2" gap="1.5rem">
      <CardBookmark
        v-for="(item, index) in filteredBookmark"
        :key="item.url + '-' + index"
        :item="item"
        @click="openBookmark"
      />
    </CardLayout>
  </div>
</template>

<style scoped lang="less">
.Bookmark-collection-box {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;
}
</style>
