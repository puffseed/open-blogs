<script setup lang="ts">
import { siteConfig } from "../../config/pageConfig";

const route = useRoute();
</script>

<template>
  <div v-if="route.path === '/'">
    <NuxtLink to="/" class="logo-link">
      <img alt="Vue logo" class="logo" src="/assets/images/Avatar.jpg" />
      <p>{{ siteConfig.siteName }}</p>
    </NuxtLink>
  </div>
  <div v-else>
    <NuxtLink to="/" class="logo-link">
      <i class="icon iconfont icon-Back"></i>
      <p>{{ siteConfig.siteName }}</p>
    </NuxtLink>
  </div>
</template>

<style lang="less" scoped>
.logo-link {
  display: flex;
  align-items: center;
  cursor: pointer;
  color: inherit;
  text-decoration: none;

  .logo {
    width: var(--size-30);
    height: var(--size-30);
    border-radius: 50%;
    margin-right: 0.5rem;
    border: 1px solid var(--white);
  }

  .icon {
    width: var(--size-30);
    height: var(--size-30);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: var(--fs-20);
    border-radius: var(--size-24);
    margin-right: 0.5rem;
    color: var(--white);
    background-color: var(--primary);
    &:hover {
      color: var(--white);
      background-color: var(--primary-hover);
    }
  }
}

p {
  width: 66px;
  font-weight: bold;
}
</style>
