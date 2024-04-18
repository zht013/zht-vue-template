import { appStorage } from './AppStorage'
import { jwtDecode, type JwtPayload } from 'jwt-decode'

/**
 * 当前应用鉴权信息和操作的封装
 */
class Authorize {
  /** token 是否过期 */
  get tokenExpired(): boolean {
    const token = this.token
    if (token) {
      try {
        /** 解码 token 内容 */
        const payload = jwtDecode<JwtPayload>(token)

        return payload.exp && payload.exp > Date.now() / 1000 ? false : true
      } catch (error: any) {
        console.log(error.message)

        return true
      }
    }

    return true
  }

  /** 获取用户 token */
  get token(): string | null {
    let token = appStorage.local.getItem(import.meta.env.VITE_USER_TOKEN_KEY)
    if (token) {
      try {
        /** 解码 token 内容 */
        const payload = jwtDecode<JwtPayload>(token)
        if (!payload.exp || payload.exp <= Date.now() / 1000) {
          // 如果 token 过期，则直接删除
          appStorage.local.removeItem(import.meta.env.VITE_USER_TOKEN_KEY)
          token = null
        }
      } catch (error: any) {
        console.log(error.message)
        token = null
      }
    }

    return token
    // // 先从 sessionStorage 中获取token
    // let token = appStorage.session.getItem(AppKeys.token)
    // // 如果 sessionStorage 中没有 token
    // // 则从 localstorage 中获取 token, 并校验 token 的有效性
    // if (!token) {
    //   const tempToken = this.localToken
    //   if (tempToken) {
    //     try {
    //       /** 解码 token 内容 */
    //       const payload = jwtDecode<JwtPayload>(tempToken)
    //       if (payload.exp && payload.exp > Date.now() / 1000) {
    //         token = tempToken
    //       } else {
    //         // 如果 local token 过期，则直接删除
    //         appStorage.local.removeItem(AppKeys.token)
    //       }
    //     } catch (error: any) {
    //       console.log(error.message)
    //     }
    //   }
    // }

    // return token
  }

  /** 存储用户 token 到 sessionStorage */
  set token(value: string) {
    appStorage.local.setItem(import.meta.env.VITE_USER_TOKEN_KEY, value)
  }

  // /** 存储用户 token 到 localStorage */
  // set localToken(value: string) {
  //   appStorage.local.setItem(AppKeys.token, value)
  // }

  // /** 从 localstorage 中获取用户 token */
  // get localToken(): string | null {
  //   return appStorage.local.getItem(AppKeys.token)
  // }

  /**
   * 检查用户是否已经登录
   */
  get isLoggedIn(): boolean {
    return this.token ? true : false
  }

  /** github api token */
  get githubApiToken(): string {
    return appStorage.local.getItem(import.meta.env.VITE_GITHUB_API_TOKEN_KEY) || ''
  }

  /**
   * 重置用户信息和授权信息
   */
  reset(): void {
    // 从localstorage中删除用户token
    // appStorage.session.removeItem(import.meta.env.VITE_USER_TOKEN_KEY)
    appStorage.local.removeItem(import.meta.env.VITE_USER_THEME_KEY)
  }
}

const authorize = new Authorize()

export { authorize }
