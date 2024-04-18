<template>
  <div
    ref="container"
    class="relative m-auto flex h-[80px] w-full items-center justify-center overflow-hidden rounded bg-orange-300"
  >
    <ElButton @click="reset">Reset</ElButton>
    <div
      ref="target"
      class="absolute left-0 top-0 flex h-full w-full items-center justify-center bg-[#3eaf7c]"
      :class="{ 'transition-all duration-200 ease-linear': !isSwiping }"
      :style="{ left, opacity }"
    >
      <p class="flex items-center text-white">Swipe <mdi-arrow-right /></p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { usePointerSwipe } from '@vueuse/core'

const target = ref<HTMLElement | null>(null)
const container = ref<HTMLElement | null>(null)

const containerWidth = computed(() => container.value?.offsetWidth)

const left = ref('0')
const opacity = ref(1)

function reset() {
  left.value = '0'
  opacity.value = 1
}

const { distanceX, isSwiping } = usePointerSwipe(target, {
  disableTextSelect: true,
  onSwipe() {
    if (containerWidth.value) {
      if (distanceX.value < 0) {
        const distance = Math.abs(distanceX.value)
        left.value = `${distance}px`
        opacity.value = 1.25 - distance / containerWidth.value
      } else {
        left.value = '0'
        opacity.value = 1
      }
    }
  },
  onSwipeEnd() {
    if (
      distanceX.value < 0 &&
      containerWidth.value &&
      Math.abs(distanceX.value) / containerWidth.value >= 0.5
    ) {
      left.value = '100%'
      opacity.value = 0
    } else {
      left.value = '0'
      opacity.value = 1
    }
  }
})
</script>
