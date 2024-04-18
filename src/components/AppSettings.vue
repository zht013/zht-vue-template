<template>
  <ElDrawer
    v-model="showSettings"
    class="app-drawer"
    title="项目配置"
    :append-to-body="true"
    @closed="onDrawerClosed"
  >
    <h2 class="mb-2">整体风格</h2>
    <ElRadioGroup v-model="theme">
      <ElRadioButton label="浅色" :value="ThemeType.light" />
      <ElRadioButton label="深色" :value="ThemeType.dark" />
    </ElRadioGroup>
    <h2 class="mb-2 mt-8">导航模式</h2>
    <ElRadioGroup v-model="temLayoutType" @change="onLayoutModeChanged">
      <ElRadio
        v-for="(item, index) in layouts"
        :key="item.id"
        :border="true"
        class="hide-radio-btn !h-auto !p-0"
        :value="item.id"
      >
        <ElTooltip :content="item.desc" placement="top">
          <div class="relative h-10 w-12 rounded border border-gray-500 bg-gray-200">
            <div
              v-if="index === 0"
              class="absolute top-1/4 h-3/4 w-1/4 rounded-s-sm bg-gray-500"
              :class="{ 'z-10': index === 0 }"
            ></div>
            <div
              class="absolute h-1/4 w-full rounded-s-sm bg-white"
              :class="{ 'bg-gray-500': index === 1 }"
            ></div>
          </div>
        </ElTooltip>
      </ElRadio>
    </ElRadioGroup>
  </ElDrawer>
</template>

<script setup lang="ts">
import { AppEmitter, appEmitter } from '@/helpers'
import { useAppStore } from '@/stores'
import { LayoutType, ThemeType } from '@/types'

const showSettings = defineModel<boolean>()
const { theme, layoutType } = storeToRefs(useAppStore())
const temLayoutType = ref(layoutType.value)
const layouts = [
  {
    id: LayoutType.default,
    desc: '默认'
  },
  {
    id: LayoutType.concise,
    desc: '简洁'
  }
]

const onLayoutModeChanged = (value: string | number | boolean | undefined) => {
  showSettings.value = false
  appEmitter.emit(AppEmitter.SAVE_APP_LAYOUT, value as LayoutType)
}

const onDrawerClosed = () => {
  layoutType.value = temLayoutType.value
}
</script>

<style scoped>
.hide-radio-btn {
  &.is-checked {
    border-width: 2px;
  }

  :deep(.el-radio__input) {
    display: none !important;
  }

  :deep(.el-radio__label) {
    padding: 0;
  }
}
</style>
