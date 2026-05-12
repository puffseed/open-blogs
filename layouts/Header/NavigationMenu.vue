<script setup lang="ts">
import { computed } from "vue";
import { menusConfig } from "../../config/MenusConfig";

const route = useRoute();

const currentKey = computed(() => {
  for (const key of Object.keys(menusConfig)) {
    if (route.path.startsWith(key)) {
      return key;
    }
  }
  return null;
});

const navigationRoutes = computed(() => {
  if (currentKey.value) {
    return menusConfig[currentKey.value];
  }
  return [];
});

const showNavigation = computed(() => {
  return navigationRoutes.value.length > 0;
});
</script>

<template>
  <div v-if="showNavigation" class="navigation-menu">
    <ul>
      <li v-for="item in navigationRoutes" :key="item.path">
        <NuxtLink :to="item.path">{{ item.name }}</NuxtLink>
      </li>
    </ul>
  </div>
</template>

<style scoped lang="less">
.navigation-menu {
  ul {
    display: flex;
    align-items: center;
    background-color: var(--background);
    border-radius: var(--size-24);

    li {
      padding: 0 0.4rem;

      a {
        height: 38px;
        line-height: 38px;
        color: var(--mainText);
        padding: 0.4rem 0.8rem;
        font-size: var(--fs-12);
      }

      a.router-link-active,
      a.router-link-exact-active {
        font-weight: bold;
        color: var(--white);
        background-color: var(--primary);
        border-radius: var(--size-24);
      }
    }
  }
}
</style>
