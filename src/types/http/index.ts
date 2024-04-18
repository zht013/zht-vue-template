export { HttpStatusCode as AppHttpStatusCode } from 'axios'

/** http请求返回结果 */
export interface HttpResult<T = any> {
  /** 状态码 */
  code: number
  /** 状态信息 */
  message?: string
  /** 返回的数据 */
  data?: T
  /** 是否成功 */
  success?: boolean
}
