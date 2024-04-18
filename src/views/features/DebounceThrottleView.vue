<template>
  <div>
    <ElCard>
      <template #header> 防抖：debounce </template>
      所谓防抖，就是指触发事件后在 n 秒内函数只能执行一次，如果在 n
      秒内又触发了事件，则会重新计算函数执行时间。

      <div class="mt-4">
        <ElButton type="primary" size="default" @click="handleDebounceImmediate">
          连续点击我，只会执行第一次点击事件，立即执行
        </ElButton>
        <ElButton type="primary" size="default" @click="handleDebounceDelay">
          连续点击我，只会执行最后一次点击事件，延后执行
        </ElButton>
      </div>
    </ElCard>

    <ElCard class="mt-5">
      <template #header> 节流：throttle </template>
      所谓节流，就是指连续触发事件但是在 n 秒中只执行一次函数。节流会稀释函数的执行频率。

      <div class="mt-4">
        <ElButton type="primary" size="default" @click="handleThrottle">
          连续点击我，每一秒只会执行一次点击事件
        </ElButton>
      </div>
    </ElCard>
  </div>
</template>

<script setup lang="ts">
import { debounce, throttle } from 'lodash-es'

const message = () => {
  ElMessage.success('这是一条消息')
}

const handleDebounceImmediate = debounce(message, 500, {
  leading: true,
  trailing: false
})

const handleDebounceDelay = debounce(message, 500, {
  leading: false,
  trailing: true
})

const handleThrottle = throttle(message, 1000)
</script>
