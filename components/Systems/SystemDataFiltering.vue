<script setup lang="ts">
import { ref, computed, watch, nextTick, onMounted } from "vue";

interface CategoryItem {
  name: string;
  value: string;
}

const props = withDefaults(
  defineProps<{
    categories?: CategoryItem[];
    modelValue?: string;
    data?: any[];
    categoryField?: string;
    allLabel?: string;
    allValue?: string;
  }>(),
  {
    categories: () => [],
    modelValue: "全部",
    data: () => [],
    categoryField: "type",
    allLabel: "全部",
    allValue: "全部",
  },
);

const emit = defineEmits<{
  (e: "update:modelValue", value: string): void;
  (e: "filtered", data: any[]): void;
}>();

const activeCategory = ref(props.modelValue);
const categoryContainer = ref<HTMLElement | null>(null);
const touchStartX = ref(0);
const touchStartScrollLeft = ref(0);
const isDragging = ref(false);

const autoCategories = computed(() => {
  const result: CategoryItem[] = [];

  if (props.categories && props.categories.length > 0) {
    return props.categories;
  }

  result.push({ name: props.allLabel, value: props.allValue });

  if (props.data && props.data.length > 0) {
    const types = new Set<string>();
    for (let i = 0; i < props.data.length; i++) {
      types.add(props.data[i][props.categoryField]);
    }
    const typeArray = Array.from(types);
    for (let i = 0; i < typeArray.length; i++) {
      result.push({ name: typeArray[i], value: typeArray[i] });
    }
  }

  return result;
});

const filteredData = computed(() => {
  if (!props.data || props.data.length === 0) {
    return [];
  }
  if (activeCategory.value === props.allValue) {
    return props.data;
  }
  return props.data.filter(
    (item) => item[props.categoryField] === activeCategory.value,
  );
});

const handleCategoryClick = (category: CategoryItem) => {
  if (isDragging.value) return;
  activeCategory.value = category.value;
  emit("update:modelValue", category.value);
  emit("filtered", filteredData.value);

  nextTick(() => {
    scrollToCategory(category.value);
  });
};

const scrollToCategory = (categoryValue: string) => {
  if (!categoryContainer.value) return;

  const categoryIndex = autoCategories.value.findIndex(
    (cat) => cat.value === categoryValue,
  );
  if (categoryIndex === -1) return;

  const buttons = categoryContainer.value.querySelectorAll(
    ".category-btn",
  ) as NodeListOf<HTMLElement>;
  const targetButton = buttons[categoryIndex];

  if (targetButton) {
    const containerWidth = categoryContainer.value.offsetWidth;
    const buttonWidth = targetButton.offsetWidth;
    const buttonLeft = targetButton.offsetLeft;

    const scrollLeft = buttonLeft - containerWidth / 2 + buttonWidth / 2;
    categoryContainer.value.scrollTo({
      left: scrollLeft,
      behavior: "smooth",
    });
  }
};

const handleTouchStart = (e: TouchEvent) => {
  isDragging.value = false;
  touchStartX.value = e.touches[0].clientX;
  if (categoryContainer.value) {
    touchStartScrollLeft.value = categoryContainer.value.scrollLeft;
  }
};

const handleTouchMove = (e: TouchEvent) => {
  if (!categoryContainer.value) return;
  const touchX = e.touches[0].clientX;
  const diff = touchStartX.value - touchX;
  if (Math.abs(diff) > 5) {
    isDragging.value = true;
  }
  categoryContainer.value.scrollLeft = touchStartScrollLeft.value + diff;
};

const handleTouchEnd = () => {
  setTimeout(() => {
    isDragging.value = false;
  }, 100);
};

watch(
  () => props.modelValue,
  (newValue) => {
    activeCategory.value = newValue;
  },
);

watch(
  filteredData,
  (newData) => {
    emit("filtered", newData);
  },
  { immediate: true },
);

onMounted(() => {
  nextTick(() => {
    scrollToCategory(activeCategory.value);
  });
});
</script>
<!-- 使用示例
<SystemDataFiltering
  v-model="selectedCategory"
  :data="list"
  categoryField="type"
  allLabel="全部"
  allValue="全部"
  @filtered="handleFiltered"
/>
支持 v-model 绑定当前分类，传入 data 与 categoryField 可自动生成分类；或传 categories 手动指定。@filtered 返回筛选后的数据。
-->
<template>
  <div class="DataFiltering">
    <div
      class="category-container"
      ref="categoryContainer"
      @touchstart="handleTouchStart"
      @touchmove="handleTouchMove"
      @touchend="handleTouchEnd"
    >
      <button
        v-for="category in autoCategories"
        :key="category.value"
        class="category-btn"
        :class="{ active: activeCategory === category.value }"
        @click="handleCategoryClick(category)"
      >
        <p class="category-name">{{ category.name }}</p>
        <p v-if="activeCategory === category.value" class="line"></p>
      </button>
    </div>
  </div>
</template>

<style scoped lang="less">
.DataFiltering {
  width: 100%;
  height: var(--size-48);
  background: var(--background);
  display: flex;
  flex-direction: row;
  align-items: center;
  font-size: 14px;
  color: var(--title);
  padding: 0 10px;
  justify-content: center;

  .category-container {
    width: 100%;
    max-width: 100%;
    display: flex;
    align-items: center;
    overflow-x: auto;
    scrollbar-width: none;
    -ms-overflow-style: none;
    -webkit-overflow-scrolling: touch;
    scroll-behavior: smooth;

    &::-webkit-scrollbar {
      display: none;
    }
  }

  .category-btn {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background: none;
    border: none;
    cursor: pointer;
    font-size: 14px;
    color: var(--title);
    min-width: 80px;
    flex-shrink: 0;

    .category-name {
      font-size: 14px;
      color: var(--title);
    }

    .line {
      width: var(--size-16);
      height: 3px;
      background-color: var(--primary);
      border-radius: 0.2rem;
    }
  }

  @media (min-width: 1024px) {
    padding: 0;

    .category-container {
      width: auto;
      overflow-x: visible;
      justify-content: center;
    }
  }
}
</style>
