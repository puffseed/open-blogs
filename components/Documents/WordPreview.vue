<script setup lang="ts">
/**
 * Word 文档预览组件（支持 .docx；.doc 为旧版二进制格式，浏览器内无法直接预览，仅提示下载）
 * 使用 docx-preview 在浏览器中将 docx 渲染为 HTML。
 *
 * 使用示例：
 * 1. 通过文档接口 URL 预览 docx：
 *    <WordPreview src="/api/document?path=documents/Word/设计规范.docx" extension="docx" height="calc(100vh - 100px)" />
 * 2. 通过 id 查询文档：
 *    <WordPreview src="/api/document?id=xxx" extension="docx" height="400px" />
 * 3. .doc 格式会显示“不支持在线预览，请下载”提示：
 *    <WordPreview src="/api/document?path=documents/Word/旧文档.doc" extension="doc" />
 */
import { ref, watch, onMounted, nextTick } from "vue";

const props = withDefaults(
  defineProps<{
    /** 文档地址（如 /api/document?path=... 或 /api/document?id=...） */
    src: string;
    /** 文件扩展名：docx 可预览，doc 仅提示下载 */
    extension?: "docx" | "doc";
    /** 容器高度，默认 100% */
    height?: string;
  }>(),
  { extension: "docx", height: "100%" }
);

const containerRef = ref<HTMLElement | null>(null);
const loading = ref(true);
const error = ref("");

async function load() {
  if (!props.src) {
    loading.value = false;
    error.value = "暂无预览地址";
    return;
  }
  if (props.extension === "doc") {
    loading.value = false;
    error.value = "不支持 .doc 格式在线预览，请点击下载后使用 Word 打开";
    return;
  }
  loading.value = true;
  error.value = "";
  if (containerRef.value) {
    containerRef.value.innerHTML = "";
  }
  try {
    const res = await fetch(props.src, { cache: "no-store" });
    if (!res.ok) {
      error.value = "加载文档失败";
      return;
    }
    const blob = await res.blob();
    let docx: { renderAsync: (doc: Blob, body: HTMLElement, style?: HTMLElement | null, opts?: object) => Promise<unknown> };
    try {
      docx = await import("docx-preview") as { renderAsync: (doc: Blob, body: HTMLElement, style?: HTMLElement | null, opts?: object) => Promise<unknown> };
    } catch {
      error.value = "Word 预览插件未安装，请运行 npm install docx-preview 后重试";
      return;
    }
    // 先关闭 loading，使带 ref 的容器挂载到 DOM，否则 containerRef 为 null
    loading.value = false;
    await nextTick();
    if (!containerRef.value) {
      error.value = "渲染容器不可用";
      return;
    }
    containerRef.value.innerHTML = "";
    await docx.renderAsync(blob, containerRef.value, containerRef.value, {
      className: "docx-preview-doc",
      inWrapper: true,
      ignoreWidth: false,
      ignoreHeight: false,
      breakPages: true,
    });
  } catch (e) {
    error.value = "解析文档失败";
    console.warn("WordPreview load error:", e);
  } finally {
    loading.value = false;
  }
}

onMounted(load);
watch([() => props.src, () => props.extension], load);
</script>

<template>
  <div class="word-preview" :style="{ height }">
    <div v-if="loading" class="word-preview-loading">加载中...</div>
    <p v-else-if="error" class="word-preview-error">{{ error }}</p>
    <div v-else ref="containerRef" class="word-preview-wrap docx-preview-doc" />
  </div>
</template>

<style scoped lang="less">
.word-preview {
  width: 100%;
  min-height: 200px;
  background: var(--background, #fff);
  overflow: auto;

  .word-preview-loading,
  .word-preview-error {
    padding: var(--size-40, 24px);
    text-align: center;
    color: var(--secondaryText, #666);
    font-size: var(--fs-14, 14px);
  }

  .word-preview-wrap {
    overflow: auto;

    :deep(.docx-wrapper) {
      background: var(--background, #fff);
      box-shadow: 0 0 10px rgba(0, 0, 0, 0.08);
    }
  }
}

:deep(.docx-preview-doc-wrapper) {
  background-color: var(--background);

}

:deep(.docx-preview-doc-wrapper>section.docx-preview-doc){
  box-shadow: none;
}
</style>
