<template>
  <div
    class="min-h-screen lg:grid lg:grid-cols-[1fr_1fr] lg:grid-rows-[min-content_1fr_min-content] lg:gap-2 lg:[background:no-repeat_12%_50%_/_36%_url('@/assets/login-draw.svg'),no-repeat_left_/_cover_url('@/assets/login-bg.png');]"
  >
    <header class="px-5 text-right lg:col-span-2">
      <ElSwitch
        v-model="theme"
        inline-prompt
        :active-value="ThemeType.dark"
        :active-icon="IconCustomDark"
        :inactive-value="ThemeType.light"
        :inactive-icon="IconCustomDay"
      />
    </header>

    <main class="flex px-7 py-4 lg:col-start-2 lg:items-center lg:justify-center">
      <div class="flex w-full flex-col items-center lg:w-3/4">
        <IconCustomLogo class="text-7xl"></IconCustomLogo>
        <h1 class="mb-10 text-2xl font-bold uppercase text-gray-500">{{ appTitle }}</h1>

        <Transition name="app-ani" mode="out-in">
          <LoginForm
            v-if="activedFormType === FormType.login"
            v-model="activedFormType"
            :redirect="redirect"
          />
          <RegisterForm
            v-else-if="activedFormType === FormType.register"
            v-model="activedFormType"
          />
          <PhoneLogin
            v-else-if="activedFormType === FormType.phoneLogin"
            v-model="activedFormType"
          />
          <QrLogin v-else-if="activedFormType === FormType.qrCodeLogin" v-model="activedFormType" />
          <ForgotPassword
            v-else-if="activedFormType === FormType.forgotPassword"
            v-model="activedFormType"
          />
        </Transition>
      </div>
    </main>

    <Copyright class="lg:col-span-2" />
  </div>
</template>

<script setup lang="ts">
import IconCustomDay from '~icons/custom/day'
import IconCustomDark from '~icons/custom/dark'
import LoginForm from './components/LoginForm.vue'
import RegisterForm from './components/RegisterForm.vue'
import PhoneLogin from './components/PhoneLogin.vue'
import FormType from './FormType'
import QrLogin from './components/QrLogin.vue'
import ForgotPassword from './components/ForgotPassword.vue'
import { ThemeType } from '@/types'
import { useAppStore } from '@/stores'
import Copyright from '@/components/Copyright.vue'

defineProps<{
  /** 从查询参数中获取 redirect 参数值 */
  redirect?: string | undefined
}>()

/** App 标题 */
const appTitle = import.meta.env.VITE_APP_TITLE
/** App theme */
const { theme } = storeToRefs(useAppStore())
/** 当前激活的 Form */
const activedFormType = ref<FormType>(FormType.login)
</script>

<script lang="ts">
export default {
  name: 'LoginPage'
}
</script>
