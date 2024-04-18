import axios, { type AxiosResponse, type InternalAxiosRequestConfig } from 'axios'
import { appLoading } from './AppLoading'
import { authorize } from '@/helpers'
import { AppHttpStatusCode } from '@/types'
import { ElMessage } from 'element-plus'

/**
 * 创建axios实例
 */
const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_APP_BASE_API,
  timeout: 10000
  // headers: {
  //   post: {
  //     'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
  //   },
  //   // get: {
  //   //   'Content-Type': 'application/json;charset=utf-8'
  //   // }
  // }
})

/**
 * 请求拦截器
 */
axiosInstance.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  // config headers属性经常携带一些公共的信息，如 token
  // 从 storage 中提取 token，放入 header 发送到服务端
  if (config.url?.includes('github/')) {
    config.headers.Authorization = `Bearer ${authorize.githubApiToken}`
  } else if (authorize.token) {
    config.headers.Authorization = `Bearer ${authorize.token}`
  }

  // 返回配置对象
  return config
})

/**
 * 响应拦截器
 */
axiosInstance.interceptors.response.use(
  // 成功回调, 简化数据
  // post请求直接返回HttpResult
  // get请求返回对应的数据
  (response: AxiosResponse) => {
    // 移除loading状态
    appLoading.close()

    // 如果 header 中包含 refresh token，则替换现有 token
    const refreshToken = response.headers[import.meta.env.VITE_REFRESH_TOKEN_KEY]
    if (refreshToken) {
      authorize.token = refreshToken
    }

    if (
      response.config.method === 'get' &&
      response.headers['content-type']?.toString().indexOf('application/json') >= 0
    ) {
      return response.data
    } else {
      return response
    }
  },
  (error) => {
    // 移除loading状态
    appLoading.close()

    // 失败回调, 处理网络错误
    let errorMessage = ''
    const statusCode = error.response?.status
    switch (statusCode) {
      case AppHttpStatusCode.Unauthorized:
        errorMessage = 'token过期'
        break
      case AppHttpStatusCode.Forbidden:
        errorMessage = '无权访问'
        break
      case AppHttpStatusCode.NotFound:
        errorMessage = '请求地址错误'
        break
      case AppHttpStatusCode.InternalServerError:
        errorMessage = '服务器出现问题'
        break
      default:
        errorMessage = '无网络'
    }

    ElMessage.error({
      message: errorMessage
    })

    return Promise.reject(error)
  }
)

export { axiosInstance as appHttp }
