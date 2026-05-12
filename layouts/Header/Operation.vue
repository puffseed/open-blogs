<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from "vue";
import { useCounterStore } from "../../stores/counter";
import { socialConfig, type SocialItem } from "../../config/OperationSet";

const router = useRouter();
const counterStore = useCounterStore();

const isMobile = ref(false);

const checkIfMobile = () => {
  isMobile.value = window.innerWidth <= 768;
};

const handleModalClick = (item: SocialItem) => {
  if (item.name === "weixin") {
    counterStore.showWechatQRCodeModal();
  } else if (item.name === "Set") {
    counterStore.showSettingsModal();
  }
};

const handleItemClick = (item: SocialItem, event: Event) => {
  if (item.type === "modal") {
    event.preventDefault();
    handleModalClick(item);
  } else if (item.type === "internal" && item.path) {
    event.preventDefault();
    router.push(item.path);
  }
};

onMounted(() => {
  checkIfMobile();
  window.addEventListener("resize", checkIfMobile);
});

onUnmounted(() => {
  window.removeEventListener("resize", checkIfMobile);
});

const filteredSocialItems = computed(() => {
  const displayItems = isMobile.value ? socialConfig.mobileItems : socialConfig.webItems;
  return socialConfig.items.filter((item) => displayItems.includes(item.name));
});
</script>
<template>
  <div class="social-container">
    <a
      v-for="item in filteredSocialItems"
      :key="item.name"
      :href="item.type === 'external' ? item.href : ''"
      :target="item.type === 'external' ? '_blank' : ''"
      :rel="item.type === 'external' ? 'noopener noreferrer' : ''"
      :class="['social-icon', 'iconfont', `icon-${item.iconName}`]"
      :title="item.text"
      @click="(event) => handleItemClick(item, event)"
    ></a>
  </div>
</template>
<style scoped lang="less">
.social-container {
  display: flex;
  align-items: center;
  color: inherit;
  position: relative;

  .social-icon {
    width: var(--size-24);
    height: var(--size-24);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: var(--fs-20);
    border-radius: 0.5rem;
    color: inherit;
    margin-left: 0.6rem;
    cursor: pointer;

    &:hover {
      border-radius: 0.5rem;
      color: var(--primary);
      background-color: var(--primary-bg);
    }
  }
}
</style>
