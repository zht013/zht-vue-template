import { appHttp } from '@/helpers'
import { authorize } from '@/helpers'
import type { HttpResult, User } from '@/types'

/**
 * 用户相关业务的封装
 */
class UserService {
  /** 获取用户数据 */
  async getUserInfo(): Promise<User> {
    const result = await appHttp.get<User>(`/user/info`)

    return result.data
  }

  /**
   * 用户登录, 获取用户token
   * @param username 用户名
   * @param password 密码
   * @param rememberMeDays 记住我多少天
   */
  async login(
    username: string,
    password: string,
    rememberMeDays?: number
  ): Promise<HttpResult<string>> {
    const result = await appHttp.post<HttpResult<string>>('/user/login', {
      username,
      password,
      rememberMeDays
    })

    const resultData = result.data
    if (resultData.success && resultData.data) {
      authorize.reset()

      authorize.token = resultData.data
    }

    return resultData
  }

  /** 注销登录 */
  async logout(): Promise<HttpResult<unknown>> {
    const result = await appHttp.get<HttpResult<unknown>>('/user/logout')

    return result.data
  }
}

const userService = new UserService()

export { userService }
