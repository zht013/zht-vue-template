<template>
  <ElCard
    class="flex h-[--main-con-full-height] flex-col"
    :body-style="{
      flex: 1,
      minHeight: 0,
      overflow: 'auto',
      padding: 0,
      display: 'flex',
      flexDirection: 'column',
      position: 'relative'
    }"
    v-loading="docLoading"
  >
    <template #header>PDF 预览</template>

    <div
      class="absolute left-4 right-4 top-1 flex items-center rounded-sm bg-white px-6 py-1 shadow"
    >
      <span>共 {{ pageCount }} 页</span>
      <ElTooltip content="打印">
        <ElButton
          class="ml-auto"
          :icon="IconEpPrint"
          circle
          size="default"
          @click="handlePdfPrint"
        ></ElButton>
      </ElTooltip>
    </div>

    <VuePdfEmbed
      ref="pdfRef"
      class="container flex-1 overflow-auto pt-9"
      source="/test-files/test-pdf.pdf"
      @rendered="handlePdfRender"
    />
  </ElCard>
</template>

<script setup lang="ts">
import IconEpPrint from '~icons/ep/printer'
import VuePdfEmbed from 'vue-pdf-embed'

const pageCount = ref(0)
const docLoading = ref(true)
const pdfRef = ref<InstanceType<typeof VuePdfEmbed>>()

const handlePdfRender = () => {
  docLoading.value = false
  pageCount.value = pdfRef.value?.doc?.numPages ?? 0
}

const handlePdfPrint = () => {
  pdfRef.value?.print()
}
</script>
