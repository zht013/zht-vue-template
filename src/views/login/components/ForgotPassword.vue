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
    <ElFormItem prop="password">
      <ElInput
        type="password"
        v-model="formData.password"
        :prefix-icon="IconEpLock"
        :show-password="true"
        :clearable="true"
        placeholder="请输入密码"
        autocomplete="new-password"
      ></ElInput>
    </ElFormItem>
    <ElFormItem prop="confirmPassword">
      <ElInput
        type="password"
        v-model="formData.confirmPassword"
        :prefix-icon="IconEpLock"
        :show-password="true"
        :clearable="true"
        placeholder="请确认密码"
        autocomplete="new-password"
      ></ElInput>
    </ElFormItem>
    <ElFormItem>
      <ElButton type="primary" class="mb-2 w-full">修改密码</ElButton>
      <ElButton size="default" class="!mx-0 w-full" @click="onReturnBtnClick">返回</ElButton>
    </ElFormItem>
  </ElForm>
</template>

<script setup lang="ts">
import IconEpKey from '~icons/ep/key'
import IconEpIphone from '~icons/ep/iphone'
import IconEpLock from '~icons/ep/lock'
import FormType from '../FormType'
import { VALIDATION_RULES } from '@/constants'
import type { FormInstance, FormRules } from 'element-plus'

interface ForgotPasswordForm {
  phone: string
  smsVerifyCode: string
  password: string
  confirmPassword: string
}

/** 当前激活的 form */
const activedFormType = defineModel<FormType>()
/** form 引用 */
const formRef = ref<FormInstance>()
/** form 数据 */
const formData = reactive<ForgotPasswordForm>({} as ForgotPasswordForm)
/** form 验证规则 */
const rules = reactive<FormRules<ForgotPasswordForm>>({
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
  smsVerifyCode: [{ required: true, message: '请输入短信验证码', trigger: 'blur' }],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    {
      trigger: 'blur',
      validator: (rule, value, callback) => {
        if (VALIDATION_RULES.password.rule.test(value)) {
          callback()
        } else {
          callback(new Error(VALIDATION_RULES.password.message))
        }
      }
    }
  ],
  confirmPassword: [
    { required: true, message: '请确认密码', trigger: 'blur' },
    {
      trigger: 'blur',
      validator: (rule, value, callback) => {
        if (value !== formData.password) {
          callback(new Error('两次输入的密码不匹配'))
        } else {
          callback()
        }
      }
    }
  ]
})

const onReturnBtnClick = () => {
  activedFormType.value = FormType.login
}
</script>
