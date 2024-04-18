<template>
  <div class="flex h-full items-stretch pl-5">
    <div class="hidden shrink-0 md:flex md:items-center">
      <IconCustomLogo class="text-2xl" />
      <span class="ml-2 text-sm font-semibold opacity-80">ZHT-LEARN</span>
    </div>

    <slot></slot>

    <div class="ml-auto shrink-0">
      <ElButton
        v-if="showSearch"
        class="!hidden !h-full !border-0 !text-xl lg:!inline-flex"
        size="default"
        :icon="IconRiSearchLine"
      />
      <ElDropdown size="default" class="!h-full" trigger="click">
        <ElButton class="!h-full !border-0">
          <div class="flex items-center">
            <ElAvatar :src="user.avatar" fit="cover" class="mr-2 !h-7 !w-7">
              <img src="@/assets/login-draw.svg" alt="logo" />
            </ElAvatar>
            {{ user.name }}
          </div>
        </ElButton>
        <template #dropdown>
          <ElDropdownMenu>
            <ElDropdownItem :icon="IconLogoutBoxLine" @click="onLogoutBtnClick">
              退出系统
            </ElDropdownItem>
          </ElDropdownMenu>
        </template>
      </ElDropdown>
      <ElButton
        v-if="showSetting"
        size="default"
        class="!h-full !border-0 !text-xl"
        :icon="IconRiSettings4Line"
        @click="onSettingsBtnClick"
      />
    </div>

    <AppSettings v-if="showSetting" v-model="showSettins" />
  </div>
</template>

<script setup lang="ts">
import { useUserStore } from '@/stores'
import IconRiSearchLine from '~icons/ri/search-line'
import IconRiSettings4Line from '~icons/ri/settings-4-line'
import IconLogoutBoxLine from '~icons/ri/logout-box-line'
import IconCustomLogo from '~icons/custom/logo'
import AppSettings from '@/components/AppSettings.vue'

withDefaults(
  defineProps<{
    showSetting?: boolean
    showSearch?: boolean
  }>(),
  {
    showSetting: true,
    showSearch: true
  }
)

const { user, logout } = useUserStore()
const showSettins = ref<boolean>(false)

const onLogoutBtnClick = () => {
  logout()
}

const onSettingsBtnClick = () => {
  showSettins.value = true
}
</script>
