<template>
  <div class="grid min-h-screen grid-cols-[min-content_1fr] grid-rows-[min-content_1fr]">
    <header
      class="app-header-blur sticky left-0 top-0 z-20 col-span-2 h-[--app-header-height] w-full items-center border-b-2 border-b-[--el-border-color] transition-[height]"
      :class="{
        '!h-0 overflow-hidden border-none': contentFullscreen
      }"
    >
      <MainHeader />
    </header>
    <aside
      class="sticky left-0 top-14 z-10 h-[calc(100vh_-_theme(spacing.14))] w-[--app-aside-width] border-r-2 border-[--el-border-color] bg-[--el-bg-color] transition-[width]"
      :class="{
        '!w-0 overflow-hidden border-none': contentFullscreen
      }"
    >
      <MainAside />
    </aside>
    <main class="flex min-w-0 flex-col bg-gray-200 dark:bg-[--el-bg-color]">
      <RouteTabs
        class="sticky left-0 z-10"
        :class="{
          'top-[--app-header-height]': !contentFullscreen,
          'top-0': contentFullscreen
        }"
      />

      <div class="flex-1 p-[--app-main-padding]">
        <RouterView v-slot="{ Component }">
          <Transition name="app-ani" mode="out-in">
            <component v-if="!isRefreshView" :is="Component" />
          </Transition>
        </RouterView>
      </div>

      <Copyright />
    </main>
  </div>
</template>

<script setup lang="ts">
import MainHeader from '../components/MainHeader.vue'
import MainAside from '../components/MainAside.vue'
import Copyright from '@/components/Copyright.vue'
import RouteTabs from '../components/RouteTabs.vue'
import { useAppStore } from '@/stores'

defineProps<{
  isRefreshView: boolean
}>()

const { contentFullscreen } = storeToRefs(useAppStore())
</script>

<script lang="ts">
export default {
  name: 'LayoutDefaultView'
}
</script>
