<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import CardLayout from "~/components/Cards/CardLayout.vue";
import { csdnRssConfig } from "../../config/csdn-rss.config";

/** 通过服务端代理请求（数据源见 config/csdn-rss.config.ts），避免 CORS */
const RSS_API = "/api/csdn-rss";

/** 订阅列表最多显示条数，第 10 条为固定「更多订阅」 */
const MAX_RSS_ITEMS = 8;

interface RssItem {
  title: string;
  link: string;
  author: string;
  pubDate: string;
  description: string;
}

const list = ref<RssItem[]>([]);
const loading = ref(true);
const error = ref("");

/** 第 10 条固定卡片：「更多订阅」 */
const moreSubscribeItem = computed<RssItem>(() => ({
  title: "更多订阅",
  link: csdnRssConfig.blogUrl,
  author: "波仔椿",
  pubDate: new Date().toISOString(),
  description:
    '波仔椿,UI设计师,AIGC方向,专注于用户体验设计。提供专业的色彩库、应用库和作品集,致力于创造"看不见的优秀设计!"',
}));

/** 展示列表：前 9 条订阅 + 第 10 条固定卡片 */
const displayList = computed<RssItem[]>(() => {
  const slice = list.value.slice(0, MAX_RSS_ITEMS);
  return [...slice, moreSubscribeItem.value];
});

function getText(el: Element | null): string {
  if (!el) return "";
  return (el.textContent || "").trim();
}

/** 从 description 中截取纯文本摘要，去除 HTML 标签 */
function stripHtml(html: string, maxLen = 120): string {
  const div = document.createElement("div");
  div.innerHTML = html;
  const text = (div.textContent || div.innerText || "").trim();
  return text.length > maxLen ? text.slice(0, maxLen) + "…" : text;
}

/** 格式化发布日期显示 */
function formatDate(pubDate: string): string {
  if (!pubDate) return "";
  try {
    const d = new Date(pubDate);
    return d.toLocaleDateString("zh-CN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  } catch {
    return pubDate;
  }
}

async function loadRss() {
  loading.value = true;
  error.value = "";
  try {
    const res = await fetch(RSS_API);
    const xml = await res.text();
    if (!res.ok) {
      try {
        const err = JSON.parse(xml);
        throw new Error(err.error || `请求失败: ${res.status}`);
      } catch (e) {
        if (e instanceof Error && e.message !== "请求失败") throw e;
        throw new Error(`请求失败: ${res.status}`);
      }
    }
    const parser = new DOMParser();
    const doc = parser.parseFromString(xml, "text/xml");
    const parseError = doc.querySelector("parsererror");
    if (parseError) {
      throw new Error("RSS 数据解析失败");
    }
    const items = doc.querySelectorAll("channel > item");
    const result: RssItem[] = [];
    items.forEach((item) => {
      const title = getText(item.querySelector("title"));
      const link = getText(item.querySelector("link")) || "";
      if (!title && !link) return;
      result.push({
        title,
        link,
        author: getText(item.querySelector("author")),
        pubDate: getText(item.querySelector("pubDate")),
        description: stripHtml(
          getText(item.querySelector("description")) || "",
        ),
      });
    });
    list.value = result;
  } catch (e) {
    error.value = e instanceof Error ? e.message : "加载 RSS 失败";
    list.value = [];
  } finally {
    loading.value = false;
  }
}

onMounted(() => {
  loadRss();
});
</script>
<!-- CSDN RSS 组件 -->
<template>
  <div class="csdn-rss">
    <!-- 卡片布局 -->
    <CardLayout
      :largeCols="3"
      :webCols="3"
      :tabletCols="2"
      :mobileCols="1"
      gap="1.5rem"
    >
      <template v-if="loading">
        <div class="rss-loading">加载中…</div>
      </template>
      <template v-else-if="error">
        <div class="rss-error">{{ error }}</div>
      </template>
      <template v-else>
        <a
          v-for="(item, index) in displayList"
          :key="item.link + '-' + index"
          class="card"
          :href="item.link"
          target="_blank"
          rel="noopener noreferrer"
        >
          <div class="card-cover">
            <i class="iconfont icon-csdn"></i>
          </div>
          <div class="card-body">
            <p class="title" :title="item.title">{{ item.title }}</p>
            <div class="meta">
              <span v-if="item.author">{{ item.author }}</span>
              <span v-if="item.pubDate" class="date">{{
                formatDate(item.pubDate)
              }}</span>
            </div>
            <p v-if="item.description" class="desc" :title="item.description">
              {{ item.description }}
            </p>
          </div>
        </a>
      </template>
    </CardLayout>
  </div>
</template>

<style scoped lang="less">
.csdn-rss {
  .rss-loading,
  .rss-error {
    grid-column: 1 / -1;
    text-align: center;
    padding: 2rem;
    color: var(--mainText3);
  }

  .rss-error {
    color: var(--error);
  }

  .card {
    display: flex;
    align-items: stretch;
    padding: 0;
    background: var(--background);
    border-radius: var(--size-12);
    border: 1px solid var(--border);
    width: 100%;
    min-width: 0;
    overflow: hidden;
    text-decoration: none;
    color: inherit;
    transition: box-shadow 0.2s ease;
    box-sizing: border-box;

    &:hover {
      background: var(--white);
      border: 1px solid var(--error-border);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
    }

    .card-cover {
      flex-shrink: 0;
      width: 80px;
      min-height: 72px;
      display: flex;
      align-items: center;
      justify-content: center;

      .iconfont {
        font-size: 44px;
        color: var(--error-hover);
      }
    }

    .card-body {
      flex: 1;
      min-width: 0;
      padding: 1rem 1.25rem;
      display: flex;
      flex-direction: column;
      justify-content: center;
    }

    .title {
      font-size: 15px;
      font-weight: 600;
      color: var(--title);
      margin: 0 0 0.5rem;
      line-height: 1.4;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      min-width: 0;
      text-decoration: none;
      transition: text-decoration-color 0.2s ease;
    }

    &:hover .title {
      color: var(--error-hover);
      text-decoration: underline;
      text-decoration-color: var(--error);
    }

    .meta {
      font-size: var(--fs-12);
      color: var(--secondaryText);
      margin-bottom: 0.25rem;

      .date {
        margin-left: 0.5rem;
      }
    }

    .desc {
      font-size: 13px;
      color: var(--secondaryText);
      margin: 0;
      line-height: 1.5;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      min-width: 0;
    }
  }
}
</style>
