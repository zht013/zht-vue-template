<template>
  <div class="w-full">
    <QRCode class="mx-auto" :content="loginUrl" />
    <ElDivider><span class="text-xs opacity-60">扫码点击确认，即可完成登录</span></ElDivider>
    <ElButton class="w-full" size="default" @click="onReturnBtnClick">返回</ElButton>
  </div>
</template>

<script setup lang="ts">
import FormType from '../FormType'
import QRCode from '@/components/QRCode.vue'

/** 当前激活的 form */
const activedFormType = defineModel<FormType>()
const loginUrl = 'http://localhost:5173/api/user/login'

const onReturnBtnClick = () => {
  activedFormType.value = FormType.login
}
</script>
