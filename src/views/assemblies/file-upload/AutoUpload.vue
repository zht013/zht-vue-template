<template>
  <ElCard>
    <template #header>
      综合示例
      <span class="text-sm">
        （自动上传
        、拖拽上传、拖拽排序、设置请求头、上传进度、大图预览、多选文件、最大文件数量、文件类型限制、文件大小限制、删除文件）
      </span>
    </template>

    <p v-if="fileList.length > 0" class="mb-3">
      {{ imgInfos }}
    </p>
    <ElUpload
      v-model:file-list="fileList"
      class="z-upload"
      action="https://run.mocky.io/v3/3aa761d7-b0b3-4a03-96b3-6168d4f7467b"
      list-type="picture-card"
      :accept="acceptTypes"
      :auto-upload="true"
      :limit="5"
      :drag="true"
      :multiple="true"
      :headers="{ Authorization: authorize.token }"
      :on-error="onUploadError"
      :on-exceed="onUploadExceed"
      :before-upload="onBeforeUpload"
      :before-remove="onBeforeRemove"
      :on-preview="onPreviewImg"
    >
      <ElIcon class="!text-2xl !font-medium">
        <IconEpPlus />
      </ElIcon>

      <template #file="{ file }">
        <div v-if="file.status == 'ready' || file.status == 'uploading'" class="m-auto mt-[35%]">
          <p class="font-medium">文件上传中</p>
          <el-progress
            class="mt-2"
            :stroke-width="2"
            :text-inside="true"
            :show-text="false"
            :percentage="file.percentage"
          />
        </div>
      </template>

      <template #tip>
        <div class="el-upload__tip">可拖拽上传最多3张单个不超过30KB且格式为jpeg/png/gif的图片</div>
      </template>
    </ElUpload>

    <ElImageViewer
      v-if="imgViewerVisible"
      :url-list="imgUrls"
      :initial-index="curOpenImgIndex"
      @close="imgViewerVisible = false"
    >
    </ElImageViewer>
  </ElCard>
</template>

<script setup lang="ts">
import { authorize } from '@/helpers'
import Sortable from 'sortablejs'
import { moveArrayElement } from '@/utils'
import type { UploadFile, UploadRawFile, UploadUserFile } from 'element-plus'

const acceptTypes = 'image/jpeg,image/png,image/gif'
const fileList = ref<UploadUserFile[]>([])
const imgInfos = computed(() =>
  fileList.value.map((file) => ({
    name: file.name,
    size: file.size
  }))
)
const imgUrls = computed(
  () => fileList.value.map((file) => file.url).filter((item) => (item ? true : false)) as string[]
)
const imgViewerVisible = ref(false)
let sortable: Sortable | undefined

onMounted(() => {
  sortable = Sortable.create(document.querySelector('.el-upload-list') as HTMLElement, {
    animation: 120,
    direction: 'horizontal',
    draggable: '.el-upload-list__item',
    filter: '.el-upload--picture-card',
    swapThreshold: 0.5,
    onUpdate: (evt: Sortable.SortableEvent) => {
      fileList.value = moveArrayElement<UploadUserFile>(
        fileList.value,
        evt.oldIndex!,
        evt.newIndex!
      )
    }
  })
})

onUnmounted(() => {
  sortable?.destroy()
  sortable = undefined
})

const onUploadError = (error: Error) => {
  ElMessage.error(error.message)
}

const onUploadExceed = () => {
  ElMessage.warning('最多上传3张图片，请先删除在上传')
}

const onBeforeUpload = (file: UploadRawFile) => {
  if (!acceptTypes.includes(file.type)) {
    ElMessage.warning('只能上传图片')

    return false
  }

  const isExceed = file.size / 1024 > 30
  if (isExceed) {
    ElMessage.warning(`单个图片大小不能超过30KB`)

    return false
  }
}

const onBeforeRemove = (file: UploadFile) => {
  console.log(file.name)

  return true
}

const curOpenImgIndex = ref(0)
const onPreviewImg = (tfile: UploadFile) => {
  curOpenImgIndex.value = fileList.value.findIndex((file) => file.uid === tfile.uid)
  imgViewerVisible.value = true
}
</script>

<style scoped>
.z-upload :deep(.el-upload-dragger) {
  border: none;
  background-color: transparent;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
