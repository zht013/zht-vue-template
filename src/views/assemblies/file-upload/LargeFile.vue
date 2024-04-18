<template>
  <ElCard class="mt-4">
    <template #header> 大文件上传(单文件示例) </template>
    <ElUpload
      action="/api/file/upload"
      ref="uploadRef"
      :limit="1"
      :show-file-list="true"
      :on-exceed="handleExceed"
      :auto-upload="false"
      :before-upload="handleBeforeUpload"
      :http-request="handleUpload"
      :disabled="uploading"
      :on-remove="handleFileRemove"
    >
      <template #trigger>
        <el-button type="primary">选择文件</el-button>
      </template>
      <el-button :disabled="uploading" class="ml-3" type="success" @click="onUploadBtnClick">
        上传文件到服务器
      </el-button>
      <el-button v-show="canCancelUpload" class="ml-3" @click="handleCancelUpload">
        取消上传
      </el-button>

      <template #tip>
        <div class="el-upload__tip !text-red-500">
          limit 1 file, new file will cover the old file
        </div>
      </template>
    </ElUpload>
    <p v-if="fileHashError">
      文件hash失败：<span class="text-red-500">{{ fileHashError }}</span>
    </p>
    <p v-else>
      文件Hash进度：{{
        fileHashCode ? fileHashCode : hashPercentage ? hashPercentage.toFixed(2) + '%' : ''
      }}
    </p>
  </ElCard>
</template>

<script setup lang="ts">
import { sparkMd5File } from '@/utils'
import {
  type UploadInstance,
  type UploadProps,
  type UploadRawFile,
  genFileId,
  type UploadRequestOptions,
  type UploadProgressEvent
} from 'element-plus'
import { fileService } from '@/services/FileService'
import { appMessageBox } from '@/helpers'
import type { AxiosProgressEvent } from 'axios'

const uploadRef = ref<UploadInstance>()
const minFileChunkSize = 1024 * 1024 * 100
/** 10MB 的分片大小 */
const chunkSize = 1024 * 1024 * 10
// 生成文件hash的进度
const hashPercentage = ref(0)
/** 文件 Hash 值 */
const fileHashCode = ref<string>()
/** 文件 Hash 错误信息 */
const fileHashError = ref<string>()
/** 是否正在上传 */
const uploading = ref(false)
/** 取消请求的控制器 */
let reqAbortController: AbortController | undefined = new AbortController()
/** 是否可以取消上传 */
const canCancelUpload = ref(false)

const handleExceed: UploadProps['onExceed'] = (files: File[]) => {
  uploadRef.value!.clearFiles()

  hashPercentage.value = 0
  fileHashCode.value = ''
  fileHashError.value = ''

  const file = files[0] as UploadRawFile
  file.uid = genFileId()
  uploadRef.value!.handleStart(file)
}

/** 对文件进行 MD5 Hash */
const handleBeforeUpload: UploadProps['beforeUpload'] = async (file: UploadRawFile) => {
  // 设置正在上传标志
  uploading.value = true

  fileHashCode.value = await sparkMd5File(file, (percentage: number) => {
    hashPercentage.value = percentage
  }).catch((reason: string) => {
    fileHashError.value = reason
    // 如果出错，取消正在上传的标志
    uploading.value = false

    return undefined
  })

  return !!fileHashCode.value
}

const handleFileRemove: UploadProps['onRemove'] = () => {
  hashPercentage.value = 0
  fileHashCode.value = ''
  fileHashError.value = ''
}

/** 上传文件 */
const onUploadBtnClick = () => {
  uploadRef.value!.submit()
}

const handleUpload: UploadProps['httpRequest'] = async (
  options: UploadRequestOptions
): Promise<unknown> => {
  if (options.file.size > minFileChunkSize) {
    /** 此时可以取消上传 */
    canCancelUpload.value = true

    batchUpload(options)
  } else {
    const result = await fileService.uploadFile(options.file, {
      onUploadProgress(aevt: AxiosProgressEvent) {
        const progressEvt = aevt.event as UploadProgressEvent
        progressEvt.percent = (aevt.progress ?? 0) * 100
        options.onProgress(progressEvt)
      }
    })
    if (!result.success) {
      appMessageBox.alert(result.message)
    } else {
      appMessageBox.alert('上传成功')
    }

    uploading.value = false
  }

  return
}

const batchUpload = async (options: UploadRequestOptions) => {
  const file = options.file
  const chunkCount = Math.ceil(file.size / chunkSize) // 计算切片数量

  for (let i = 0; i < chunkCount; i++) {
    if (!uploading.value) return // 如果上传已取消，则不再上传其余切片

    const start = i * chunkSize
    const end = Math.min(file.size, start + chunkSize)
    const chunkFile = file.slice(start, end)

    try {
      const result = await fileService.uploadFile(chunkFile as File, {
        signal: reqAbortController?.signal
      })

      // 更新上传进度条
      options.onProgress({
        percent: ((i + 1) / chunkCount) * 100
      } as UploadProgressEvent)

      if (!result.success) {
        throw new Error(result.message)
      }

      if (i === chunkCount - 1) {
        setTimeout(() => {
          options.onSuccess(true)
        }, 300)

        canCancelUpload.value = false
        uploading.value = false
        fileService.mergeFile(fileHashCode.value!)
      }
    } catch (err: any) {
      appMessageBox.alert(err.message ? err.message : `上传失败 [${i}]${file.name}`)

      options.onError({
        name: `[${i}]${file.name}`,
        message: `[${i}]${file.name}`,
        status: 0,
        method: 'post',
        url: '',
        cause: `[${i}]${file.name}`
      })

      handleCancelUpload()

      return
    }
  }
}

const handleCancelUpload = () => {
  reqAbortController?.abort()
  uploadRef.value!.clearFiles()

  // 清理状态
  canCancelUpload.value = false
  uploading.value = false
  hashPercentage.value = 0
  fileHashCode.value = ''
  fileHashError.value = ''

  // 通知服务器
  fileService.cancelUpload(fileHashCode.value)
}
</script>
