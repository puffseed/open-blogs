<!-- 文档详情页 -->
<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, onBeforeUnmount, watch, defineAsyncComponent, nextTick } from "vue";
import MarkdownPreview from "~/components/Documents/MarkdownPreview.vue";
import PDFPreview from "~/components/Documents/PDFPreview.vue";
import XlsxPreview from "~/components/Documents/XlsxPreview.vue";
import TXTPreview from "~/components/Documents/TXTPreview.vue";
import CodePreview from "~/components/Documents/CodePreview.vue";
import SaveDraftBox from "~/components/Documents/SaveDraftBox.vue";
import ListSkeleton from "~/components/ListSkeleton.vue";
import { decodeCipher, isCipher } from "@/utils/urlCipher";
import SystemCopyright from "~/components/Systems/SystemCopyright.vue";

// Word 预览按需异步加载，避免未安装 docx-preview 时影响其他格式
const WordPreview = defineAsyncComponent({
  loader: () => import("~/components/Documents/WordPreview.vue"),
  errorComponent: {
    template: '<div class="open-detail-error" style="padding: 24px;">Word 预览组件加载失败，请刷新重试或使用下载功能。</div>',
  },
  delay: 0,
});

const route = useRoute();
const router = useRouter();

// 从路由参数获取文档标识：优先 id（密文），兼容 path（可能为密文）
const documentId = computed(() => {
  const id = route.query.id;
  return typeof id === "string" ? id : "";
});
const documentPath = computed(() => {
  const raw = route.query.path;
  const path = typeof raw === "string" ? raw : "";
  return path && isCipher(path) ? decodeCipher(path) : path;
});

// 文档标题：id 模式下由 API 返回，path 模式下由 query 传入（可能为密文需解码）
const apiDocumentTitle = ref("");
const documentTitle = computed(() => {
  const fromApi = apiDocumentTitle.value;
  if (fromApi) return fromApi;
  const raw = route.query.title;
  const title = typeof raw === "string" ? raw : "";
  if (title && isCipher(title)) return decodeCipher(title);
  return title || "文档";
});

// 文档文件类型后缀（含通过 id 解析出的路径；从草稿打开时用 loadedDraftFileType）
const fileExtension = computed(() => {
  if (loadedDraftFileType.value) {
    return loadedDraftFileType.value === "TXT" ? ".txt" : ".md";
  }
  const path = resolvedDocumentPath.value || documentPath.value;
  if (!path) return ".md"; // 默认 .md
  const match = path.match(/\.(md|pdf|xlsx|docx|doc|txt|css|js|ts|jsx|tsx|html|json|yaml|yml)$/i);
  return match ? match[0].toLowerCase() : ".md";
});

// 是否为 PDF（在浏览器中通过 iframe 预览）
const isPdf = computed(() => fileExtension.value === ".pdf");

// 是否为 Excel（在浏览器中通过 SheetJS 渲染表格预览）
const isXlsx = computed(() => fileExtension.value === ".xlsx");

// 是否为 Word（docx 可预览，doc 仅提示下载）
const isDocx = computed(() => fileExtension.value === ".docx");
const isDoc = computed(() => fileExtension.value === ".doc");
const isWord = computed(() => isDocx.value || isDoc.value);

// 是否为纯文本 .txt
const isTxt = computed(() => fileExtension.value === ".txt");

// 是否为代码文件
const isCode = computed(() => {
  const codeExtensions = [".css", ".js", ".ts", ".jsx", ".tsx", ".html", ".json", ".yaml", ".yml"];
  return codeExtensions.includes(fileExtension.value);
});

// 获取代码语言
const codeLanguage = computed(() => {
  const langMap: Record<string, string> = {
    ".css": "css",
    ".js": "javascript",
    ".ts": "typescript",
    ".jsx": "jsx",
    ".tsx": "tsx",
    ".html": "html",
    ".json": "json",
    ".yaml": "yaml",
    ".yml": "yaml"
  };
  return langMap[fileExtension.value] || "";
});

// 是否为仅预览型文档（不加载 markdown 内容）
const isPreviewOnly = computed(() => {
  // 代码文件在编辑模式下不视为预览型文档
  if (isCode.value && isEditMode.value) return false;
  return isPdf.value || isXlsx.value || isWord.value || isTxt.value || isCode.value;
});

// 文档内容、加载状态、错误信息（需在 showDraftBox / draftBoxCurrentDocument 之前声明）
const text = ref("");
const loading = ref(true);
const error = ref("");
/** 通过 id 打开时由 document-info 解析出的路径，用于判断 PDF 与生成 documentSrc */
const resolvedDocumentPath = ref("");
// 是否处于编辑模式（codemirror），默认预览模式
const isEditMode = ref(false);
/** 从草稿箱打开时，记录草稿的文件类型，用于 fileExtension 等计算 */
const loadedDraftFileType = ref<"TXT" | "MD" | null>(null);

/** 仅在 .md / .txt / 代码文件编辑模式下显示草稿箱按钮 */
const showDraftBox = computed(() => isEditMode.value && (isTxt.value || fileExtension.value === ".md" || isCode.value));

/** 传给草稿箱的当前文档（保存草稿弹窗用） */
const draftBoxCurrentDocument = computed(() => {
  if (!showDraftBox.value) return null;
  return {
    title: documentTitle.value || "未命名",
    content: text.value,
    fileType: (isTxt.value ? "TXT" : "MD") as "TXT" | "MD",
    documentPath: documentPath.value || undefined,
    documentId: documentId.value || undefined,
  };
});

// 同步当前文档到全局草稿箱，便于抽屉内「保存当前文档」显示
const { setCurrentDocument } = useDraftBox();
watch(draftBoxCurrentDocument, (val) => setCurrentDocument(val), { immediate: true });
onBeforeUnmount(() => setCurrentDocument(null));

// PDF 预览地址（path 或 id 模式）
const documentSrc = computed(() => {
  if (!isPdf.value) return "";
  if (documentId.value) return `/api/document?id=${encodeURIComponent(documentId.value)}`;
  const path = documentPath.value;
  return path ? `/api/document?path=${encodeURIComponent(path)}` : "";
});

// Excel 预览地址（path 或 id 模式，与 document 接口一致）
const xlsxDocumentSrc = computed(() => {
  if (!isXlsx.value) return "";
  if (documentId.value) return `/api/document?id=${encodeURIComponent(documentId.value)}`;
  const path = documentPath.value;
  return path ? `/api/document?path=${encodeURIComponent(path)}` : "";
});

// Word 预览/下载地址（path 或 id 模式，docx 可预览，doc 仅下载）
const wordDocumentSrc = computed(() => {
  if (!isWord.value) return "";
  if (documentId.value) return `/api/document?id=${encodeURIComponent(documentId.value)}`;
  const path = documentPath.value;
  return path ? `/api/document?path=${encodeURIComponent(path)}` : "";
});

// TXT 预览地址（path 或 id 模式）
const txtDocumentSrc = computed(() => {
  if (!isTxt.value) return "";
  if (documentId.value) return `/api/document?id=${encodeURIComponent(documentId.value)}`;
  const path = documentPath.value;
  return path ? `/api/document?path=${encodeURIComponent(path)}` : "";
});

// 代码预览地址（path 或 id 模式）
const codeDocumentSrc = computed(() => {
  if (!isCode.value) return "";
  if (documentId.value) return `/api/document?id=${encodeURIComponent(documentId.value)}`;
  const path = documentPath.value;
  return path ? `/api/document?path=${encodeURIComponent(path)}` : "";
});

// 通过文档接口下载的 URL（PDF/Excel/Word/TXT/代码等，用于下载时保持正确格式）
const documentDownloadSrc = computed(() => {
  const ext = fileExtension.value;
  if (!isPdf.value && !isXlsx.value && !isWord.value && !isTxt.value && !isCode.value) return "";
  if (documentId.value) return `/api/document?id=${encodeURIComponent(documentId.value)}`;
  const path = documentPath.value;
  return path ? `/api/document?path=${encodeURIComponent(path)}` : "";
});

// 下载用文件名（标题 + 实际后缀，与 document 中格式一致）
const downloadFileName = computed(() => `${documentTitle.value || "文档"}${fileExtension.value}`);

// 带文件类型的文档标题
const documentTitleWithExtension = computed(() => {
  return `${documentTitle.value}${fileExtension.value}`;
});

// TXT 编辑框 ref，进入编辑模式后自动聚焦
const txtEditorRef = ref<HTMLTextAreaElement | null>(null);
watch(
  () => isTxt.value && isEditMode.value,
  (isTxtEdit) => {
    if (isTxtEdit) {
      nextTick(() => txtEditorRef.value?.focus());
    }
  }
);

// 代码编辑框 ref，进入编辑模式后自动聚焦
const codeEditorRef = ref<HTMLTextAreaElement | null>(null);
watch(
  () => isCode.value && isEditMode.value,
  (isCodeEdit) => {
    if (isCodeEdit) {
      nextTick(() => {
        const editor = codeEditorRef.value;
        if (editor) {
          editor.focus();
          // 将光标置顶显示
          editor.setSelectionRange(0, 0);
          editor.scrollTop = 0;
        }
      });
    }
  }
);

// 预览模式下顶部栏置顶（参考 default.vue）
const isHeaderSticky = ref(false);
const scrollThreshold = 0;
const handleScroll = () => {
  const scrollY = window.scrollY || document.documentElement.scrollTop;
  isHeaderSticky.value = scrollY > scrollThreshold;
};

// 加载 markdown 内容：使用 id 或 path 请求 API；若有 draftId 则从草稿箱加载
const loadMarkdown = async () => {
  loading.value = true;
  error.value = "";
  apiDocumentTitle.value = "";
  resolvedDocumentPath.value = "";
  loadedDraftFileType.value = null;

  const draftId = route.query.draftId;
  if (typeof draftId === "string" && draftId) {
    const { getDraftById } = useDraftBox();
    const draft = getDraftById(draftId);
    if (draft) {
      text.value = draft.content ?? "";
      apiDocumentTitle.value = draft.title ?? "";
      loadedDraftFileType.value = draft.fileType === "TXT" ? "TXT" : "MD";
      isEditMode.value = true;
      loading.value = false;
      return;
    }
  }

  const id = documentId.value;
  const path = documentPath.value;
  const useId = !!id;
  let pathToLoad = path;
  let ok = false;

  try {
    if (useId) {
      const infoRes = await fetch(`/api/document-info?id=${encodeURIComponent(id)}`, { cache: "no-store" });
      if (infoRes.ok) {
        const info = await infoRes.json();
        apiDocumentTitle.value = info.title ?? "";
        resolvedDocumentPath.value = info.documentPath ?? "";
        pathToLoad = resolvedDocumentPath.value;
        if (/\.(pdf|xlsx|docx|doc)$/i.test(info.documentPath ?? "")) {
          ok = true;
          loading.value = false;
          return;
        }
        if (/\.(txt|css|js|ts|jsx|tsx|html|json|yaml|yml)$/i.test(info.documentPath ?? "")) {
          const docRes = await fetch(`/api/document?id=${encodeURIComponent(id)}`, { cache: "no-store" });
          if (docRes.ok) {
            text.value = await docRes.text();
            ok = true;
          }
          loading.value = false;
          return;
        }
      }
    } else {
      resolvedDocumentPath.value = path || "";
    }

    if (/\.(pdf|xlsx|docx|doc)$/i.test(resolvedDocumentPath.value || pathToLoad)) {
      ok = true;
      loading.value = false;
      return;
    }
    if (/\.(txt|css|js|ts|jsx|tsx|html|json|yaml|yml)$/i.test(resolvedDocumentPath.value || pathToLoad)) {
      const txtUrl = pathToLoad
        ? `/api/document?path=${encodeURIComponent(pathToLoad)}`
        : documentId.value
          ? `/api/document?id=${encodeURIComponent(documentId.value)}`
          : "";
      if (txtUrl) {
        const docRes = await fetch(txtUrl, { cache: "no-store" });
        if (docRes.ok) {
          text.value = await docRes.text();
          ok = true;
        }
      }
      loading.value = false;
      return;
    }
    const query = useId
      ? `id=${encodeURIComponent(id)}`
      : `path=${encodeURIComponent(pathToLoad || "markdowns/1.md")}`;
    const apiRes = await fetch(`/api/markdown?${query}`, { cache: "no-store" });
    if (apiRes.ok) {
      const data = await apiRes.json();
      text.value = data.content ?? "";
      if (data.title) apiDocumentTitle.value = data.title;
      ok = true;
      return;
    }
    if (!useId && pathToLoad) {
      const res = await fetch(`/${pathToLoad}`, { cache: "no-store" });
      if (res.ok) {
        text.value = await res.text();
        ok = true;
        return;
      }
    }
  } catch {
    if (!useId && pathToLoad) {
      try {
        const res = await fetch(`/${pathToLoad}`, { cache: "no-store" });
        if (res.ok) {
          text.value = await res.text();
          ok = true;
          return;
        }
      } catch {
        /* fallback 失败 */
      }
    }
  } finally {
    loading.value = false;
    if (!ok) error.value = "加载文档失败，请稍后重试";
  }
};

onMounted(() => {
  loadMarkdown();
  window.addEventListener("scroll", handleScroll);
});
onUnmounted(() => {
  window.removeEventListener("scroll", handleScroll);
});
watch([documentId, documentPath, () => route.query.draftId], loadMarkdown);

// 下载文档（TXT/代码编辑模式下下载当前编辑内容；其他按 document 格式走文档接口或当前内容）
const downloadDocument = () => {
  if ((isTxt.value || isCode.value) && isEditMode.value) {
    const blob = new Blob([text.value], { type: "text/plain; charset=utf-8" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = downloadFileName.value;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(a.href);
    return;
  }
  if (documentDownloadSrc.value) {
    const a = document.createElement("a");
    a.href = documentDownloadSrc.value;
    a.download = downloadFileName.value;
    a.target = "_blank";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    return;
  }
  const element = document.createElement("a");
  const file = new Blob([text.value], { type: "text/markdown" });
  element.href = URL.createObjectURL(file);
  element.download = downloadFileName.value;
  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);
  URL.revokeObjectURL(element.href);
};

// 返回：若为弹窗打开则关闭窗口，否则路由返回
const goBack = () => {
  if (window.opener) {
    window.close();
  } else {
    router.back();
  }
};
</script>

<template>
  <div class="open-detail">
    <!-- 加载中：优先全屏骨架屏，与 MainContent 骨架屏无缝衔接，避免 header/footer 短暂闪现 -->
    <ListSkeleton v-if="loading" :line-count="12" class="open-detail-skeleton-full" />

    <template v-else>
      <!-- 顶部栏：预览模式下置顶 -->
      <div class="open-detail-header" :class="{ 'sticky-header': !isEditMode && isHeaderSticky }">
        <div class="open-detail-header-left">
          <button class="op-btn op-btn-back" @click="goBack">
            <i class="iconfont icon-Back"></i>
          </button>
        </div>
        <div class="open-detail-header-center">
          <p class="open-detail-title">{{ documentTitleWithExtension }}</p>
        </div>
        <div class="open-detail-header-right">
          <!-- 下载（TXT 仅在编辑模式显示，下载当前编辑内容；其他格式在预览时显示，PDF 不显示） -->
          <button v-if="(!isEditMode && !isPdf) || (isTxt && isEditMode)" class="op-btn" title="下载文档"
            @click="downloadDocument">
            <i class="iconfont icon-Download"></i>
          </button>
          <!-- 保存草稿箱（仅 .md / .txt 编辑模式显示）；有当前文档时点击弹出保存弹窗，否则打开草稿列表抽屉 -->
          <SaveDraftBox v-if="showDraftBox" :current-document="draftBoxCurrentDocument" />
          <!-- 编辑文档（TXT 和代码文件也显示，便于切换为可编辑文本） -->
          <button v-if="!isPreviewOnly || isTxt || isCode" class="op-btn op-btn-edit-toggle" :title="isEditMode ? '预览文档' : '编辑文档'"
            style="margin-left: var(--size-12);" @click="isEditMode = !isEditMode">
            <i class="iconfont icon-Editor"></i>
          </button>

        </div>
      </div>

      <!-- 内容区 -->
      <div class="open-detail-content">
        <div v-if="error" class="open-detail-error">{{ error }}</div>
        <!-- PDF 预览 -->
        <PDFPreview v-else-if="isPdf && documentSrc" :src="documentSrc" height="calc(100vh - 100px)" />
        <!-- Excel 表格预览 -->
        <ClientOnly v-else-if="isXlsx && xlsxDocumentSrc">
          <XlsxPreview :src="xlsxDocumentSrc" height="calc(100vh - 100px)" />
          <template #fallback>
            <ListSkeleton :line-count="8" :hide-header="true" class="open-detail-skeleton" />
          </template>
        </ClientOnly>
        <!-- Word 文档预览（docx 可预览，doc 仅提示下载） -->
        <ClientOnly v-else-if="isWord && wordDocumentSrc">
          <WordPreview :src="wordDocumentSrc" :extension="isDocx ? 'docx' : 'doc'" height="calc(100vh - 100px)" />
          <template #fallback>
            <ListSkeleton :line-count="8" :hide-header="true" class="open-detail-skeleton" />
          </template>
        </ClientOnly>
        <!-- 纯文本 .txt 预览 -->
        <TXTPreview v-else-if="isTxt && !isEditMode && txtDocumentSrc" :src="txtDocumentSrc"
          height="calc(100vh - 100px)" />
        <!-- 纯文本 .txt 编辑模式 -->
        <div v-else-if="isTxt && isEditMode" class="open-detail-txt-editor">
          <textarea ref="txtEditorRef" v-model="text" class="open-detail-txt-textarea"
            :style="{ height: 'calc(100vh - 100px)' }" />
        </div>
        <!-- 代码文件预览 -->
        <ClientOnly v-else-if="isCode && codeDocumentSrc && !isEditMode">
          <CodePreview :src="codeDocumentSrc" :language="codeLanguage" height="calc(100vh - 100px)" />
          <template #fallback>
            <ListSkeleton :line-count="8" :hide-header="true" class="open-detail-skeleton" />
          </template>
        </ClientOnly>
        <!-- 代码文件编辑模式 -->
        <div v-else-if="isCode && isEditMode" class="open-detail-code-editor">
          <textarea ref="codeEditorRef" v-model="text" class="open-detail-code-textarea"
            :style="{ height: 'calc(100vh - 100px)' }" />
        </div>
        <!-- Markdown / codemirror -->
        <ClientOnly v-else>
          <MarkdownPreview v-model:text="text" :type="isEditMode ? 'codemirror' : 'preview'"
            :mode="isEditMode ? 'editable' : 'preview'" height="calc(100vh - 100px)" @download="downloadDocument" />
          <template #fallback>
            <ListSkeleton :line-count="8" :hide-header="true" class="open-detail-skeleton" />
          </template>
        </ClientOnly>
      </div>

      <!-- 底部栏 -->
      <div class="open-detail-footer">
        <SystemCopyright />
      </div>
    </template>
  </div>
</template>

<style scoped lang="less">
.open-detail {
  width: 100%;
  height: 100%;
  min-height: 100vh;

  .open-detail-skeleton-full {
    min-height: 100vh;
    width: 100%;
  }

  .open-detail-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: var(--size-12) var(--size-16);
    background-color: var(--white);
    border-bottom: 1px solid var(--border);

    .open-detail-header-left {
      .op-btn {
        display: flex;
        align-items: center;
        gap: var(--size-8);
      }
    }

    .open-detail-header-center {
      display: flex;
      flex: 1;
      text-align: start;
      margin: 0 var(--size-12);

      .open-detail-title {
        font-size: var(--fs-16);
        font-weight: normal;
        color: var(--title);
        margin: 0;
      }
    }

    .open-detail-header-right {
      display: flex;
      align-items: center;

      .op-btn {
        display: flex;
        align-items: center;
        gap: var(--size-8);
      }
    }
  }

  :deep(.sticky-header) {
    position: sticky;
    top: 0;
    z-index: 9999;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }

  .open-detail-content {
    margin: 0 auto;
    max-width: 100%;
    min-height: 400px;

    .open-detail-skeleton {
      min-height: 400px;
      width: 100%;
    }

    .open-detail-loading,
    .open-detail-error {
      text-align: center;
      padding: var(--size-40);
      color: var(--secondaryText);
    }

    .open-detail-error {
      color: var(--error);
    }

    .open-detail-txt-editor {
      padding: 20px;
      width: 100%;
      box-sizing: border-box;
    }

    .open-detail-txt-textarea {
      display: block;
      width: 100%;
      padding: 12px;
      box-sizing: border-box;
      background-color: #fff;
      border: 1px solid var(--border, #e8e8e8);
      border-radius: 4px;
      font-size: var(--fs-14, 14px);
      line-height: 1.6;
      resize: vertical;
      font-family: inherit;
    }

    .open-detail-code-editor {
      padding: 20px;
      width: 100%;
      box-sizing: border-box;
    }

    .open-detail-code-textarea {
      display: block;
      width: 100%;
      padding: 12px;
      box-sizing: border-box;
      background-color: var(--white);
      color: var(--mainText);
      border: 1px solid var(--border, #e8e8e8);
      border-radius: 12px;
      font-size: var(--fs-14, 14px);
      line-height: 1.6;
      resize: vertical;
      font-family: 'Consolas', 'Monaco', 'Courier New', monospace;
    }

    :deep(.v-md-editor-preview) {
      border: none;
      background-color: transparent;
    }
  }

  .open-detail-footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    height: 50px;
    background-color: var(--white);
    position: fixed;
    bottom: 0;
    left: 0;
    z-index: 9999;
    border-top: 1px solid var(--border);
  }
}

/* 按钮样式 */
.op-btn {
  width: var(--size-24);
  height: var(--size-24);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--size-8);
  border: 1px solid var(--border);
  border-radius: var(--size-8);
  background-color: var(--white);
  color: var(--mainText);
  font-size: var(--fs-14);
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    color: var(--primary);
  }

  &:active {
    background-color: var(--background);
  }

  .iconfont {
    font-size: var(--fs-16);
  }
}

.op-btn-back {
  width: var(--size-30);
  height: var(--size-30);
  border-radius: var(--size-24);
  background-color: var(--primary);
  color: var(--white);
  border: none;

  &:hover {
    color: var(--white);
    background-color: var(--primary-hover);
  }
}

.op-btn-gap {
  margin-left: var(--size-12);
}

/* 屏幕小于 876px 时隐藏编辑/预览切换按钮 */
@media (max-width: 875px) {
  .op-btn-edit-toggle {
    display: none !important;
  }
}

@media (max-width: 768px) {
  .open-detail {
    .open-detail-header {
      padding: var(--size-12) var(--size-16);

      .open-detail-header-center {
        margin: 0 var(--size-16);

        .open-detail-title {
          font-size: var(--fs-16);
        }
      }

      .open-detail-header-right {
        .op-btn {
          font-size: var(--fs-12);
          padding: var(--size-6) var(--size-12);

          .iconfont {
            font-size: var(--fs-14);
          }
        }
      }
    }
  }
}
</style>
