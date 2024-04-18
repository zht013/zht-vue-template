<template>
  <div class="flex min-h-screen flex-col">
    <header
      class="app-header-blur sticky left-0 top-0 z-20 h-[--app-header-height] items-center border-b-2 border-b-[--el-border-color] transition-[height]"
      :class="{
        '!h-0 overflow-hidden border-none': contentFullscreen
      }"
    >
      <MainHeader>
        <MainAside :horizontal="true" class="min-w-0 flex-1 px-2" />
      </MainHeader>
    </header>

    <main class="flex min-w-0 flex-1 flex-col bg-gray-200 dark:bg-[--el-bg-color]">
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
import MainAside from '../components/MainAside.vue'
import MainHeader from '../components/MainHeader.vue'
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
