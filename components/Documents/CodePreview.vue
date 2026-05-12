<script setup lang="ts">
import { ref, onMounted, watch, nextTick } from 'vue';
import hljs from 'highlight.js';
import 'highlight.js/styles/atom-one-dark.css';

interface Props {
  src: string;
  height: string;
  language?: string;
}

const props = withDefaults(defineProps<Props>(), {
  language: ''
});

const codeContent = ref('');
const isLoading = ref(true);
const error = ref('');

// 加载代码内容
const loadCodeContent = async () => {
  try {
    isLoading.value = true;
    error.value = '';
    const response = await fetch(props.src);
    if (!response.ok) {
      throw new Error('Failed to load code');
    }
    codeContent.value = await response.text();
  } catch (err) {
    error.value = '加载代码失败，请重试';
    console.error('Error loading code:', err);
  } finally {
    isLoading.value = false;
    // 代码加载完成后高亮显示
    highlightCode();
  }
};

// 高亮代码
const highlightCode = () => {
  nextTick(() => {
    document.querySelectorAll('pre code').forEach((block) => {
      hljs.highlightElement(block as HTMLElement);
    });
  });
};

// 监听src变化，重新加载代码
watch(() => props.src, () => {
  loadCodeContent();
});

// 组件挂载时加载代码
onMounted(() => {
  loadCodeContent();
});
</script>

<template>
  <div class="code-preview" :style="{ height: height }">
    <div v-if="isLoading" class="code-preview-loading">
      <div class="loading-spinner"></div>
      <span>加载中...</span>
    </div>
    <div v-else-if="error" class="code-preview-error">
      {{ error }}
      <button @click="loadCodeContent" class="retry-button">重试</button>
    </div>
    <div v-else class="code-preview-content">
      <pre class="code-preview-code"><code :class="'language-' + language">{{ codeContent }}</code></pre>
    </div>
  </div>
</template>

<style scoped lang="less">
.code-preview {
  width: 100%;
  height: 100%;
  background: var(--background);
  overflow: hidden;
  display: flex;
  flex-direction: column;

  &-loading {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100%;
    color: #abb2bf;

    .loading-spinner {
      width: 40px;
      height: 40px;
      border: 4px solid rgba(255, 255, 255, 0.1);
      border-radius: 50%;
      border-top-color: #61afef;
      animation: spin 1s ease-in-out infinite;
      margin-bottom: 16px;
    }

    @keyframes spin {
      to { transform: rotate(360deg); }
    }
  }

  &-error {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100%;
    color: #e06c75;
    padding: 24px;
    text-align: center;

    .retry-button {
      margin-top: 16px;
      padding: 8px 16px;
      background: #61afef;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;

      &:hover {
        background: #56b6c2;
      }
    }
  }

  &-content {
    flex: 1;
    overflow: auto;
  }

  &-code {
    margin: 0;
    padding: 16px;
    overflow: auto;
    height: 100%;
    font-family: 'Consolas', 'Monaco', 'Courier New', monospace;
    font-size: 14px;
    line-height: 1.5;
    color: #abb2bf;

    code {
      background: none;
      padding: 0;
    }
  }
}
</style>

<!-- 使用示例 -->
<!-- <CodePreview src="/api/document?path=./documents/Code/ThemeVariable.css" height="calc(100vh - 100px)" language="css" @download="handleDownload" /> -->
