<template>
  <div class="con">
    <ul style="color: red; border: 1px solid yellow">
      <li v-for="count in dataCount" :key="count">li-{{ count }}</li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { printService } from '@/services/PrintService'

const emit = defineEmits<{
  inited: []
}>()

const dataCount = ref<number>(0)
printService.test().then(async () => {
  dataCount.value = 7

  await nextTick()

  emit('inited')
})
</script>
