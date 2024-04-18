<template>
  <ElCard>
    <div ref="elRef">
      <div
        v-for="item in list"
        :key="item.id"
        class="mt-2 rounded border p-1 text-center"
        :style="{
          backgroundColor: item.bgClor
        }"
      >
        {{ item.name }}
      </div>
    </div>

    <ElDivider />

    <div ref="swapRef">
      <div
        v-for="item in list"
        :key="item.id"
        class="mt-2 rounded border p-1 text-center"
        :style="{
          backgroundColor: item.bgClor
        }"
      >
        {{ item.name }}
      </div>
    </div>
  </ElCard>
</template>

<script setup lang="ts">
import { useSortable } from '@vueuse/integrations/useSortable'
import { randomDarkColor } from '@/utils'

const elRef = ref<HTMLElement | null>(null)
const list = ref([
  { id: 1, name: 'a', bgClor: randomDarkColor() },
  { id: 2, name: 'b', bgClor: randomDarkColor() },
  { id: 3, name: 'c', bgClor: randomDarkColor() },
  { id: 4, name: 'd', bgClor: randomDarkColor() },
  { id: 5, name: 'e', bgClor: randomDarkColor() },
  { id: 6, name: 'f', bgClor: randomDarkColor() }
])

useSortable(elRef, list, {
  animation: 200
})

const swapRef = ref<HTMLElement | null>(null)
useSortable(swapRef, list, {
  swap: true,
  animation: 200
})
</script>
