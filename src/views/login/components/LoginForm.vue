<template>
  <div class="w-full">
    <ElForm ref="formRef" class="w-full" size="large" :rules="rules" :model="formData">
      <ElFormItem prop="userName">
        <ElInput
          type="text"
          v-model="formData.userName"
          :prefix-icon="IconEpUser"
          :clearable="true"
          placeholder="请输入账号"
        ></ElInput>
      </ElFormItem>
      <ElFormItem prop="password">
        <ElInput
          type="password"
          v-model="formData.password"
          :prefix-icon="IconEpLock"
          :show-password="true"
          :clearable="true"
          placeholder="请输入密码"
        ></ElInput>
      </ElFormItem>
      <ElFormItem v-if="useVerifyCode" prop="verifyCode">
        <ElInput
          v-model="formData.verifyCode"
          :prefix-icon="IconEpKey"
          :clearable="true"
          placeholder="请输入验证码"
        >
          <template #append>
            <VerifyCodeImg
              ref="verifyCodeImgRef"
              class="-mx-5"
              v-model="verifyCode"
              :width="120"
              :height="40"
            />
          </template>
        </ElInput>
      </ElFormItem>
      <ElFormItem>
        <div class="-mt-2 mb-1 flex w-full justify-between">
          <ElCheckbox v-model="formData.rememberMe">
            <div class="flex items-center">
              <span class="mr-2">{{ rememberMeDays }}天内免登录</span>
              <ElTooltip
                :showAfter="300"
                effect="dark"
                placement="top"
                content="勾选并登录后，规定天数内无需输入用户名和密码会自动登入系统"
              >
                <IconRiInformation2Line class="opacity-60" />
              </ElTooltip>
            </div>
          </ElCheckbox>

          <ElButton type="primary" link @click="onForgotPasswordBtnClick"> 忘记密码？ </ElButton>
        </div>

        <ElButton
          class="w-full"
          type="primary"
          :loading="showLoadingStatus"
          :disabled="isLogining"
          @click="onLoginBtnClick(formRef)"
        >
          登录
        </ElButton>
      </ElFormItem>
    </ElForm>

    <OtherLogin v-model="activedFormType"></OtherLogin>
  </div>
</template>

<script setup lang="ts">
import IconEpUser from '~icons/ep/user'
import IconEpLock from '~icons/ep/lock'
import IconEpKey from '~icons/ep/key'
import { appLoading } from '@/helpers'
import { refDebounced } from '@vueuse/core'
import { userService } from '@/services/UserService'
import { type RouteLocationRaw } from 'vue-router'
import OtherLogin from './OtherLogin.vue'
import FormType from '../FormType'
import { reactive, ref } from 'vue'
import { ROUTE_NAMES, VALIDATION_RULES } from '@/constants'
import type { HttpResult } from '@/types'
import VerifyCodeImg from '@/components/VerifyCodeImg.vue'
import type { FormInstance, FormRules } from 'element-plus'

interface LoginFrom {
  userName: string
  password: string
  verifyCode?: string
  rememberMe?: boolean
}
/** 当前激活的 form */
const activedFormType = defineModel<FormType>()
const props = defineProps<{
  redirect?: string | undefined
}>()

const router = useRouter()
/** 记住我多少天 */
const rememberMeDays = ref<number>(7)
/** 验证码 */
const verifyCode = ref<string>('')
const verifyCodeImgRef = ref<InstanceType<typeof VerifyCodeImg>>()
/** 是否需要验证码 */
const useVerifyCode = ref(false)
/** form 引用 */
const formRef = ref<FormInstance>()
/** form 数据 */
const formData = reactive<LoginFrom>({
  userName: 'admin',
  password: '123456abc'
})
/** form 验证规则 */
const rules = reactive<FormRules<LoginFrom>>({
  userName: [{ required: true, message: '请输入账号', trigger: 'blur' }],
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
  verifyCode: [
    {
      trigger: 'blur',
      validator: (rule, value, callback) => {
        if (useVerifyCode.value) {
          if (!value) {
            callback(new Error('请输入验证码'))
          } else if (!VALIDATION_RULES.verifyCode.rule.test(value) || value !== verifyCode.value) {
            // 刷新验证码
            verifyCodeImgRef.value?.refresh()
            callback(new Error(VALIDATION_RULES.verifyCode.message))
          } else {
            callback()
          }
        } else {
          callback()
        }
      }
    }
  ]
})

/** 忘记密码 */
const onForgotPasswordBtnClick = () => {
  activedFormType.value = FormType.forgotPassword
}

/** 是否正在登录中 */
const isLogining = ref(false)
/** 显示 loading 状态 */
const showLoadingStatus = refDebounced(isLogining, 200)
/** 用户登录 */
const onLoginBtnClick = async (form?: FormInstance) => {
  if (!form && appLoading.isLoading) return

  // 校验表单, 校验通过继续执行后续代码
  await form?.validate()

  isLogining.value = true
  userService
    .login(
      formData.userName,
      formData.password,
      formData.rememberMe ? rememberMeDays.value : undefined
    )
    .then((result: HttpResult<string>) => {
      if (result.success && result.data) {
        // 如果当前的 route 有 redirect 参数，则导航到指定的path，否则导航到home页
        const toRoute: RouteLocationRaw = props.redirect
          ? { path: props.redirect }
          : { name: ROUTE_NAMES.dashboard }
        // 如果成功跳转到 指定页
        router.push(toRoute).then(() => {
          isLogining.value = false
        })

        form?.resetFields()
      } else {
        isLogining.value = false
        useVerifyCode.value = true
        // 刷新验证码
        verifyCodeImgRef.value?.refresh()
        // 如果失败，抛出错误信息
        ElNotification.error(result.message)
      }
    })
    .catch(() => {
      isLogining.value = false
    })
}
</script>
