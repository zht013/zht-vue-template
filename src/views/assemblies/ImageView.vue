<template>
  <div>
    <ElCard>
      <template #header> 基础用法 </template>

      <ElSpace wrap>
        <ElCard v-for="fit in fits" :key="fit" class="h-48 w-48 text-center">
          <span>{{ fit }}</span>
          <ElImage :src="baseUrl" :fit="fit" class="mx-auto !block h-[100px] w-[100px]" />
        </ElCard>
      </ElSpace>
    </ElCard>

    <ElCard class="mt-4">
      <template #header> 占位符 / 加载失败 </template>

      <div class="flex flex-col flex-wrap gap-3 lg:flex-row">
        <ElCard class="flex-1 text-center">
          <span>Default</span>
          <ElImage :src="placeholderUrl" fit="contain" class="!block h-64" />
        </ElCard>

        <ElCard class="flex-1 text-center">
          <span>Custom</span>
          <ElImage :src="placeholderUrl" fit="contain" class="!block h-64">
            <template #placeholder>
              <div class="flex h-full items-center justify-center rounded-lg bg-gray-100">
                <span class="animate-bounce">Loading...</span>
              </div>
            </template>

            <template #error>
              <div
                class="flex h-full items-center justify-center rounded-lg bg-gray-200 text-3xl opacity-35"
              >
                <IconEpPicture />
              </div>
            </template>
          </ElImage>
        </ElCard>
      </div>
    </ElCard>

    <ElCard class="mt-4">
      <template #header> 懒加载 </template>

      <div class="h-96 overflow-auto">
        <ElImage
          v-for="url in lazyUrls"
          :key="url"
          :src="url"
          fit="contain"
          lazy
          class="mx-auto !block h-[500px]"
        />
      </div>
    </ElCard>

    <ElCard class="mt-4">
      <template #header> 预览 </template>

      <ElImage
        :src="baseUrl"
        :zoom-rate="1.2"
        :max-scale="7"
        :min-scale="0.2"
        :preview-src-list="lazyUrls"
        :initial-index="4"
        fit="cover"
        class="h-52 w-52"
      />
    </ElCard>
  </div>
</template>

<script setup lang="ts">
import type { EpPropMergeType } from 'element-plus/lib/utils'

const fits: Array<
  | EpPropMergeType<
      StringConstructor,
      '' | 'fill' | 'contain' | 'cover' | 'none' | 'scale-down',
      unknown
    >
  | undefined
> = ['fill', 'contain', 'cover', 'none', 'scale-down']
const baseUrl = 'https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg'
const placeholderUrl = '/api/file/placeholder'
const lazyUrls = [
  'https://fuss10.elemecdn.com/a/3f/3302e58f9a181d2509f3dc0fa68b0jpeg.jpeg',
  'https://fuss10.elemecdn.com/1/34/19aa98b1fcb2781c4fba33d850549jpeg.jpeg',
  'https://fuss10.elemecdn.com/0/6f/e35ff375812e6b0020b6b4e8f9583jpeg.jpeg',
  'https://fuss10.elemecdn.com/9/bb/e27858e973f5d7d3904835f46abbdjpeg.jpeg',
  'https://fuss10.elemecdn.com/d/e6/c4d93a3805b3ce3f323f7974e6f78jpeg.jpeg',
  'https://fuss10.elemecdn.com/3/28/bbf893f792f03a54408b3b7a7ebf0jpeg.jpeg',
  'https://fuss10.elemecdn.com/2/11/6535bcfb26e4c79b48ddde44f4b6fjpeg.jpeg'
]
</script>
