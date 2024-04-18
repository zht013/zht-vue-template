<template>
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

<script setup lang="ts">
import NavMenus from './NavMenus.vue'
import type { AppMenu } from '@/types'

defineProps<{
  item: AppMenu
}>()
</script>
