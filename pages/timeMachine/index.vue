<script setup lang="ts">
import TimeCapsule from './TimeCapsule.vue'
import ModuleTitle from '~/components/ModuleTitle.vue'
</script>
<!-- 时光机 -->
<template>
  <div class="time-machine">
    <!-- 标题 -->
    <ModuleTitle title="时间胶囊" />
    <TimeCapsule />
  </div>
</template>
<style scoped lang="less">
.time-machine {
}
</style>
