import './styles/tailwind.css'

import { createApp } from 'vue'
import pinia from './stores'

import App from './App.vue'
import router from './router'
import { appService } from './services/AppService'
import { useAppStore } from './stores'
// import { MotionPlugin } from '@vueuse/motion'

import 'element-plus/es/components/loading/style/css'
import 'element-plus/es/components/message/style/css'
import 'element-plus/es/components/message-box/style/css'
import 'element-plus/es/components/notification/style/css'
import 'element-plus/theme-chalk/dark/css-vars.css'
import './styles/main.css'

const app = createApp(App)

// 设置此项为 true 可以在浏览器开发工具的“性能/时间线”页中启用对组件初始化、编译、渲染和修补的性能表现追踪。
// 仅在开发模式和支持 performance.mark API 的浏览器中工作
// app.config.performance = true
// 用于为应用内抛出的未捕获错误指定一个全局处理函数
// app.config.errorHandler = (
//   err: unknown,
//   instance: ComponentPublicInstance | null,
//   info: string
// ) => {
//   // 处理错误，例如：报告给一个服务
//   console.log(err, instance, info)
// }

app.use(pinia)
// app.use(MotionPlugin)

appService.getConfig().then(async (config) => {
  useAppStore().config = config

  app.use(router)

  await router.isReady()

  app.mount('#app')
})
