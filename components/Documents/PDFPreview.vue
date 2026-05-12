<script setup lang="ts">

defineProps<{
  /** PDF 地址（如 /api/document?path=documents/PDF/xxx.pdf） */
  src: string;
  /** 高度，默认填满容器 */
  height?: string;
}>();
</script>
<!-- /**
 * 在浏览器中预览 PDF：通过 iframe 加载文档 URL
 *
 * 使用示例：
 * 1. 通过文档接口 path 预览：
 *    <PDFPreview src="/api/document?path=documents/PDF/测试用例表.pdf" height="calc(100vh - 100px)" />
 * 2. 通过 id 查询文档：
 *    <PDFPreview src="/api/document?id=xxx" height="400px" />
 * 3. 仅指定 src，高度默认填满容器：
 *    <PDFPreview src="/api/document?path=documents/PDF/说明.pdf" />
 */ -->
<template>
  <div class="pdf-preview">
    <iframe
      v-if="src"
      class="pdf-iframe"
      :src="src"
      :style="{ height: height ?? '100%' }"
      title="PDF 预览"
    />
    <p v-else class="pdf-preview-empty">暂无预览地址</p>
  </div>
</template>

<style scoped lang="less">
.pdf-preview {
  width: 100%;
  min-height: 400px;
  background: var(--background);

  .pdf-iframe {
    display: block;
    width: 100%;
    min-height: 400px;
    border: none;
  }

  .pdf-preview-empty {
    padding: var(--size-40);
    text-align: center;
    color: var(--secondaryText);
    font-size: var(--fs-14);
  }
}
</style>
