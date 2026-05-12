<script setup lang="ts">
import { ref, computed } from 'vue';
import MarkdownPreview from '~/components/Documents/MarkdownPreview.vue';
import SystemCopyright from "~/components/Systems/SystemCopyright.vue";
const router = useRouter();

const markdownContent = ref('');

const documentTitle = ref('工作台');

const downloadDocument = () => {
    const content = markdownContent.value;
    const filename = `${documentTitle.value}.md`;
    const mimeType = 'text/markdown';
    const blob = new Blob([content], { type: mimeType });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(a.href);
};

const goBack = () => {
    router.push('/');
};
</script>

<template>
    <div class="document-editing">
        <div class="document-editing-header">
            <div class="document-editing-header-left">
                <button class="op-btn op-btn-back" title="返回" @click="goBack">
                    <i class="iconfont icon-Back"></i>
                </button>
            </div>
            <div class="document-editing-header-center">
                <p class="document-editing-title">{{ documentTitle }}</p>
            </div>
            <div class="document-editing-header-right">
                <button class="op-btn op-btn-gap" title="下载文档" @click="downloadDocument">
                    <i class="iconfont icon-Download"></i>
                </button>
            </div>
        </div>
        <div class="document-editing-content">
            <MarkdownPreview v-model:text="markdownContent" type="codemirror" mode="editable"
                height="calc(100vh - 100px)" />
        </div>
        <!-- 底部栏 -->
        <div class="open-detail-footer">
            <SystemCopyright />
        </div>
    </div>
</template>

<style scoped lang="less">
.document-editing {
    width: 100%;
    height: 100%;
    min-height: 100vh;

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

    .document-editing-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: var(--size-12) var(--size-16);
        background-color: var(--white);
        border-bottom: 1px solid var(--border);

        .document-editing-header-left {
            .op-btn {
                display: flex;
                align-items: center;
                gap: var(--size-8);
            }
        }

        .document-editing-header-center {
            display: flex;
            flex: 1;
            text-align: start;
            margin: 0 var(--size-12);

            .document-editing-title {
                font-size: var(--fs-16);
                font-weight: normal;
                color: var(--title);
                margin: 0;
            }
        }

        .document-editing-header-right {
            display: flex;
            align-items: center;

            .op-btn {
                display: flex;
                align-items: center;
                gap: var(--size-8);
                margin-left: var(--size-12);
            }
        }
    }

    .document-editing-content {
        margin: 0 auto;
        max-width: 100%;
        min-height: 400px;
    }
}

.op-btn {
    width: var(--size-24);
    height: var(--size-24);
    display: flex;
    align-items: center;
    justify-content: center;
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



@media (max-width: 768px) {
    .document-editing {
        .document-editing-header {
            padding: var(--size-12) var(--size-16);

            .document-editing-header-center {
                margin: 0 var(--size-16);

                .document-editing-title {
                    font-size: var(--fs-16);
                }
            }

            .document-editing-header-right {
                .op-btn {
                    font-size: var(--fs-12);

                    .iconfont {
                        font-size: var(--fs-14);
                    }
                }
            }
        }
    }
}
</style>
