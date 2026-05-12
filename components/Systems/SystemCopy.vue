<script setup lang="ts">
// 定义组件属性
const props = defineProps({
    // 复制的内容
    content: {
        type: String,
        default: ''
    },
    // 提示文字
    message: {
        type: String,
        default: '名称复制成功!前往公众号回复'
    }
});
</script>
<!-- 使用示例
<SystemCopy v-if="showCopyTip" content="关键词" message="名称复制成功!前往公众号回复" />
复制提示浮层：传入 content 与 message，需由父组件控制显示（如复制成功后展示）。
-->
<!-- 复制组件 -->
<template>
    <div class="copy-box">
        <div class="copy-container">
            <!-- 动态内容 -->
            <p class="copy-text">"{{ content }}"</p>
            <!-- 固定提示文字 -->
            <p>{{ message }}</p>
        </div>

    </div>
</template>
<style scoped lang="less">
.copy-box {
    position: fixed;
    top: 24%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: rgba(0, 0, 0, 0.8);
    color: var(--white);
    padding: 0.6rem 2rem;
    border-radius: var(--size-8);
    font-size: 14px;
    font-weight: bold;
    z-index: 9999;
    animation: fadeInOut 3s ease;

    .copy-container {
        display: flex;
        align-items: center;

        .copy-text {
            margin-right: 0.5rem;
        }
    }
}

@keyframes fadeInOut {
    0% {
        opacity: 0;
        transform: translate(-50%, -50%) scale(0.8);
    }

    20% {
        opacity: 1;
        transform: translate(-50%, -50%) scale(1);
    }

    80% {
        opacity: 1;
        transform: translate(-50%, -50%) scale(1);
    }

    100% {
        opacity: 0;
        transform: translate(-50%, -50%) scale(0.8);
    }
}
</style>
