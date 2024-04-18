<template>
  <div>
    <ElCard>
      <template #header> 基础用法 </template>

      <ElWatermark :font="font" content="ZHT LAEARN">
        <div class="h-96"></div>
      </ElWatermark>
    </ElCard>

    <ElCard class="mt-4">
      <template #header> 多行水印 </template>

      <ElWatermark :font="font" :content="['Element+', 'Element Plus']">
        <div class="h-96"></div>
      </ElWatermark>
    </ElCard>

    <ElCard class="mt-4">
      <template #header> 图片水印 </template>

      <ElWatermark
        :width="130"
        :height="30"
        image="https://element-plus.org/images/element-plus-logo.svg"
      >
        <div class="h-96"></div>
      </ElWatermark>
    </ElCard>
  </div>
</template>

<script setup lang="ts">
const font = reactive({
  color: 'rgba(0, 0, 0, .15)'
})
</script>
