<template>
  <div>
    <ElCard>
      <template #header>图片</template>
      <div ref="parallaxRef" class="bg-gray-100 py-24">
        <div
          :style="{
            perspective: `${roll === 0.5 || tilt === -0.5 ? 0 : 300}px`
          }"
        >
          <div
            :style="{
              transform: `rotateX(${(roll === 0.5 ? 0 : roll) * 20}deg) rotateY(${(tilt === -0.5 ? 0 : tilt) * 20}deg)`
            }"
            class="relative mx-auto h-96 w-72 max-w-[90%] overflow-hidden rounded border-2 border-gray-300 shadow-md transition-all duration-300 ease-out"
          >
            <img
              v-for="(img, index) in images"
              :key="img"
              :style="{
                transform: `translateX(${tilt * 10 * (index + 1)}px) translateY(${roll * 10 * (index + 1)}px) scale(1.33)`
              }"
              :src="img"
              class="absolute h-full w-full transition-all duration-300 ease-out"
              alt=""
            />
          </div>
        </div>
      </div>
    </ElCard>

    <ElCard class="mt-4">
      <template #header>背景图</template>
      <div ref="parallaxBgRef" class="bg-gray-100 py-24">
        <div
          :style="{
            backgroundPosition: `${btilt * 60 + 50}% ${broll * 60 + 50}%, ${btilt * 35 + 50}% ${broll * 35 + 50}%, ${btilt * 50 * -1 + 50}% ${broll * 50 * -1 + 50}%, ${btilt * 20 + 50}% ${broll * 20 + 50}%`
          }"
          class="bac-con mx-auto h-[400px] w-[400px] max-w-[90%] rounded border-2 border-gray-400 transition-[background-position] duration-300 ease-out"
        ></div>
      </div>
    </ElCard>
  </div>
</template>

<script setup lang="ts">
import { useParallax } from '@vueuse/core'
import rabbit0 from '@/assets/rabbit0.png'
import rabbit1 from '@/assets/rabbit1.png'
import rabbit2 from '@/assets/rabbit2.png'
import rabbit3 from '@/assets/rabbit3.png'

const parallaxRef = ref<HTMLDivElement>()
const images = [rabbit0, rabbit1, rabbit2, rabbit3]

const { tilt, roll } = useParallax(parallaxRef)

const parallaxBgRef = ref<HTMLDivElement>()
const { tilt: btilt, roll: broll } = useParallax(parallaxBgRef)
</script>

<style scoped>
.bac-con {
  background-image: url('@/assets/rabbit3.png'), url('@/assets/rabbit2.png'),
    url('@/assets/rabbit1.png'), url('@/assets/rabbit0.png');
  background-repeat: no-repeat;
  background-size: 120% 120%;
  background-color: red;
  background-position: 50% 50%;
}
</style>
