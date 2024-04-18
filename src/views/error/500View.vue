<template>
  <div class="flex h-[640px] items-center justify-center">
    <IconCustom500 />
    <div class="ml-12">
      <p
        class="mb-4 text-4xl font-medium dark:text-white"
        v-motion
        :initial="{
          opacity: 0,
          y: 100
        }"
        :enter="{
          opacity: 1,
          y: 0,
          transition: {
            delay: 100
          }
        }"
      >
        500
      </p>
      <p
        class="mb-4 text-gray-500"
        v-motion
        :initial="{
          opacity: 0,
          y: 100
        }"
        :enter="{
          opacity: 1,
          y: 0,
          transition: {
            delay: 300
          }
        }"
      >
        抱歉，服务器出错了
      </p>
      <ElButton
        type="primary"
        @click="router.push('/')"
        v-motion
        :initial="{
          opacity: 0,
          y: 100
        }"
        :enter="{
          opacity: 1,
          y: 0,
          transition: {
            delay: 500
          }
        }"
      >
        返回首页
      </ElButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { MotionDirective } from '@vueuse/motion'

const router = useRouter()
const vMotion = MotionDirective()
</script>
