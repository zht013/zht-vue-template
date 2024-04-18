<template>
  <template v-for="item in props.menus" :key="item.name">
    <ElMenuItem v-if="!item.children" :index="item.id">
      <RouterLink :to="{ name: item.name }" class="w-full overflow-hidden text-ellipsis">
        <ElIcon v-if="item.meta?.icon">
          <component :is="item.meta?.icon"></component>
        </ElIcon>
        {{ item.meta?.title }}
      </RouterLink>
    </ElMenuItem>

    <ElSubMenu v-else-if="item.children && item.children.length > 0" :index="item.id">
      <template #title>
        <ElIcon v-if="item.meta?.icon">
          <component :is="item.meta?.icon"></component>
        </ElIcon>
        {{ item.meta?.title }}
      </template>
      <NavMenus :menus="item.children" />
    </ElSubMenu>
  </template>
</template>

<script setup lang="ts">
import NavMenus from './NavMenus.vue'
import type { AppMenu } from '@/types'

const props = withDefaults(
  defineProps<{
    /**
     * 用户可访问的导航菜单列表
     */
    menus: AppMenu[]
    // /**
    //  * 父导航在路由列表中index值
    //  */
    // parentIndex?: number
  }>(),
  {
    menus: () => []
  }
)
</script>
