<template>
  <div class="flex min-h-screen flex-col">
    <header
      class="app-header-blur sticky left-0 top-0 z-20 flex h-14 items-center border-b-2 border-b-[--el-border-color]"
    >
      <ElButton
        :icon="IconEpExpand"
        @click="showMenus = true"
        class="!h-full !border-none !text-2xl opacity-70"
      ></ElButton>

      <MainHeader class="flex-1 !pl-0" :show-setting="false" :show-search="false" />
    </header>

    <main class="flex-1 p-[--app-main-padding]">
      <RouterView v-slot="{ Component }">
        <Transition name="app-ani" mode="out-in">
          <component v-if="!isRefreshView" :is="Component" />
        </Transition>
      </RouterView>
    </main>

    <ElDrawer
      v-model="showMenus"
      :with-header="false"
      direction="ltr"
      class="app-menus-drawer !w-4/5 sm:!w-1/2 lg:!w-1/3"
    >
      <ElMenu
        class="!border-r-0"
        menu-trigger="click"
        :default-active="activeMenuId"
        @select="() => (showMenus = false)"
      >
        <NavMenus :menus="menus"></NavMenus>
      </ElMenu>
    </ElDrawer>
  </div>
</template>

<script setup lang="ts">
import IconEpExpand from '~icons/ep/expand'
import { useAppStore, useUserStore } from '@/stores'
import MainHeader from '../components/MainHeader.vue'
import NavMenus from '../components/NavMenus.vue'

defineProps<{
  isRefreshView: boolean
}>()

/** 是否显示菜单 */
const showMenus = ref<boolean>()
// 用户菜单列表
const { menus, flatMenus } = useUserStore()
// 当前激活的菜单
const { activeMenuId } = storeToRefs(useAppStore())
// 当前路由
const currentRoute = useRoute()

onMounted(() => {
  // 设置当前激活的菜单
  activeMenuId.value = flatMenus().find((menu) => menu.name === currentRoute.name)?.id || ''
})
</script>

<style>
.app-menus-drawer .el-drawer__body {
  padding: 0;
}
</style>
