<template>
  <ElButton @click="onCloseBtnClick">{{ mtitle }}</ElButton>
  <div class="w-full">
    <h3 class="bg-red-300">Lorem ipsum dolor sit amet consectetur</h3>
    <p class="bg-orange-300">Lorem ipsum dolor sit, amet consectetur adipisicing elit</p>
    <p class="bg-green-400">Lorem ipsum dolor</p>
  </div>

  <div class="w-full">
    <table class="w-full table-auto border-separate border border-slate-400">
      <thead>
        <tr>
          <th v-for="item in 10" :key="item" class="border border-slate-400">th{{ item }}</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="row in 30" :key="row">
          <td v-for="col in 10" :key="col" class="border border-slate-400">col{{ col }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">
import { type Action } from 'element-plus'

defineProps<{
  mtitle: string
}>()

const emit = defineEmits<{
  close: [action: Action]
}>()

const onCloseBtnClick = () => {
  emit('close', 'confirm')
}
</script>
