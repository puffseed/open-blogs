<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";

/** 能力树节点：带 label + items 的叶子分组 */
interface SkillGroup {
  label: string;
  items: string[];
}

/** 能力树节点：带 branchLabel + nodes 的分支 */
interface SkillBranch {
  branchLabel: string;
  nodes: (SkillGroup | SkillBranch)[];
}

type SkillNode = SkillGroup | SkillBranch;

function isBranch(node: SkillNode): node is SkillBranch {
  return "branchLabel" in node && "nodes" in node;
}

interface TreeSide {
  mainLabel: string;
  nodes: SkillNode[];
}

interface MasterSkillsData {
  treeTitle: string;
  left: TreeSide;
  right: TreeSide;
}

const props = defineProps<{
  data?: MasterSkillsData | null;
}>();

const treeData = ref<MasterSkillsData | null>(null);

onMounted(async () => {
  document.addEventListener("click", handleClickOutside);
  if (props.data) {
    treeData.value = props.data;
    return;
  }
  try {
    const res = await import("~/json/homeData.json");
    const module = res.default?.modules?.find(
      (m: any) => m.type === "masterSkills",
    );
    const data = module?.data;
    if (
      data &&
      typeof data === "object" &&
      "treeTitle" in data &&
      "left" in data &&
      "right" in data
    ) {
      treeData.value = data as MasterSkillsData;
    }
  } catch {
    treeData.value = null;
  }
});

/** 枝条处默认展示 2 条，超过 2 条用省略号 */
const maxVisibleItems = 2;
const displayItems = (items: string[]) => items.slice(0, maxVisibleItems);
const hasMoreItems = (items: string[]) => items.length > maxVisibleItems;

/** 当前展开的“更多”浮层 key，用于切换 icon-hide/icon-show 与显示全部内容 */
const expandedKey = ref<string | null>(null);
function toggleExpand(key: string) {
  expandedKey.value = expandedKey.value === key ? null : key;
}

/** 点击空白处关闭悬浮框 */
function handleClickOutside(event: MouseEvent) {
  if (!expandedKey.value) return;
  const el = event.target as Element;
  if (el.closest?.(".master-skills .item-more-wrap")) return;
  expandedKey.value = null;
}

onUnmounted(() => {
  document.removeEventListener("click", handleClickOutside);
});
</script>

<!-- 能力树（枝干） - 第一版：左右分栏 + 中央树干 -->
<template>
  <div class="master-skills">
    <div v-if="treeData" class="tree-wrapper">
      <!-- 左侧：核心素质 -->
      <div class="side side-left">
        <div class="main-bubble">{{ treeData.left.mainLabel }}</div>
        <div class="branch-line branch-line-left" aria-hidden="true"></div>
        <div class="nodes-column">
          <template
            v-for="(node, idx) in treeData.left.nodes"
            :key="'left-' + idx"
          >
            <!-- 分支（可迁移能力） -->
            <template v-if="isBranch(node)">
              <div class="branch-label">{{ node.branchLabel }}</div>
              <div class="sub-nodes">
                <template
                  v-for="(sub, si) in node.nodes"
                  :key="'left-' + idx + '-' + si"
                >
                  <div v-if="!isBranch(sub)" class="node-block">
                    <div class="category-bubble">{{ sub.label }}</div>
                    <div class="items-row">
                      <span
                        v-for="(item, i) in displayItems(sub.items)"
                        :key="i"
                        class="item-text"
                        >{{ item }}</span
                      >
                      <span
                        v-if="hasMoreItems(sub.items)"
                        class="item-more-wrap hand"
                        @click.stop="toggleExpand(`left-b-${idx}-${si}`)"
                      >
                        <i
                          class="iconfont"
                          :class="
                            expandedKey === `left-b-${idx}-${si}`
                              ? 'icon-show'
                              : 'icon-hide'
                          "
                        ></i>
                        <div
                          v-if="expandedKey === `left-b-${idx}-${si}`"
                          class="item-popover"
                          @click.stop
                        >
                          <p
                            v-for="(it, i) in sub.items"
                            :key="i"
                            class="item-popover-text"
                          >
                            {{ it }}
                          </p>
                        </div>
                      </span>
                    </div>
                  </div>
                </template>
              </div>
            </template>
            <!-- 叶子分组（先天决定、后天形成） -->
            <div v-else class="node-block">
              <div class="category-bubble">{{ node.label }}</div>
              <div class="items-row">
                <span
                  v-for="(item, i) in displayItems(node.items)"
                  :key="i"
                  class="item-text"
                  >{{ item }}</span
                >
                <span
                  v-if="hasMoreItems(node.items)"
                  class="item-more-wrap hand"
                  @click.stop="toggleExpand(`left-l-${idx}`)"
                >
                  <i
                    class="iconfont"
                    :class="
                      expandedKey === `left-l-${idx}`
                        ? 'icon-show'
                        : 'icon-hide'
                    "
                  ></i>
                  <div
                    v-if="expandedKey === `left-l-${idx}`"
                    class="item-popover"
                    @click.stop
                  >
                    <span
                      v-for="(it, i) in node.items"
                      :key="i"
                      class="item-popover-text"
                      >{{ it }}</span
                    >
                  </div>
                </span>
              </div>
            </div>
          </template>
        </div>
      </div>

      <!-- 中央树干 -->
      <div class="trunk">
        <div class="trunk-line" aria-hidden="true"></div>
        <div class="trunk-label">{{ treeData.treeTitle }}</div>
      </div>

      <!-- 右侧：必备知识 -->
      <div class="side side-right">
        <div class="main-bubble">{{ treeData.right.mainLabel }}</div>
        <div class="branch-line branch-line-right" aria-hidden="true"></div>
        <div class="nodes-column">
          <template
            v-for="(node, idx) in treeData.right.nodes"
            :key="'right-' + idx"
          >
            <template v-if="isBranch(node)">
              <div class="branch-label">{{ node.branchLabel }}</div>
              <div class="sub-nodes">
                <template
                  v-for="(sub, si) in node.nodes"
                  :key="'right-' + idx + '-' + si"
                >
                  <div v-if="!isBranch(sub)" class="node-block">
                    <div class="category-bubble">{{ sub.label }}</div>
                    <div class="items-row">
                      <span
                        v-for="(item, i) in displayItems(sub.items)"
                        :key="i"
                        class="item-text"
                        >{{ item }}</span
                      >
                      <span
                        v-if="hasMoreItems(sub.items)"
                        class="item-more-wrap hand"
                        @click.stop="toggleExpand(`right-b-${idx}-${si}`)"
                      >
                        <i
                          class="iconfont"
                          :class="
                            expandedKey === `right-b-${idx}-${si}`
                              ? 'icon-show'
                              : 'icon-hide'
                          "
                        ></i>
                        <div
                          v-if="expandedKey === `right-b-${idx}-${si}`"
                          class="item-popover"
                          @click.stop
                        >
                          <p
                            v-for="(it, i) in sub.items"
                            :key="i"
                            class="item-popover-text"
                          >
                            {{ it }}
                          </p>
                        </div>
                      </span>
                    </div>
                  </div>
                </template>
              </div>
            </template>
            <div v-else class="node-block">
              <div class="category-bubble">{{ node.label }}</div>
              <div class="items-row">
                <span
                  v-for="(item, i) in displayItems(node.items)"
                  :key="i"
                  class="item-text"
                  >{{ item }}</span
                >
                <span
                  v-if="hasMoreItems(node.items)"
                  class="item-more-wrap hand"
                  @click.stop="toggleExpand(`right-l-${idx}`)"
                >
                  <i
                    class="iconfont"
                    :class="
                      expandedKey === `right-l-${idx}`
                        ? 'icon-show'
                        : 'icon-hide'
                    "
                  ></i>
                  <div
                    v-if="expandedKey === `right-l-${idx}`"
                    class="item-popover"
                    @click.stop
                  >
                    <p
                      v-for="(it, i) in node.items"
                      :key="i"
                      class="item-popover-text"
                    >
                      {{ it }}
                    </p>
                  </div>
                </span>
              </div>
            </div>
          </template>
        </div>
      </div>
    </div>
    <div v-else class="tree-loading">加载中...</div>
  </div>
</template>

<style scoped lang="less">
.master-skills {
  width: 100%;
  padding: var(--size-24) var(--size-16);

  .tree-wrapper {
    margin: var(--size-24) 0;
    display: flex;
    align-items: stretch;
    justify-content: space-between;
    gap: var(--size-16);
    min-height: 360px;
    position: relative;
  }

  .side {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    max-width: 48%;

    .main-bubble {
      padding: var(--size-8) var(--size-16);
      background-color: var(--success);
      color: var(--white);
      font-size: var(--fs-14);
      font-weight: bold;
      border-radius: var(--size-100);
      white-space: nowrap;
      transform: rotate(-8deg);
      margin-bottom: var(--size-8);
    }

    .branch-line {
      width: 60%;
      height: var(--size-1);
      background: var(--border);
      margin-bottom: var(--size-12);
    }

    .branch-line-left {
      align-self: flex-end;
    }

    .branch-line-right {
      align-self: flex-start;
    }

    .nodes-column {
      display: flex;
      flex-direction: column;
      gap: var(--size-16);
      width: 100%;
    }

    .branch-label {
      font-size: var(--fs-14);
      color: var(--title);
      font-weight: 600;
      margin-bottom: var(--size-4);
    }

    .sub-nodes {
      display: flex;
      flex-direction: column;
      gap: var(--size-12);
      margin-left: var(--size-12);
    }

    .node-block {
      display: flex;
      flex-direction: column;
      gap: var(--size-6);
    }

    .category-bubble {
      display: inline-block;
      padding: var(--size-4) var(--size-12);
      background-color: var(--success);
      color: var(--white);
      font-size: var(--fs-12);
      font-weight: bold;
      border-radius: var(--size-100);
      white-space: nowrap;
      width: fit-content;
      transform: rotate(-6deg);
    }

    .items-row {
      display: flex;
      flex-wrap: wrap;
      gap: var(--size-4) var(--size-12);
      font-size: var(--fs-14);
    }

    .item-text {
      color: var(--secondaryText);
    }

    .item-more-wrap {
      position: relative;
      display: inline-flex;
      align-items: center;
      color: var(--secondaryText);
      .iconfont {
        font-size: var(--fs-16);
      }
      .item-popover {
        position: absolute;
        bottom: calc(100% + 8px);
        left: 50%;
        transform: translateX(-50%);
        padding: var(--size-8) var(--size-12);
        background: var(--white);
        border: var(--solid);
        border-radius: var(--size-8);
        box-shadow: var(--shadow);
        z-index: 100;
        display: flex;
        flex-direction: column;
        gap: var(--size-4);
        .item-popover-text {
          width: 100%;
          font-size: var(--fs-12);
          color: var(--title);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
      }
    }

    .item-ellipsis {
      color: var(--secondaryText);
    }
  }

  .side-left {
    align-items: flex-end;
    text-align: right;

    .nodes-column {
      align-items: flex-end;
    }

    .sub-nodes {
      margin-left: 0;
      margin-right: var(--size-12);
    }

    .category-bubble {
      align-self: flex-end;
    }

    .item-more-wrap .item-popover {
      left: auto;
      right: 0;
      transform: none;
    }
  }

  .side-right {
    align-items: flex-start;
    text-align: left;

    .nodes-column {
      align-items: flex-start;
    }

    .item-more-wrap .item-popover {
      left: 0;
      right: auto;
      transform: none;
    }
  }

  .trunk {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-end;
    min-width: 60px;
    flex-shrink: 0;

    .trunk-line {
      flex: 1;
      width: var(--size-1);
      min-height: 80px;
      background-color: var(--border);
      margin-bottom: var(--size-8);
    }

    .trunk-label {
      font-size: var(--fs-16);
      font-weight: bold;
      color: var(--success);
      white-space: nowrap;
    }
  }

  .tree-loading {
    min-height: 320px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--secondaryText);
    font-size: var(--fs-14);
  }
}
</style>
