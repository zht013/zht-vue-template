<template>
  <ElCard>
    <!-- 大文件上传示例1 -->
    <ElUpload
      ref="upload"
      class="upload-demo"
      action="https://run.mocky.io/v3/9d059bf9-4660-45f2-925d-ce80ad6c4d15"
      :limit="1"
      :on-change="handleFileChange"
      :auto-upload="false"
    >
      <template #trigger>
        <ElButton type="primary">选择文件</ElButton>
      </template>
      <ElButton :disabled="uploadDisabled" class="ml-3" type="success" @click="handlerUpload">
        上传
      </ElButton>
      <ElButton class="ml-3" type="success" @click="handlePause">暂停</ElButton>
      <ElButton class="ml-3" type="success" @click="handleResume">恢复</ElButton>
      <ElButton class="ml-3" type="success" @click="resetData">重置</ElButton>
      <template #tip>
        <br /><br />
        <span>计算文件hash进度： {{ hashPercentage }}%</span>
        <br /><br />
        <span>上传进度：{{ fakeUploadPercentage }}%</span>
        <ElProgress :text-inside="true" :stroke-width="26" :percentage="fakeUploadPercentage" />
        <div class="el-upload__tip text-red">限制一个文件, 新文件将会覆盖原文件</div>
      </template>
    </ElUpload>
  </ElCard>
</template>

<script setup lang="ts">
// 大文件上传示例1
import { sparkMd5File } from '@/utils'
import type { UploadFile, UploadInstance, UploadProps, UploadRawFile } from 'element-plus'

enum LargeUploadStatus {
  wait = 'wait',
  ready = 'ready',
  pause = 'pause',
  uploading = 'uploading'
}

type FileChunk = {
  size: number
  percentage: number
  chunk: Blob
  index: number
  hash: string
}

interface LargeContainer {
  file: UploadFile
  hash: string
  worker: Worker | undefined
}

interface ReqResult {
  shouldUpload: boolean
  uploadedList: string[]
}

/** 20MB 的分片大小 */
const chunkSize = 1024 * 1024 * 20

const upload = ref<UploadInstance>()
// 当前的请求xhr组成的数组
const requestList = ref<XMLHttpRequest[]>([])
// 组装的filechunk分段文件
let fileChankList = ref<FileChunk[]>([])
const status = ref<string>(LargeUploadStatus.wait)
// 生成文件hash的进度
const hashPercentage = ref(0)
// 显示在页面上的文件上传进度
const fakeUploadPercentage = ref(0)
// 定义上传文件的容器
const container = reactive<LargeContainer>({
  file: {
    name: '',
    percentage: 0,
    status: LargeUploadStatus.ready,
    size: 0,
    url: undefined,
    raw: undefined,
    uid: 0
  },
  hash: '',
  worker: undefined
})

// 计算：文件上传的进度
const uploadPercentage = computed({
  get() {
    if (!container.file || !fileChankList.value.length) return 0

    const loaded = fileChankList.value
      .map((item) => item.size! * item.percentage!)
      .reduce((acc, cur) => {
        return acc + cur
      })

    console.log('loaded', loaded)

    return parseInt((loaded / container.file.size!).toFixed(2))
  },
  set(value) {
    return value
  }
})

// 计算：上传按钮是否可以点击
const uploadDisabled = computed(() => {
  const disabledStatus: string[] = [LargeUploadStatus.pause, LargeUploadStatus.uploading]

  return !container.file || disabledStatus.includes(status.value)
})

// watch uploadPercentage，得到fakeUploadPercentage
// 至于为什么要这么做，看【恢复上传】的注释
watch(uploadPercentage, (newValue) => {
  if (newValue > fakeUploadPercentage.value) {
    fakeUploadPercentage.value = newValue
  }
})

// 选择了文件
const handleFileChange: UploadProps['onChange'] = (uploadFile) => {
  resetData()

  if (!uploadFile) return

  container.file = uploadFile
}

// 上传
const handlerUpload = async () => {
  if (!container.file.raw) return

  // 点了上传按钮，状态改为上传中...
  status.value = LargeUploadStatus.uploading
  // 文件分片
  const chunkList = createFileChunk(container.file.raw)
  console.log('文件分了多少片：', chunkList.length)

  // 通过webworker计算出，文件hash
  container.hash = await sparkMd5File(container.file.raw, (percentage: number) => {
    hashPercentage.value = percentage
  })
  console.log('文件hash是：', container.hash)

  // uploadedList已上传的切片的切片文件名称
  const { shouldUpload, uploadedList } = await verifyUpload(container.file.name, container.hash)
  console.log(shouldUpload, uploadedList)

  // 组装的filechunk数据先置空
  fileChankList.value = []

  // 服务器已经有完整文件了
  if (!shouldUpload) {
    fakeUploadPercentage.value = 100
    status.value = LargeUploadStatus.wait

    await nextTick()

    return ElMessage.success('秒传：上传成功')
  }

  fileChankList.value = chunkList.map((file, index) => ({
    fileHash: container.hash,
    index,
    hash: `${container.hash}-${index}`,
    chunk: file,
    size: file.size,
    // 如果已上传切片数组uploadedList中包含这个切片，则证明这个切片之前已经上传成功了，进度设为100。
    percentage: uploadedList.includes(index.toString()) ? 100 : 0
  }))

  console.log('数组', fileChankList)

  uploadChunks(uploadedList)
}

// 暂停
const handlePause = () => {
  status.value = LargeUploadStatus.pause
  requestList.value.forEach((xhr) => xhr?.abort())
  requestList.value = []
  if (container.worker) {
    container.worker.onmessage = null
  }
}

// 重置
const resetData = () => {
  hashPercentage.value = 0
  uploadPercentage.value = 0
  fakeUploadPercentage.value = 0
  requestList.value.forEach((xhr) => xhr?.abort())
  requestList.value = []
  if (container.worker) {
    container.worker.onmessage = null
  }
}

/**
 * 【恢复上传】
 * 上传进度是实时根据所有的上传切片的进度汇总来的
 * 只有某个切片完整/全部上传到了服务端，才算这个切片上传完成了
 * 如果，一些切片如果只上传了一部分，就被暂停了，那么恢复上传时，这一些切片是需要重新上传的
 * 这样就会导致恢复上传时，上传进度倒退的问题（因为上传进度是计算属性，是实时计算切片，汇总而来的）
 */
const handleResume = async () => {
  status.value = LargeUploadStatus.uploading
  const { uploadedList } = await verifyUpload(container.file.name, container.hash)

  uploadChunks(uploadedList)
}

/**
 * 生成文件切片
 * @param file 上传的文件
 * @param size  文件大小
 * @return
 */
const createFileChunk = (file: UploadRawFile, size = chunkSize) => {
  const chunkList = [] as Blob[]
  let cur = 0
  while (cur < file.size) {
    chunkList.push(file.slice(cur, cur + size))
    cur += size
  }
  return chunkList
}

// /**
//  * 根据文件内容生成hash，而不是根据文件名称生成hash。
//  * 考虑到如果上传一个超大文件，读取文件内容计算 hash 是非常耗费时间的，并且会引起 UI 的阻塞，
//  * 导致页面假死状态，所以我们使用 web-worker 在 worker 线程计算 hash，这样用户仍可以在主界面正常的交互
//  * @param chunkList 切片数组
//  * @return
//  */
// const calculateHash = (chunkList: Blob[]) => {
//   return new Promise<string>((resolve) => {
//     // 开启worker
//     container.worker = new Worker('/hash.js')
//     // 向worker线程传入参数（注意传入的是对象，使用了解构写法）
//     container.worker.postMessage({ fileChunkList: chunkList })
//     // 接受来自worker线程的 加工后的回复
//     container.worker.onmessage = (e: any) => {
//       // console.log('calculateHash_Worker接收的参数', e);
//       const { percentage, hash } = e.data
//       hashPercentage.value = percentage.toFixed(2)
//       // 若得到哈希值，则resolve返回
//       if (hash) {
//         resolve(hash)
//       }
//     }
//   })
// }

// https://blog.51cto.com/u_15091669/2608437  xhr对象POST请求、xhr兼容性、timeout、progress
/**
 * @description: 上传切片进度的回调函数,用闭包保存每个chunk的进度数据
 * @param index 切片的索引
 * @param item 每个切片
 * @return
 */
const createProgressHandler = (index: number, item: FileChunk) => {
  return (e: ProgressEvent) => {
    if (e.lengthComputable) {
      item.percentage = parseInt(String((e.loaded / e.total) * 100))
    }
  }
}

/**
 * 验证该文件是否需要上次，文件通过hash生成唯一，改名后也是不需要再上传的，也就相当于妙传
 * @param filename 文件名
 * @param fileHash 文件哈希值
 * @return
 */
const verifyUpload = async (filename: string, fileHash: string) => {
  const result = await bigUploadRequest({
    url: '/api/file/verify',
    method: 'post',
    headers: { 'content-type': 'application/json' },
    data: JSON.stringify({
      filename,
      fileHash
    })
  })

  return result
}

/**
 * 上传切片，同时过滤已上传的切片
 * @param uploadedList 已经上传了的切片，这次不用上传了
 * @return
 */
const uploadChunks = async (uploadedList: string[] = []) => {
  const reauests = fileChankList.value
    .filter(({ hash }) => !uploadedList.includes(hash))
    .map(({ chunk, hash, index }) => {
      const formData = new FormData()
      // 切片文件
      formData.append('chunk', chunk)
      // 切片文件hash
      formData.append('hash', hash)
      // 大文件的文件名
      formData.append('filename', container.file.name)
      // 大文件hash
      formData.append('fileHash', container.hash)

      return { formData, index }
    })
    .map(async ({ formData, index }) =>
      bigUploadRequest({
        url: '/api/file',
        data: formData,
        onProgress: createProgressHandler(index, fileChankList.value[index]),
        requestList: requestList.value
      })
    )

  // 并发切片
  await Promise.all(reauests)

  // 之前上传的切片数量 + 本次上传的切片数量 = 所有切片数量时
  // 切片并发上传完以后，发个请求告诉后端：合并切片
  if (uploadedList.length + reauests.length === fileChankList.value.length) {
    mergeRequest()
  }
}

// 发请求通知服务器，合并切片
const mergeRequest = async () => {
  await bigUploadRequest({
    url: '/api/file/merge',
    headers: {
      'content-type': 'application/json'
    },
    data: JSON.stringify({
      size: chunkSize,
      fileHash: container.hash,
      filename: container.file.name
    })
  })

  ElMessage.success('上传成功')
  status.value = LargeUploadStatus.wait
}

// * 大文件上传的单独的request
const bigUploadRequest = ({
  url,
  method = 'post',
  data,
  headers = {},
  onProgress = (e: any) => e,
  requestList
}: {
  url: string
  method?: string
  data: any
  headers?: { [key: string]: string }
  onProgress?: (e: any) => any
  requestList?: XMLHttpRequest[]
}): Promise<ReqResult> => {
  return new Promise((resolve) => {
    const xhr = new XMLHttpRequest()
    // 一个无符号长整型（unsigned long）数字，表示该请求的最大请求时间（毫秒），若超出该时间，请求会自动终止。
    // xhr.timeout = 100000
    xhr.upload.onprogress = onProgress
    xhr.open(method, url)
    Object.keys(headers).forEach((key) => xhr.setRequestHeader(key, headers[key]))
    xhr.ontimeout = (e: ProgressEvent) => {
      console.log('请求超时', e.cancelable)
    }
    xhr.send(data)
    // XMLHttpRequest请求成功完成时触发；
    xhr.onload = (e: ProgressEvent) => {
      // 将请求成功的 xhr 从列表中删除
      if (requestList) {
        const xhrIndex = requestList.findIndex((item) => item === xhr)
        requestList.splice(xhrIndex, 1)
      }

      let target = e.target as XMLHttpRequest
      let result = JSON.parse(target.response) as ReqResult
      resolve(result)
    }

    // 当请求结束时触发, 无论请求成功(load)还是失败(abort 或 error)。也可以使用 onloadend 属性。
    xhr.onloadend = (e) => e
    // 暴露当前 xhr 给外部
    requestList?.push(xhr)
  })
}
</script>

<style scoped></style>
