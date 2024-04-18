<template>
  <ElForm ref="formRef" class="w-full" size="large" :model="formData" :rules="rules">
    <ElFormItem prop="phone">
      <ElInput
        type="text"
        v-model="formData.phone"
        :prefix-icon="IconEpIphone"
        :clearable="true"
        placeholder="请输入手机号"
        autocomplete="off"
      ></ElInput>
    </ElFormItem>
    <ElFormItem prop="smsVerifyCode">
      <ElInput
        type="text"
        v-model="formData.smsVerifyCode"
        :prefix-icon="IconEpKey"
        :clearable="true"
        placeholder="请输入短信验证码"
        autocomplete="off"
      >
        <template #append>
          <ElButton> 获取验证码 </ElButton>
        </template>
      </ElInput>
    </ElFormItem>
    <ElFormItem>
      <ElButton class="mb-2 w-full" type="primary">登录</ElButton>
      <ElButton class="!mx-0 w-full" size="default" @click="onReturnBtnClick">返回</ElButton>
    </ElFormItem>
  </ElForm>
</template>

<script setup lang="ts">
import IconEpKey from '~icons/ep/key'
import IconEpIphone from '~icons/ep/iphone'
import FormType from '../FormType'
import { VALIDATION_RULES } from '@/constants'
import type { FormInstance, FormRules } from 'element-plus'

interface PhoneLoginForm {
  phone: string
  smsVerifyCode: string
}

/** 当前激活的 form */
const activedFormType = defineModel<FormType>()
/** form 引用 */
const formRef = ref<FormInstance>()
/** form 数据 */
const formData = reactive<PhoneLoginForm>({} as PhoneLoginForm)
/** form 验证规则 */
const rules = reactive<FormRules<PhoneLoginForm>>({
  phone: [
    { required: true, message: '请输入手机号', trigger: 'blur' },
    {
      trigger: 'blur',
      validator: (rule, value, callback) => {
        if (VALIDATION_RULES.phone.rule.test(value)) {
          callback()
        } else {
          callback(new Error(VALIDATION_RULES.phone.message))
        }
      }
    }
  ],
  smsVerifyCode: [{ required: true, message: '请输入短信验证码', trigger: 'blur' }]
})

const onReturnBtnClick = () => {
  activedFormType.value = FormType.login
}
</script>

<style scoped>
.phone-login {
  width: 100%;

  .actions .el-button {
    width: 100%;
    margin: 0 0 6px;
  }
}
</style>
