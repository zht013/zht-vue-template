import { appHttp } from '@/helpers'
import { type HttpResult } from '@/types'
import type { AxiosRequestConfig } from 'axios'

class FileService {
  // /**大于 100MB 的文件进行切片处理 */
  // private minChunkFileSize = 1024 * 1024 * 100
  // /** 切片大小 10MB */
  // private chunkSize = 1024 * 1024 * 10

  /**
   * 上传文件携带额外的字段
   * @param data form 数据
   * @returns
   */
  async uploadForm(data: { date: string; files: File[] }): Promise<HttpResult> {
    const result = await appHttp.postForm<HttpResult>('/file/form', data)

    return result.data
  }

  /**
   * 上传文件内容
   * @param file 要上传的文件
   * @returns
   */
  async uploadFile(file: File, config?: AxiosRequestConfig<any>): Promise<HttpResult> {
    const result = await appHttp.postForm<HttpResult>('/file/upload', file, config)

    return result.data
  }

  /**
   * merge 已上传的文件切片
   * @param fileHashCode 文件 Hash 值
   * @returns
   */
  async mergeFile(fileHashCode: string): Promise<HttpResult> {
    const result = await appHttp.post<HttpResult>('/file/merge', {
      folder: fileHashCode
    })

    return result.data
  }

  async cancelUpload(fileHashCode: string): Promise<HttpResult> {
    const result = await appHttp.post<HttpResult>('/file/cancel-upload', {
      folder: fileHashCode
    })

    return result.data
  }

  // async uploadFiles(files: File[]): Promise<HttpResult> {
  //   files.forEach((file) => {
  //     if (file.size < this.minChunkFileSize) {

  //     }
  //   })

  //   return {} as HttpResult
  // }
}

const fileService = new FileService()

export { fileService }
