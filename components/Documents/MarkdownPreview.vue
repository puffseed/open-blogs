<!--
  Markdown 预览组件
  支持两种模式（参考 vue-markdown-editor API）：
  - preview：纯预览，使用 VMdPreview
  - codemirror：进阶版，使用 VMdEditor（CodeMirror 实现，支持 toc、全屏等）
-->
<script setup lang="ts">
import { ref, watch } from "vue";
import VMdPreview from "@kangc/v-md-editor/lib/preview";
import VMdEditor from "@kangc/v-md-editor/lib/codemirror-editor";
import "@kangc/v-md-editor/lib/style/preview.css";
import "@kangc/v-md-editor/lib/style/codemirror-editor.css";
import githubTheme from "@kangc/v-md-editor/lib/theme/github";
import "@kangc/v-md-editor/lib/theme/style/github.css";
import hljs from "highlight.js";

// codemirror 编辑器的相关资源（进阶版必需）
import Codemirror from "codemirror";
import "codemirror/mode/markdown/markdown";
import "codemirror/mode/javascript/javascript";
import "codemirror/mode/css/css";
import "codemirror/mode/htmlmixed/htmlmixed";
import "codemirror/mode/vue/vue";
import "codemirror/addon/edit/closebrackets";
import "codemirror/addon/edit/closetag";
import "codemirror/addon/edit/matchbrackets";
import "codemirror/addon/display/placeholder";
import "codemirror/addon/selection/active-line";
import "codemirror/addon/scroll/simplescrollbars";
import "codemirror/addon/scroll/simplescrollbars.css";
import "codemirror/lib/codemirror.css";
// 注册主题
VMdPreview.use(githubTheme, { Hljs: hljs });
// 进阶版需注入 Codemirror 并注册主题
;(VMdEditor as any).Codemirror = Codemirror;
VMdEditor.use(githubTheme, { Hljs: hljs });

const props = withDefaults(
  defineProps<{
    /** Markdown 文本内容 */
    text?: string;
    /** 展示类型：preview 纯预览 | codemirror 进阶版（CodeMirror） */
    type?: "preview" | "codemirror";
    /** 进阶版模式：edit 纯编辑 | editable 编辑+预览 | preview 纯预览 */
    mode?: "edit" | "editable" | "preview";
    /** 高度，如 '400px' */
    height?: string;
    /** 进阶版：是否默认显示目录 */
    defaultShowToc?: boolean;
    /** 进阶版：目录是否在右侧 */
    tocNavPositionRight?: boolean;
  }>(),
  {
    text: "",
    type: "preview",
    mode: "preview",
    height: "100%",
    defaultShowToc: false,
    tocNavPositionRight: true,
  },
);

// 进阶版使用 v-model，需维护本地状态以响应 prop 变化
const emit = defineEmits<{ (e: "update:text", value: string): void; (e: "download"): void }>();
const localText = ref(props.text);
watch(
  () => props.text,
  (v: string | undefined) => {
    localText.value = v ?? "";
  },
  { immediate: true },
);
// codemirror 模式下编辑内容变化时向父组件同步
watch(localText, (v) => {
  if (props.type === "codemirror") emit("update:text", v);
});

// 本地上传图片：将文件转为 base64 插入，或可由父组件通过 onUploadImage 自定义上传
const handleUploadImage = (
  _event: Event,
  insertImage: (params: { url: string; desc?: string; width?: string; height?: string }) => void,
  files: FileList | File[]
) => {
  const fileList = Array.isArray(files) ? files : Array.from(files || []);
  fileList.forEach((file) => {
    if (!file.type.startsWith("image/")) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      const url = e.target?.result as string;
      if (url) insertImage({ url, desc: file.name || "图片" });
    };
    reader.readAsDataURL(file);
  });
};
</script>

<template>
  <div class="markdown-preview-wrapper">
    <!-- 纯预览：VMdPreview -->
    <VMdPreview v-if="type === 'preview'" :text="text" />

    <!-- 进阶版：VMdEditor（CodeMirror），左编辑右预览；save 事件转发为 download，由父组件实现下载到本地 -->
    <!-- disabled-menus 置空以同时显示「添加图片链接」与「本地上传」 -->
    <VMdEditor
      v-else
      v-model="localText"
      :mode="mode"
      :height="height"
      :default-show-toc="defaultShowToc"
      :toc-nav-position-right="tocNavPositionRight"
      :disabled-menus="[]"
      right-toolbar="preview toc sync-scroll fullscreen"
      @save="emit('download')"
      @upload-image="handleUploadImage"
    />
  </div>
</template>

<style scoped>
.markdown-preview-wrapper {
  width: 100%;
  min-height: 200px;
}
/* CodeMirror模式下-自定义样式 */
/* 工具栏 */
:deep(.v-md-editor__toolbar) {
  background-color: var(--background);
}
/* 按钮悬停 */
:deep(.v-md-editor__toolbar-item:hover) {
  background-color: var(--border);
}
/* 按钮激活 */
:deep(.v-md-editor__toolbar-item--active, .v-md-editor__toolbar-item--active:hover) {
  background-color: var(--border);
}
/* 序号 */
:deep(.CodeMirror-gutters) {
  background-color: var(--white);
}
/* 编辑区 */
:deep(.CodeMirror-sizer) {
  background-color: var(--white);
}
/* 预览区 */
:deep(.scrollbar) {
  background-color: var(--white);
}
/* 目录 */
:deep(.v-md-editor__left-area-title) {
  background-color: var(--background);
}
/* END */
</style>
