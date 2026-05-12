<script setup lang="ts">
/**
 * 全局草稿箱入口：有草稿时在页面右下角显示图标+数量角标，点击打开右侧抽屉；
 * 抽屉与保存草稿弹窗在此统一渲染，全站共用。
 */
import type { DraftFileType } from "~/composables/useDraftBox";

const router = useRouter();
const {
  drafts,
  draftCount,
  drawerVisible,
  saveModalVisible,
  saveModalTitleInput,
  currentDocumentRef,
  openDrawer,
  closeDrawer,
  refreshFromStorage,
  openSaveModal,
  closeSaveModal,
  confirmSave,
  removeDraft,
} = useDraftBox();

// 每次路由导航完成后从 localStorage 同步草稿列表，保证返回上一页时角标实时正确（含预览态删除后返回）
onMounted(() => {
  refreshFromStorage();
  const remove = router.afterEach(() => {
    nextTick(() => refreshFromStorage());
  });
  onBeforeUnmount(() => remove());
});
// keep-alive 下返回该页时再次同步
onActivated(() => refreshFromStorage());
// 路由 path 变化时再同步一次，确保从详情页返回列表页等场景角标可见
const route = useRoute();
watch(() => route.path, () => nextTick(() => refreshFromStorage()), { immediate: false });

function goToDraft(draftId: string) {
  closeDrawer();
  router.push({ path: "/ResourceLibrary/openDetail", query: { draftId } });
}

function deleteDraft(e: Event, draftId: string) {
  e.stopPropagation();
  removeDraft(draftId);
}

function displayTitle(title: string, maxLen = 12) {
  if (!title) return "";
  return title.length <= maxLen ? title : title.slice(0, maxLen) + "…";
}

function fileTypeLabel(fileType: DraftFileType) {
  const map: Record<DraftFileType, string> = {
    TXT: "TXT",
    MD: "MD",
    HTML: "HTML",
    Word: "Word",
    Excel: "Excel",
    PDF: "PDF",
  };
  return map[fileType] ?? fileType;
}

const badgeCount = computed(() => (draftCount.value > 99 ? "99+" : String(draftCount.value)));

/** 当前输入的文件名在草稿列表中是否已存在（去空格后比较） */
const isDuplicateDraftName = computed(() => {
  const name = saveModalTitleInput.value.trim();
  if (!name) return false;
  return drafts.value.some((d) => d.title.trim() === name);
});

const saveModalInputRef = ref<HTMLInputElement | null>(null);
watch(saveModalVisible, (visible) => {
  if (visible) nextTick(() => saveModalInputRef.value?.focus());
});
</script>

<template>
  <!-- 右下角入口：仅当有草稿时显示 -->
  <Teleport to="body">
    <Transition name="float-fade">
      <button
        v-if="draftCount > 0"
        type="button"
        class="global-draft-float"
        title="草稿箱"
        aria-label="打开草稿箱"
        @click="openDrawer"
      >
        <div class="global-draft-float-corner corner-badge-MarkBox">
          <div class="corner-badge-insideBox">{{ badgeCount }}</div>
        </div>
        <i class="iconfont icon-DraftBox"></i>
      </button>
    </Transition>
  </Teleport>

  <!-- 右侧抽屉：草稿列表 -->
  <Teleport to="body">
    <Transition name="drawer-fade">
      <div v-if="drawerVisible" class="draft-drawer-mask" @click="closeDrawer" />
    </Transition>
    <Transition name="drawer-slide">
      <div v-if="drawerVisible" class="draft-drawer">
        <div class="draft-drawer-header">
          <span class="draft-drawer-title">草稿箱</span>
          <button type="button" class="draft-drawer-close" title="关闭" @click="closeDrawer">
            <i class="iconfont icon-Close"></i>
          </button>
        </div>
        <div class="draft-drawer-body">
          <button
            v-if="currentDocumentRef"
            type="button"
            class="draft-save-current-btn"
            @click="openSaveModal(currentDocumentRef)"
          >
            <i class="iconfont icon-DraftBox"></i>
            <span>保存当前文档</span>
          </button>
          <p v-if="drafts.length === 0" class="draft-empty">暂无数据</p>
          <div v-else class="draft-list">
            <div v-for="d in drafts" :key="d.id" class="draft-card">
              <span class="draft-card-type">{{ fileTypeLabel(d.fileType) }}</span>
              <span class="draft-card-name" :title="d.title">{{ displayTitle(d.title) }}</span>
              <div class="draft-card-actions">
                <button type="button" class="draft-card-edit" @click="goToDraft(d.id)">编辑</button>
                <button type="button" class="draft-card-delete" title="删除" @click="deleteDraft($event, d.id)">删除</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>

  <!-- 保存草稿弹窗 -->
  <Teleport to="body">
    <Transition name="modal-fade">
      <div v-if="saveModalVisible" class="draft-save-modal-mask" @click.self="closeSaveModal">
        <div class="draft-save-modal">
          <div class="draft-save-modal-header">
            <span class="draft-save-modal-title">保存草稿</span>
            <button type="button" class="draft-save-modal-close" title="关闭" @click="closeSaveModal">
              <i class="iconfont icon-Close"></i>
            </button>
          </div>
          <div class="draft-save-modal-body">
            <label class="draft-save-label">文件名称</label>
            <input ref="saveModalInputRef" v-model="saveModalTitleInput" type="text" class="draft-save-input" placeholder="请输入文件名称" />
            <p v-if="isDuplicateDraftName" class="draft-save-duplicate-tip">草稿箱中已存在相同的草稿, 请修改名称</p>
          </div>
          <div class="draft-save-modal-footer">
            <button type="button" class="draft-save-btn draft-save-cancel" @click="closeSaveModal">取消</button>
            <button type="button" class="draft-save-btn draft-save-confirm" :disabled="isDuplicateDraftName" @click="confirmSave()">确认</button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped lang="less">
/* 右下角浮动入口：内边距 24px，中间图标，右上角角标 */
.global-draft-float {
  position: fixed;
  right: 24px;
  bottom: 24px;
  z-index: 999;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 72px;
  height: 72px;
  padding: 24px;
  box-sizing: border-box;
  border: none;
  border-radius: 50%;
  background: var(--white, #fff);
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.12);
  cursor: pointer;
  color: var(--title, #333);
}

.global-draft-float:hover {
  color: var(--primary);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
}

.global-draft-float .iconfont {
  font-size: 28px;
}

/* 角标：参考 index 的 MarkBox/insideBox，缩小尺寸适配浮动按钮 */
.global-draft-float-corner.corner-badge-MarkBox {
  width: 48px;
  height: 50px;
  overflow: hidden;
  position: absolute;
  top: -4px;
  right: -4px;
  z-index: 1;
  pointer-events: none;
}

.global-draft-float-corner .corner-badge-insideBox {
  line-height: 12px;
  text-align: center;
  transform: rotate(45deg);
  position: relative;
  padding: 4px 0;
  left: -8px;
  top: 14px;
  width: 72px;
  background: #e53935;
  color: var(--white, #fff);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.25);
  letter-spacing: 0.5px;
  font-size: 11px;
  font-weight: 600;
}

.global-draft-float-corner .corner-badge-insideBox::before,
.global-draft-float-corner .corner-badge-insideBox::after {
  content: '';
  border-top: 3px solid #b71c1c;
  border-left: 3px solid transparent;
  border-right: 3px solid transparent;
  position: absolute;
  bottom: -3px;
}

.global-draft-float-corner .corner-badge-insideBox::before {
  left: 0;
}

.global-draft-float-corner .corner-badge-insideBox::after {
  right: 0;
}

.float-fade-enter-active,
.float-fade-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}
.float-fade-enter-from,
.float-fade-leave-to {
  opacity: 0;
  transform: scale(0.9);
}

/* 抽屉与弹窗样式（与 SaveDraftBox 一致） */
.draft-drawer-mask {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 1000;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.4);
}

.draft-drawer {
  position: fixed;
  top: 0;
  right: 0;
  z-index: 1001;
  width: 360px;
  max-width: 90vw;
  height: 100%;
  background: var(--white, #fff);
  box-shadow: -2px 0 12px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
}

.draft-drawer-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--size-16, 16px) var(--size-20, 20px);
  border-bottom: 1px solid var(--border, #e8e8e8);
}

.draft-drawer-title {
  font-size: var(--fs-16, 16px);
  font-weight: 600;
  color: var(--title, #333);
}

.draft-drawer-close {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  padding: 0;
  border: none;
  background: transparent;
  cursor: pointer;
  color: var(--secondaryText, #666);
  border-radius: 4px;
}

.draft-drawer-close:hover {
  background: var(--border);
  color: var(--title);
}

.draft-drawer-body {
  flex: 1;
  overflow: auto;
  padding: var(--size-12, 12px);
}

.draft-save-current-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  width: 100%;
  margin-bottom: var(--size-12, 12px);
  padding: 10px 16px;
  font-size: 14px;
  color: var(--primary);
  background: transparent;
  border: 1px dashed var(--primary);
  border-radius: 8px;
  cursor: pointer;
}

.draft-save-current-btn:hover {
  background: rgba(var(--primary-rgb, 22, 119, 255), 0.08);
}

.draft-empty {
  padding: var(--size-40, 40px) var(--size-20, 20px);
  text-align: center;
  color: var(--secondaryText, #666);
  font-size: var(--fs-14, 14px);
}

.draft-list {
  display: flex;
  flex-direction: column;
  gap: var(--size-8, 8px);
}

.draft-card {
  display: flex;
  align-items: center;
  gap: var(--size-8, 8px);
  padding: var(--size-12, 12px);
  background: var(--background, #fafafa);
  border-radius: 8px;
  border: 1px solid var(--border, #e8e8e8);
}

.draft-card-type {
  flex-shrink: 0;
  width: 44px;
  font-size: 12px;
  color: var(--secondaryText, #666);
  text-align: center;
}

.draft-card-name {
  flex: 1;
  min-width: 0;
  font-size: var(--fs-14, 14px);
  color: var(--title, #333);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.draft-card-actions {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  gap: 8px;
}

.draft-card-edit {
  padding: 4px 12px;
  font-size: 12px;
  color: var(--primary);
  background: transparent;
  border: 1px solid var(--primary);
  border-radius: 4px;
  cursor: pointer;
}

.draft-card-edit:hover {
  background: var(--primary);
  color: #fff;
}

.draft-card-delete {
  padding: 4px 12px;
  font-size: 12px;
  color: var(--secondaryText, #666);
  background: transparent;
  border: 1px solid var(--border, #e8e8e8);
  border-radius: 4px;
  cursor: pointer;
}

.draft-card-delete:hover {
  color: var(--error, #f5222d);
  border-color: var(--error, #f5222d);
  background: rgba(245, 34, 45, 0.06);
}

.draft-save-modal-mask {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 2000;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.5);
}

.draft-save-modal {
  width: 440px;
  max-width: 90vw;
  background: var(--white, #fff);
  border-radius: 8px;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.15);
  overflow: hidden;
}

.draft-save-modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--size-16, 16px) var(--size-20, 20px);
  border-bottom: 1px solid var(--border, #e8e8e8);
}

.draft-save-modal-title {
  font-size: var(--fs-16, 16px);
  font-weight: 600;
  color: var(--title, #333);
}

.draft-save-modal-close {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  padding: 0;
  border: none;
  background: transparent;
  cursor: pointer;
  color: var(--secondaryText, #666);
  border-radius: 4px;
}

.draft-save-modal-close:hover {
  background: var(--border);
  color: var(--title);
}

.draft-save-modal-body {
  padding: var(--size-20, 20px);
}

.draft-save-label {
  display: block;
  margin-bottom: 8px;
  font-size: var(--fs-14, 14px);
  color: var(--title, #333);
}

.draft-save-input {
  width: 100%;
  padding: 8px 12px;
  font-size: 14px;
  border: 1px solid var(--border, #e8e8e8);
  border-radius: 4px;
  box-sizing: border-box;
}

.draft-save-input:focus {
  border-color: var(--primary);
  outline: none;
}

.draft-save-duplicate-tip {
  margin-top: 8px;
  margin-bottom: 0;
  font-size: var(--fs-12, 12px);
  color: var(--error, #f5222d);
  line-height: 1.4;
}

.draft-save-modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: var(--size-12, 12px);
  padding: var(--size-12, 12px) var(--size-20, 20px);
  border-top: 1px solid var(--border, #e8e8e8);
}

.draft-save-btn {
  padding: 8px 20px;
  font-size: 14px;
  border-radius: 4px;
  cursor: pointer;
}

.draft-save-cancel {
  color: var(--secondaryText, #666);
  background: transparent;
  border: 1px solid var(--border, #e8e8e8);
}

.draft-save-confirm {
  color: #fff;
  background: var(--primary);
  border: none;
}

.draft-save-cancel:hover,
.draft-save-confirm:hover {
  opacity: 0.9;
}

.draft-save-confirm:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.drawer-fade-enter-active,
.drawer-fade-leave-active {
  transition: opacity 0.2s ease;
}
.drawer-fade-enter-from,
.drawer-fade-leave-to {
  opacity: 0;
}

.drawer-slide-enter-active,
.drawer-slide-leave-active {
  transition: transform 0.25s ease;
}
.drawer-slide-enter-from,
.drawer-slide-leave-to {
  transform: translateX(100%);
}

.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.2s ease;
}
.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}
</style>
