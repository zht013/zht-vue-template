import { appTheme } from '@/helpers'
import { LayoutType, type AppConfig, type AppState, ThemeType, type AppMenu } from '@/types'
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useAppStore = defineStore('app', (): AppState => {
  /** 应用的配置信息 */
  const config = ref<AppConfig>({
    title: ''
  })

  /** 应用的主题 */
  const theme = ref<ThemeType>(appTheme.userTheme)
  /** 应用的布局 */
  const layoutType = ref<LayoutType>(LayoutType.empty)
  /** 是否 mount 过了 swap 插件 */
  const mountedSortableSwap = ref(false)
  /** 内容区域是否全屏 */
  const contentFullscreen = ref(false)
  /** 当前激活的菜单项 */
  const activeMenuId = ref('')
  /** 路由导航历史 */
  const routeHistories = ref<AppMenu[]>([])

  /** 重置 App 信息 */
  function $reset() {
    theme.value = ThemeType.light
  }

  return {
    theme,
    layoutType,
    config,
    $reset,
    mountedSortableSwap,
    contentFullscreen,
    activeMenuId,
    routeHistories
  }
})
