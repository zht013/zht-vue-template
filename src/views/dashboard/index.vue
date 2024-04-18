<template>
  <div>
    <p class="pb-4 text-2xl">{{ datenow }}</p>
    <p class="test-high">{{ ratio }}</p>
    <div class="h-[2000px]">
      <ElButton @click="refreshPage" class="font-sans" :icon="IconEpEdit"> 刷新页面 </ElButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ElButton } from 'element-plus'
import { AppEmitter, appEmitter } from '@/helpers'
import IconEpEdit from '~icons/ep/edit'
import { ref } from 'vue'
import { githubService } from '@/services/GithubService'

const datenow = ref<Date>(new Date())
const ratio = window.devicePixelRatio

const refreshPage = () => {
  appEmitter.emit(AppEmitter.REFRESH_VIEW)
}

githubService.getProjects().then((data) => {
  console.log(data)
})
</script>

<style scoped>
.test-high {
  border: 2px solid red;
}
</style>
