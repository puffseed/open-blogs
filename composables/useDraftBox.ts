/**
 * 草稿箱：数据存 localStorage，key = ResourceLibrary_draftList
 * 关闭浏览器后再打开仍可看到；用户清理缓存后草稿消失。
 */
import { ref, computed } from "vue";

const STORAGE_KEY = "ResourceLibrary_draftList";

export type DraftFileType = "TXT" | "MD" | "HTML" | "Word" | "Excel" | "PDF";

export interface DraftItem {
  id: string;
  title: string;
  fileType: DraftFileType;
  content: string;
  documentPath?: string;
  documentId?: string;
  updatedAt: number;
}

function loadFromStorage(): DraftItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const list = JSON.parse(raw) as DraftItem[];
    return Array.isArray(list) ? list : [];
  } catch {
    return [];
  }
}

function saveToStorage(list: DraftItem[]) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  } catch {
    /* ignore */
  }
}

// 单例：全应用共享同一草稿状态
const drafts = ref<DraftItem[]>([]);
const drawerVisible = ref(false);
const saveModalVisible = ref(false);
const saveModalData = ref<{
  title: string;
  content: string;
  fileType: DraftFileType;
  documentPath?: string;
  documentId?: string;
} | null>(null);
const saveModalTitleInput = ref("");

/** 当前页面传入的文档（如 openDetail 编辑模式），供抽屉内「保存当前文档」使用 */
const currentDocumentRef = ref<{
  title: string;
  content: string;
  fileType: DraftFileType;
  documentPath?: string;
  documentId?: string;
} | null>(null);

let initialized = false;
function ensureInit() {
  if (initialized || typeof window === "undefined") return;
  drafts.value = loadFromStorage();
  initialized = true;
}

export function useDraftBox() {
  ensureInit();

  const draftCount = computed(() => drafts.value.length);

  function syncStorage() {
    saveToStorage(drafts.value);
  }

  function addDraft(item: Omit<DraftItem, "id" | "updatedAt">) {
    const draft: DraftItem = {
      ...item,
      id: `draft_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`,
      updatedAt: Date.now(),
    };
    drafts.value = [draft, ...drafts.value];
    syncStorage();
    return draft.id;
  }

  function removeDraft(id: string) {
    drafts.value = drafts.value.filter((d) => d.id !== id);
    syncStorage();
  }

  function getDraftById(id: string): DraftItem | undefined {
    return drafts.value.find((d) => d.id === id);
  }

  function openDrawer() {
    drafts.value = loadFromStorage();
    drawerVisible.value = true;
  }

  function closeDrawer() {
    drawerVisible.value = false;
  }

  /** 从 localStorage 重新加载草稿列表，保证角标与列表数量一致（路由返回等场景） */
  function refreshFromStorage() {
    if (typeof window === "undefined") return;
    drafts.value = loadFromStorage();
  }

  function setCurrentDocument(doc: typeof currentDocumentRef.value) {
    currentDocumentRef.value = doc;
  }

  function openSaveModal(data: {
    title: string;
    content: string;
    fileType: DraftFileType;
    documentPath?: string;
    documentId?: string;
  }) {
    saveModalData.value = data;
    saveModalTitleInput.value = data.title || "";
    saveModalVisible.value = true;
  }

  function closeSaveModal() {
    saveModalVisible.value = false;
    saveModalData.value = null;
    saveModalTitleInput.value = "";
  }

  function confirmSave(titleOverride?: string) {
    const data = saveModalData.value;
    if (!data) return;
    const title = (titleOverride ?? saveModalTitleInput.value).trim() || data.title || "未命名";
    addDraft({
      title,
      content: data.content,
      fileType: data.fileType,
      documentPath: data.documentPath,
      documentId: data.documentId,
    });
    closeSaveModal();
  }

  return {
    drafts,
    draftCount,
    drawerVisible,
    saveModalVisible,
    saveModalData,
    saveModalTitleInput,
    currentDocumentRef,
    addDraft,
    removeDraft,
    getDraftById,
    openDrawer,
    closeDrawer,
    refreshFromStorage,
    setCurrentDocument,
    openSaveModal,
    closeSaveModal,
    confirmSave,
    syncStorage,
  };
}
