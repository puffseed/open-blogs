<script setup lang="ts">
/**
 * Excel (.xlsx) 表格预览组件
 * 使用 SheetJS (xlsx) 在浏览器中解析并渲染为 HTML 表格，便于项目内复用。
 *
 * 使用示例：
 * 1. 通过文档接口 URL 预览（推荐）：
 *    <XlsxPreview src="/api/document?path=documents/Excel/考勤表.xlsx" height="calc(100vh - 100px)" />
 * 2. 通过 id 查询文档：
 *    <XlsxPreview src="/api/document?id=xxx" height="400px" />
 * 3. 仅指定高度，使用默认 100%：
 *    <XlsxPreview src="/api/document?path=documents/Excel/示例.xlsx" />
 */
import { ref, watch, onMounted } from "vue";

const props = withDefaults(
  defineProps<{
    /** 表格文件地址（如 /api/document?path=... 或 /api/document?id=...） */
    src: string;
    /** 容器高度，默认 100% */
    height?: string;
  }>(),
  { height: "100%" }
);

const html = ref("");
const loading = ref(true);
const error = ref("");

async function load() {
  if (!props.src) {
    html.value = "";
    loading.value = false;
    error.value = "暂无预览地址";
    return;
  }
  loading.value = true;
  error.value = "";
  html.value = "";
  try {
    const res = await fetch(props.src, { cache: "no-store" });
    if (!res.ok) {
      error.value = "加载表格失败";
      return;
    }
    const arrayBuffer = await res.arrayBuffer();
    const XLSX = await import("xlsx");
    const workbook = XLSX.read(arrayBuffer, { type: "array" });
    const firstSheetName = workbook.SheetNames[0];
    if (!firstSheetName) {
      error.value = "表格无工作表";
      return;
    }
    const sheet = workbook.Sheets[firstSheetName];
    const tableHtml = XLSX.utils.sheet_to_html(sheet, { id: "xlsx-table", editable: false });
    html.value = tableHtml;
  } catch (e) {
    error.value = "解析表格失败";
    console.warn("XlsxPreview load error:", e);
  } finally {
    loading.value = false;
  }
}

onMounted(load);
watch(() => props.src, load);
</script>

<template>
  <div class="xlsx-preview" :style="{ height }">
    <div v-if="loading" class="xlsx-preview-loading">加载中...</div>
    <p v-else-if="error" class="xlsx-preview-error">{{ error }}</p>
    <div v-else class="xlsx-preview-wrap" v-html="html" />
  </div>
</template>

<style scoped lang="less">
.xlsx-preview {
  width: 100%;
  min-height: 200px;
  background: var(--background, #fff);
  overflow: auto;

  .xlsx-preview-loading,
  .xlsx-preview-error {
    padding: var(--size-40, 24px);
    text-align: center;
    color: var(--secondaryText, #666);
    font-size: var(--fs-14, 14px);
  }

  .xlsx-preview-wrap {
    overflow: auto;
    padding: var(--size-12, 12px);

    :deep(table) {
      border-collapse: collapse;
      width: 100%;
      font-size: var(--fs-14, 14px);

      th,
      td {
        border: 1px solid var(--borderColor, #e8e8e8);
        padding: 8px 12px;
        text-align: left;
      }

      th {
        background: var(--tableHeaderBg, #fafafa);
        font-weight: 600;
      }

      tr:nth-child(even) {
        background: var(--tableStripeBg, #f9f9f9);
      }
    }
  }
}
</style>
