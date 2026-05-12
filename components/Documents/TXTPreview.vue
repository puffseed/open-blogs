<script setup lang="ts">
/**
 * 纯文本 (.txt) 预览组件
 * 通过文档接口或 URL 拉取文本内容并展示，保留换行与空格。
 *
 * 使用示例：
 * 1. 通过文档接口 path 预览：
 *    <TXTPreview src="/api/document?path=documents/TXT/测试用例说明.txt" height="calc(100vh - 100px)" />
 * 2. 通过 id 查询文档：
 *    <TXTPreview src="/api/document?id=xxx" height="400px" />
 */
import { ref, watch, onMounted } from "vue";

const props = withDefaults(
  defineProps<{
    /** 文本文件地址（如 /api/document?path=... 或 /api/document?id=...） */
    src: string;
    /** 容器高度，默认 100% */
    height?: string;
  }>(),
  { height: "100%" }
);

const content = ref("");
const loading = ref(true);
const error = ref("");

async function load() {
  if (!props.src) {
    loading.value = false;
    error.value = "暂无预览地址";
    return;
  }
  loading.value = true;
  error.value = "";
  content.value = "";
  try {
    const res = await fetch(props.src, { cache: "no-store" });
    if (!res.ok) {
      error.value = "加载文本失败";
      return;
    }
    const text = await res.text();
    content.value = text;
  } catch (e) {
    error.value = "加载文本失败";
    console.warn("TXTPreview load error:", e);
  } finally {
    loading.value = false;
  }
}

onMounted(load);
watch(() => props.src, load);
</script>

<template>
  <div class="txt-preview" :style="{ height }">
    <div v-if="loading" class="txt-preview-loading">加载中...</div>
    <p v-else-if="error" class="txt-preview-error">{{ error }}</p>
    <pre v-else class="txt-preview-content">{{ content }}</pre>
  </div>
</template>

<style scoped lang="less">
.txt-preview {
  width: 100%;
  min-height: 200px;
  background: var(--background, #fff);
  overflow: auto;

  .txt-preview-loading,
  .txt-preview-error {
    padding: var(--size-40, 24px);
    text-align: center;
    color: var(--secondaryText, #666);
    font-size: var(--fs-14, 14px);
  }

  .txt-preview-content {
    margin: 0;
    padding: var(--size-12, 12px);
    font-size: var(--fs-14, 14px);
    line-height: 1.6;
    white-space: pre-wrap;
    word-break: break-word;
    color: var(--title, #333);
  }
}
</style>
