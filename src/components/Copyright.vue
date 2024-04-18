<template>
  <footer class="text-center">
    Copyright © 2024
    <a href="https://gitee.com/htz013/zht-vue3-web-el-template" target="_blank">
      {{ title }}
    </a>
  </footer>
</template>

<script setup lang="ts">
const title = import.meta.env.VITE_APP_TITLE
</script>

<style scoped></style>
