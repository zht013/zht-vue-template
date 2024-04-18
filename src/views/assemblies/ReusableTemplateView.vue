<template>
  <ElCard>
    <template #header>重用组件内模板</template>

    <DefineTemplate> 这是一个组件内模板 </DefineTemplate>

    <div v-if="showing">
      <p>额外的信息</p>

      <ReuseTemplate />

      <div>
        <ElButton type="primary" @click="toggleShowing()">重用</ElButton>
      </div>
    </div>
    <div v-else>
      <ReuseTemplate />
    </div>
  </ElCard>
</template>

<script setup lang="ts">
import { createReusableTemplate, useToggle } from '@vueuse/core'

const showing = ref(true)
const toggleShowing = useToggle(showing)
const [DefineTemplate, ReuseTemplate] = createReusableTemplate()
</script>
