<template>
  <div>
    <ElCard>
      <div
        v-motion
        :initial="{
          y: 300,
          opacity: 0
        }"
        :enter="{
          y: 0,
          opacity: 1,
          transition: {
            type: 'spring',
            stiffness: 250,
            damping: 15,
            mass: 3.5
          }
        }"
      >
        <div
          v-for="url in imgs"
          :key="url"
          :style="{
            transformOrigin: '0 0'
          }"
          v-motion
          :initial="{
            y: 100,
            opacity: 0,
            rotate: 30
          }"
          :visibleOnce="{
            y: 0,
            opacity: 1,
            rotate: 0,
            transition: {
              duration: 100,
              opacity: {
                duration: 1000
              },
              rotate: {
                duration: 500
              }
            }
          }"
        >
          <ElImage :src="url" fit="contain" class="mx-auto !block w-full"></ElImage>
        </div>
      </div>
    </ElCard>
  </div>
</template>

<script setup lang="ts">
import { MotionDirective } from '@vueuse/motion'

const vMotion = MotionDirective()
const imgs = [
  'https://fuss10.elemecdn.com/a/3f/3302e58f9a181d2509f3dc0fa68b0jpeg.jpeg',
  'https://fuss10.elemecdn.com/1/34/19aa98b1fcb2781c4fba33d850549jpeg.jpeg',
  'https://fuss10.elemecdn.com/0/6f/e35ff375812e6b0020b6b4e8f9583jpeg.jpeg',
  'https://fuss10.elemecdn.com/9/bb/e27858e973f5d7d3904835f46abbdjpeg.jpeg',
  'https://fuss10.elemecdn.com/d/e6/c4d93a3805b3ce3f323f7974e6f78jpeg.jpeg',
  'https://fuss10.elemecdn.com/3/28/bbf893f792f03a54408b3b7a7ebf0jpeg.jpeg',
  'https://fuss10.elemecdn.com/2/11/6535bcfb26e4c79b48ddde44f4b6fjpeg.jpeg'
]
</script>
