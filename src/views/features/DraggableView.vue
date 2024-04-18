<template>
  <ElCard>
    <template #header> 拖拽 </template>

    <div class="flex w-full gap-2">
      <ElCard class="flex-1" shadow="never">
        <template #header>Grid 拖拽</template>
        <div ref="gridRef" class="grid grid-cols-3 gap-2">
          <div
            v-for="item in gridItems"
            :key="item.id"
            class="cursor-move text-center text-xl leading-[6rem]"
            :style="{ backgroundColor: item.bgColor }"
          >
            {{ item.id }}
          </div>
        </div>
      </ElCard>
      <ElCard class="flex-1" shadow="never">
        <template #header>单列拖拽</template>
        <ul ref="listRef">
          <li
            v-for="item in listItems"
            :key="item.id"
            class="mb-1 cursor-move text-center leading-[3rem]"
            :style="{ backgroundColor: item.bgColor }"
          >
            {{ item.id }}
          </li>
        </ul>
      </ElCard>
      <ElCard class="flex-1" shadow="never">
        <template #header>交换位置</template>

        <ul ref="swapRef">
          <li
            v-for="item in swapItems"
            :key="item.id"
            class="mb-1 cursor-move text-center leading-[3rem]"
            :style="{ backgroundColor: item.bgColor }"
          >
            {{ item.id }}
          </li>
        </ul>
      </ElCard>
    </div>
  </ElCard>
</template>

<script setup lang="ts">
import { useAppStore } from '@/stores'
import { moveArrayElement, randomDarkColor } from '@/utils'
import Sortable, { Swap } from 'sortablejs'

interface Item {
  id: number
  bgColor: string
}

const gridRef = ref<HTMLElement>()
const gridItems = ref<Item[]>(
  Array.from({ length: 9 }).map((_, index) => ({
    id: index,
    bgColor: randomDarkColor()
  }))
)

const listRef = ref<HTMLElement>()
const listItems = ref<Item[]>(
  Array.from({ length: 5 }).map((_, index) => ({
    id: index,
    bgColor: randomDarkColor()
  }))
)

const swapRef = ref<HTMLElement>()
const swapItems = ref<Item[]>(
  Array.from({ length: 5 }).map((_, index) => ({
    id: index,
    bgColor: randomDarkColor()
  }))
)

onMounted(() => {
  Sortable.create(gridRef.value!, {
    animation: 320,
    onUpdate: (evt: Sortable.SortableEvent) => {
      gridItems.value = moveArrayElement<Item>(gridItems.value, evt.oldIndex!, evt.newIndex!)
    }
  })

  Sortable.create(listRef.value!, {
    animation: 320,
    onUpdate: (evt: Sortable.SortableEvent) => {
      listItems.value = moveArrayElement<Item>(listItems.value, evt.oldIndex!, evt.newIndex!)
    }
  })

  const appStore = useAppStore()
  if (!appStore.mountedSortableSwap) {
    appStore.mountedSortableSwap = true

    Sortable.mount(new Swap())
  }

  Sortable.create(swapRef.value!, {
    swap: true,
    swapClass: 'highlight',
    animation: 320,
    onUpdate: (evt: Sortable.SortableEvent) => {
      swapItems.value = moveArrayElement<Item>(swapItems.value, evt.oldIndex!, evt.newIndex!)
    }
  })
})
</script>

<style>
.highlight {
  background-color: red !important;
}
</style>
