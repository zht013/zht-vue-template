<template>
  <div>
    <ElInput ref="inputRef" placeholder="请输入内容"></ElInput>
  </div>
</template>

<script setup lang="ts">
const inputRef = ref<HTMLInputElement>()

onMounted(async () => {
  await nextTick()
  inputRef.value?.focus()
})
</script>
