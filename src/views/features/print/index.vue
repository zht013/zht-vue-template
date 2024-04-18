<template>
  <ElCard>
    <template #header> 打印功能 </template>

    <ElSpace>
      <ElButton
        :disabled="isPrinting"
        :loading="showPrintStatus"
        type="primary"
        @click="handlePrintBill"
      >
        打印页面
      </ElButton>
      <ElButton
        :disabled="isPrinting"
        :loading="showPrintStatus"
        type="primary"
        @click="handlePrintComponent"
      >
        打印组件
      </ElButton>
    </ElSpace>
  </ElCard>
</template>

<script setup lang="ts">
import { ROUTE_NAMES } from '@/constants'
import { appPrint } from '@/helpers'
import { refDebounced } from '@vueuse/core'
import PComponent from './PComponent.vue'

const router = useRouter()
const isPrinting = ref(false)
const showPrintStatus = refDebounced(isPrinting, 300)

const handlePrintBill = () => {
  isPrinting.value = true
  appPrint
    .print(router.getRoutes().find((route) => route.name === ROUTE_NAMES.printBill)?.path!)
    .then(() => {
      isPrinting.value = false
    })
}

const handlePrintComponent = () => {
  isPrinting.value = true
  appPrint.printComponent(PComponent).then(() => {
    isPrinting.value = false
  })
}
</script>

<script lang="ts">
export default {
  name: 'PrintView'
}
</script>
