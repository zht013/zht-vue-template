<template>
  <nav class="h-full">
    <ElMenu
      v-if="horizontal"
      class="app-nav-hor !h-[calc(100%_+_2px)] !border-b-0 !bg-transparent"
      mode="horizontal"
      menu-trigger="click"
      :unique-opened="true"
      :close-on-click-outside="true"
      :default-active="activeMenuId"
    >
      <NavMenuItem v-for="item in menus" :key="item.name" :item="item" />
      <!-- <NavMenus :menus="menus"></NavMenus> -->
    </ElMenu>
    <ElScrollbar v-else>
      <ElMenu
        class="!border-r-0"
        :collapse="collapsed"
        :unique-opened="false"
        :default-active="activeMenuId"
      >
        <NavMenuItem v-for="item in menus" :key="item.name" :item="item" />
        <!-- <NavMenus :menus="menus"></NavMenus> -->
      </ElMenu>
    </ElScrollbar>
  </nav>
</template>

<script setup lang="ts">
import { useAppStore, useUserStore } from '@/stores'
import NavMenuItem from './NavMenuItem.vue'

withDefaults(
  defineProps<{
    collapsed?: boolean
    horizontal?: boolean
  }>(),
  {
    collapsed: false,
    horizontal: false
  }
)

// 用户菜单列表
const { menus } = useUserStore()
// 设置当前激活的菜单
const { activeMenuId } = storeToRefs(useAppStore())

/** 当前路由的路径列表 */
// const matchedMenus = route.matched.filter((menu) => menu.meta.isMenu)
/** 页面加载时默认激活的菜单 index */
// let activeMenuIndex = String(menus.findIndex((menu) => menu.name === matchedMenus[0].name) + 1)
// let activeMenuId = flatMenus().find((menu) => menu.name === route.name)?.id
/** 需要自动打开的父级导航菜单index */
// const openSubmenuIndexs: string[] = []

// 组织需要激活的菜单和需要打开的父级菜单的数据
// if (matchedMenus[0].children && matchedMenus[0].children.length > 0) {
//   for (let i = 1; i < matchedMenus.length; i++) {
//     openSubmenuIndexs.push(activeMenuIndex)

//     const index = String(
//       matchedMenus[i - 1].children.findIndex((menu) => menu.name === matchedMenus[i].name) + 1
//     )
//     activeMenuIndex += '-' + index
//   }
// }
</script>

<style>
.app-nav-hor .el-sub-menu__title {
  background-color: transparent !important;
}
</style>
