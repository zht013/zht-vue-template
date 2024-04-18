<template>
  <!-- 按需引入element plus -->
  <ElConfigProvider size="default" :z-index="3000" :locale="zhCn">
    <LayoutController />
  </ElConfigProvider>
</template>

<script setup lang="ts">
import zhCn from 'element-plus/es/locale/lang/zh-cn'
import LayoutController from '@/views/layouts/index.vue'
</script>
