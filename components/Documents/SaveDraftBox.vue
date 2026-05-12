<script setup lang="ts">
/**
 * 草稿箱头部按钮：在 openDetail 编辑模式下显示，点击弹出保存弹窗或打开草稿抽屉；
 * 抽屉与弹窗由 GlobalDraftBox 全局渲染。
 */
import type { DraftFileType } from "~/composables/useDraftBox";

const props = defineProps<{
  /** 当前文档（编辑模式下传入），点击按钮时弹出保存草稿弹窗 */
  currentDocument?: {
    title: string;
    content: string;
    fileType: DraftFileType;
    documentPath?: string;
    documentId?: string;
} | null;
}>();

const {
  draftCount,
  openDrawer,
  openSaveModal,
} = useDraftBox();

function handleIconClick() {
  if (props.currentDocument) {
    openSaveModal(props.currentDocument);
  } else {
    openDrawer();
  }
}
</script>

<template>
  <div class="save-draft-box">
    <!-- 草稿箱图标 + 角标（点击打开保存弹窗或抽屉，由 GlobalDraftBox 统一渲染） -->
    <button type="button" class="draft-box-btn" title="保存草稿" @click="handleIconClick">
      <i class="iconfont icon-DraftBox"></i>
      <span v-if="draftCount > 0" class="draft-box-badge">{{ draftCount > 99 ? '99+' : draftCount }}</span>
    </button>
  </div>
</template>

<style scoped lang="less">
.save-draft-box {
  display: inline-flex;
  align-items: center;
}

/* 与 openDetail 头部 op-btn 一致：白底、边框、圆角、hover 主色 */
.draft-box-btn {
  position: relative;
  width: var(--size-24);
  height: var(--size-24);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--size-8);
  margin-left: 12px;
  padding: 0;
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

.draft-box-badge {
  position: absolute;
  top: -2px;
  right: -2px;
  min-width: 14px;
  height: 14px;
  padding: 0 4px;
  font-size: 10px;
  line-height: 14px;
  text-align: center;
  color: #fff;
  background: var(--primary);
  border-radius: 7px;
}
</style>
