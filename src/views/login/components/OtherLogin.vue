<template>
  <div class="flex w-full justify-between">
    <ElButton class="flex-1" size="default" @click="onPhoneLoginBtnClick">手机登录</ElButton>
    <ElButton class="flex-1" size="default" @click="onQRCodeLoginBtnClick">二维码登录</ElButton>
    <ElButton class="flex-1" size="default" @click="onRegisterBtnClick">注册</ElButton>
  </div>
  <ElDivider class="mt-10">
    <span class="text-xs opacity-60">第三方登录</span>
  </ElDivider>
  <div
    class="mt-3 flex w-full justify-evenly *:!text-xl *:opacity-60 hover:*:!text-[--el-color-primary]"
  >
    <ElButton text @click="onQRCodeLoginBtnClick">
      <IconRiWechatFill />
    </ElButton>
    <ElButton text>
      <IconRiAlipayFill />
    </ElButton>
    <ElButton text>
      <IconRiQqFill />
    </ElButton>
    <ElButton text>
      <IconRiWeiboFill />
    </ElButton>
  </div>
</template>

<script setup lang="ts">
import FormType from '../FormType'

const activedFormType = defineModel()

const onRegisterBtnClick = () => {
  activedFormType.value = FormType.register
}

const onPhoneLoginBtnClick = () => {
  activedFormType.value = FormType.phoneLogin
}

const onQRCodeLoginBtnClick = () => {
  activedFormType.value = FormType.qrCodeLogin
}
</script>
