<template>
  <component v-if="layout" :is="layout" :is-refresh-view="isRefreshView" />
  <RouterView v-else />

  <div
    class="fixed left-0 right-0 top-0 z-9999 h-1 origin-[0_50%] animate-scroll-progress bg-pink-500 opacity-0 [animation-timeline:scroll()]"
  ></div>
</template>

<script setup lang="ts">
import MobileLayout from './mobile/index.vue'
import DefaultLayout from './default/index.vue'
import PrintLayout from './print/index.vue'
import ConciseLayout from './concise/index.vue'
import { useMediaQuery, useThrottleFn } from '@vueuse/core'
import { useAppStore } from '@/stores'
import { appTheme } from '@/helpers'
import { AppEmitter, appEmitter } from '@/helpers/AppEmitter'
import { appLayout } from '@/helpers'
import { LayoutType, ThemeType } from '@/types'
import { breakpointsTailwind, useBreakpoints } from '@vueuse/core'

const isSmallerThanLarge = useBreakpoints(breakpointsTailwind).smaller('lg')
const { theme, layoutType } = storeToRefs(useAppStore())
const route = useRoute()
const layouts: { [key: string]: Component } = {
  [LayoutType.default]: DefaultLayout,
  [LayoutType.concise]: ConciseLayout,
  [LayoutType.mobile]: MobileLayout,
  [LayoutType.print]: PrintLayout
}

const layout = computed(() => layouts[layoutType.value])

/** 监听用户改变 layout */
appEmitter.on(AppEmitter.SAVE_APP_LAYOUT, (layout: LayoutType) => {
  appLayout.userLayout = layout
})

// 监听路由和视口的变化，改变layout
watchEffect(() => {
  layoutType.value = getLayout()
})

/** App 初始化时系统 theme 是否是 dark */
const isDarkMode = useMediaQuery('(prefers-color-scheme: dark)')

// 初始化时设置应用的 Theme
appTheme.setTheme(isDarkMode.value ? ThemeType.dark : appTheme.userTheme)

/**当系统 theme 变化时，只改变 store 中的状态，不做本地存储 */
// 添加监听事件
watch(isDarkMode, (value) => {
  if (value) {
    // 当系统设置为深色模式时
    appTheme.setTheme(ThemeType.dark)
  } else {
    // 当系统设置不为深色模式或者未指定明确的亮度模式时
    theme.value = appTheme.userTheme
  }
})

// 监听 theme 的变化
watch(theme, (value, prevValue) => {
  appTheme.saveTheme(value, prevValue)
})

/** 是否刷新视图 */
const isRefreshView = ref<boolean>(false)
/** 刷新视图 */
const refresh = useThrottleFn(async () => {
  isRefreshView.value = true
  await nextTick()
  isRefreshView.value = false
}, 2000)

/** 监听刷新事件 */
appEmitter.on(AppEmitter.REFRESH_VIEW, refresh)

/**
 * 获取当前路由使用的 layout
 * 路由是否指定了 layout，如果指定了就用指定的 layout
 * 如果没有指定，则查看路由是否使用动态模板设置，如果是，则从 localstorage 中查找数据
 * 如果什么都没设置，则不使用 layout 模板
 * @param meta 当前路由的 meta 信息
 * @returns
 */
function getLayout(): LayoutType {
  if (route.meta?.layout) {
    return route.meta?.layout
  } else if (route.meta?.dynamicLayout) {
    if (isSmallerThanLarge.value) {
      return LayoutType.mobile
    } else {
      return appLayout.userLayout || LayoutType.default
    }
  } else {
    return LayoutType.empty
  }
}

// 执行清理
onUnmounted(() => {
  appEmitter.off(AppEmitter.REFRESH_VIEW)
  appEmitter.off(AppEmitter.SAVE_APP_LAYOUT)
})
</script>

<script lang="ts">
export default {
  name: 'LayoutControllerView'
}
</script>
