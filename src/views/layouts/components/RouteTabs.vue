<template>
  <div
    class="flex h-[--app-tab-nav-height] flex-nowrap items-stretch border-b border-b-[--el-border-color] bg-[--el-bg-color] shadow-sm"
  >
    <ElButton
      v-if="showLeftButton"
      :icon="IconEpArrowLeft"
      class="!h-full w-6 !rounded-none !border-y-0 !border-l-0 !px-1"
      @click="handleLeftBtnClick"
    >
    </ElButton>

    <div
      ref="tabsWrapperRef"
      class="wrapper scroll-hide relative flex flex-1 items-stretch overflow-auto scroll-smooth"
    >
      <!-- 选中状态背景 -->
      <div
        ref="sliderElementRef"
        class="absolute left-0 h-full w-20 rounded border bg-[--el-color-primary-light-9] transition-all duration-500"
      ></div>
      <!-- tab 标签 -->
      <div
        v-for="route in routeHistories"
        ref="tabElementsRef"
        :name="route.id"
        :key="route.name"
        class="group flex shrink-0 items-center rounded text-xs"
        :class="{
          'pr-2': route.name !== ROUTE_NAMES.dashboard
        }"
      >
        <button
          size="small"
          class="h-full transition delay-200 duration-300 group-hover:translate-x-0 group-hover:text-[--el-color-primary]"
          :class="{
            'translate-x-0': activeTab === route.name,
            'translate-x-3': route.name !== ROUTE_NAMES.dashboard && activeTab !== route.name,
            'px-2': route.name !== ROUTE_NAMES.dashboard,
            'px-4': route.name === ROUTE_NAMES.dashboard
          }"
          type="button"
          @click="handleTabClick(route.name)"
        >
          {{ route.meta?.title }}
        </button>
        <button
          v-if="route.name !== ROUTE_NAMES.dashboard"
          type="button"
          class="scale-0 rounded-full transition delay-200 duration-300 hover:bg-[--el-color-primary-light-7] group-hover:scale-100"
          :class="{ 'scale-100': activeTab === route.name }"
          @click="handleTabClose(route.name)"
        >
          <IconEpClose />
        </button>
      </div>
    </div>

    <ElButton
      v-if="showRightButton"
      :icon="IconEpArrowRight"
      class="!h-full w-6 !rounded-none !border-y-0 !border-r-0 !px-1"
      @click="handleRightBtnClick"
    >
    </ElButton>

    <!-- 标签操作 -->
    <ElDropdown trigger="click">
      <ElButton
        :icon="IconEpArrowDown"
        class="!h-full w-8 shrink-0 !rounded-none !border-y-0 !px-1"
      >
      </ElButton>
      <template #dropdown>
        <ElDropdownMenu>
          <ElDropdownItem @click="handleRefreshPage" :icon="IconEpRefresh">
            重新加载内容
          </ElDropdownItem>
          <ElDropdownItem
            @click="handleTabClose(activeTab!)"
            :icon="IconEpClose"
            divided
            :disabled="disableCloseActiveTab"
          >
            关闭当前标签页
          </ElDropdownItem>
          <ElDropdownItem
            @click="handleOtherTabsClose"
            :disabled="disableCloseOtherTabs"
            :icon="IconEpAim"
          >
            关闭其它标签页
          </ElDropdownItem>
          <ElDropdownItem
            @click="handleAllTabsClose"
            :icon="IconEpMinus"
            :disabled="disableCloseAllTabs"
          >
            关闭所有标签页
          </ElDropdownItem>
          <ElDropdownItem
            divided
            :icon="contentFullscreen ? IconRiFullscreenExitLine : IconEpFullScreen"
            @click="handleContentFullscreen"
          >
            内容区{{ contentFullscreen ? '退出' : '' }}全屏
          </ElDropdownItem>
        </ElDropdownMenu>
      </template>
    </ElDropdown>
  </div>
</template>

<script setup lang="ts">
import IconEpArrowLeft from '~icons/ep/arrow-left'
import IconEpArrowRight from '~icons/ep/arrow-right'
import IconEpArrowDown from '~icons/ep/arrow-down'
import IconEpClose from '~icons/ep/close'
import IconEpMinus from '~icons/ep/minus'
import IconEpFullScreen from '~icons/ep/full-screen'
import IconRiFullscreenExitLine from '~icons/ri/fullscreen-exit-line'
import IconEpRefresh from '~icons/ep/refresh'
import IconEpAim from '~icons/ep/aim'
import { ROUTE_NAMES } from '@/constants'
import { useAppStore, useUserStore } from '@/stores'
import type { RouteRecordName } from 'vue-router'
import { AppEmitter, appEmitter } from '@/helpers'
import { useResizeObserver } from '@vueuse/core'

const router = useRouter()
const currentRoute = useRoute()
const { flatMenus } = useUserStore()
const menus = flatMenus()
const activeTab = ref<RouteRecordName>()
const showLeftButton = ref(false)
const showRightButton = ref(false)
const tabElementsRef = ref<HTMLElement[]>([])
const sliderElementRef = ref<HTMLElement>()
const tabsWrapperRef = ref<HTMLElement>()
const { contentFullscreen, activeMenuId, routeHistories } = storeToRefs(useAppStore())

if (routeHistories.value.length === 0) {
  routeHistories.value = [menus.find((menu) => menu.name === ROUTE_NAMES.dashboard)!]
}

const disableCloseOtherTabs = computed(() => {
  return (
    routeHistories.value.length < 2 ||
    (routeHistories.value.length === 2 && activeTab.value !== ROUTE_NAMES.dashboard)
  )
})

const disableCloseActiveTab = computed(() => {
  return activeTab.value === ROUTE_NAMES.dashboard
})

const disableCloseAllTabs = computed(() => {
  return routeHistories.value.length < 2
})

useResizeObserver(tabsWrapperRef, () => {
  setTabsBarState()
})

watch(activeTab, (routeName: RouteRecordName | undefined) => {
  activeMenuId.value = menus.find((menu) => menu.name === routeName)?.id || ''
})

watch(
  currentRoute,
  () => {
    handleRouteChange()
  },
  {
    immediate: true
  }
)

/** 关闭当前 tab 标签页 */
const handleTabClose = (targetName: RouteRecordName) => {
  const targetIndex = routeHistories.value.findIndex((ttab) => ttab.name === targetName)
  const nextTab = routeHistories.value[targetIndex - 1].name

  routeHistories.value = routeHistories.value.filter((ttab) => ttab.name !== targetName)

  if (activeTab.value === targetName) {
    activeTab.value = nextTab

    // 触发路由改变监听事件
    router.push({
      name: activeTab.value
    })
  } else {
    setTabsBarState()
  }
}

/** 关闭其它 tab 标签页 */
const handleOtherTabsClose = () => {
  routeHistories.value = routeHistories.value.filter(
    (ttab) => ttab.name === activeTab.value || ttab.name === ROUTE_NAMES.dashboard
  )

  setTabsBarState()
}

/** 关闭所有 tab 标签页 */
const handleAllTabsClose = () => {
  activeTab.value = routeHistories.value[0].name
  routeHistories.value = [routeHistories.value[0]]

  router.push({
    name: activeTab.value
  })

  setTabsBarState()
}

/** tab 的点击事件 */
const handleTabClick = (targetName: RouteRecordName) => {
  if (targetName !== activeTab.value) {
    const menu = menus.find((tmenu) => tmenu.name === targetName)
    if (menu) {
      router.push({
        name: menu.name
      })
    }
  }
}

/** 向右滚动 */
const handleRightBtnClick = () => {
  const tabsWrapperElement = tabsWrapperRef.value
  if (tabsWrapperElement) {
    const rightPosition = tabsWrapperElement.scrollLeft + tabsWrapperElement.clientWidth
    const rightElement = tabElementsRef.value.find(
      (tab) => tab?.offsetLeft + tab?.offsetWidth > rightPosition
    )

    if (rightElement) {
      tabsWrapperElement.scrollTo({
        left: rightElement.offsetLeft
      })
    }
  }
}

/** 向左滚动 */
const handleLeftBtnClick = () => {
  const tabsWrapperElement = tabsWrapperRef.value
  if (tabsWrapperElement) {
    const scrollLeft = tabsWrapperElement.scrollLeft
    const leftElement = tabElementsRef.value.find(
      (tab) => tab?.offsetLeft + tab?.offsetWidth >= scrollLeft
    )

    if (leftElement) {
      const leftPosition =
        scrollLeft -
        tabsWrapperElement.clientWidth +
        leftElement.offsetWidth -
        (scrollLeft - leftElement.offsetLeft)
      tabsWrapperElement.scrollTo({
        left: leftPosition > 0 ? leftPosition : 0
      })
    }
  }
}

/** 全屏内容区域 */
const handleContentFullscreen = () => {
  contentFullscreen.value = !contentFullscreen.value

  setTabsBarState(150)
}

/** 刷新页面 */
const handleRefreshPage = () => {
  appEmitter.emit(AppEmitter.REFRESH_VIEW)
}

/** 路由改变时的处理逻辑 */
function handleRouteChange() {
  // 查找当前的路由菜单
  const menu = menus.find((menu) => menu.name === currentRoute.name)
  // 如果当前菜单中存在路由菜单
  if (menu) {
    // 如果当前路由菜单没有被添加到 tabs
    if (!routeHistories.value.some((tmenu) => tmenu.name === currentRoute.name)) {
      routeHistories.value.push(menu)
    }

    activeTab.value = menu.name

    setTabsBarState()
  }
}

/** 判断是否显示左右滚动按钮 */
function checkTabsScrollButton() {
  const tabsWrapperElement = tabsWrapperRef.value

  if (tabsWrapperElement) {
    const totalTabsWidth = tabElementsRef.value.reduce((totalWidth, currentItem) => {
      return totalWidth + currentItem.offsetWidth
    }, 0)
    showLeftButton.value = showRightButton.value = totalTabsWidth > tabsWrapperElement.clientWidth
  }
}

/** 滚动到激活的 tab */
function scrollToActiveTab() {
  // 获取当前激活的 tab 对应的 route 信息
  const tactiveTab = routeHistories.value.find((route) => route.name === activeTab.value)
  // 获取当前激活的 tab 元素
  const activeTabElement = tabElementsRef.value.find(
    (tabRef) => tabRef.getAttribute('name') === tactiveTab?.id
  )
  const sliderElement = sliderElementRef.value
  const tabsWrapperElement = tabsWrapperRef.value

  if (activeTabElement && sliderElement && tabsWrapperElement) {
    sliderElement.style.left = `${activeTabElement.offsetLeft}px`
    sliderElement.style.width = `${activeTabElement.offsetWidth}px`

    if (
      activeTabElement.offsetLeft < tabsWrapperElement.scrollLeft ||
      activeTabElement.offsetLeft + activeTabElement.offsetWidth >
        tabsWrapperElement.scrollLeft + tabsWrapperElement.clientWidth
    ) {
      activeTabElement.scrollIntoView({
        block: 'nearest',
        inline: 'nearest'
      })
    }
  }
}

/** 检查和设置 tab 工具栏的各种状态 */
async function setTabsBarState(time?: number) {
  await nextTick()

  setTimeout(async () => {
    checkTabsScrollButton()
    await nextTick()
    scrollToActiveTab()
  }, time || 0)
}
</script>
