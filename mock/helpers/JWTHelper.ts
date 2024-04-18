import type { ServerResponse } from 'http'
import jwt from 'jsonwebtoken'

class JWTHelper {
  /** 加密密钥 */
  private _secret = 'zht-jwt'
  /** 默认过期时间30分钟 */
  private _defaultExpiresIn = 30 * 60

  /** 生成 token */
  sign(content: any, expiresIn?: string | number): string {
    return jwt.sign(content, this._secret, {
      expiresIn: expiresIn ?? this._defaultExpiresIn
    })
  }

  /** 验证并返回解密后的 token */
  verifyToken(token: string, res: ServerResponse): jwt.JwtPayload | undefined {
    if (!token) {
      res.statusCode = 403

      return undefined
    }

    const tokenArray = token.split(' ')
    if (tokenArray.length !== 2) {
      res.statusCode = 401

      return undefined
    }

    let payload: jwt.JwtPayload
    try {
      payload = jwt.verify(tokenArray[1], this._secret) as jwt.JwtPayload

      /** 如果 token 即将过期，则重新生成一个新的 token */
      if (payload.exp && payload.exp - Date.now() / 1000 < 10 * 60) {
        console.log('token 过期时间:', payload.exp - Date.now() / 1000, '秒')
        console.log('token 即将过期，自动刷新 token......')
        console.log(JSON.stringify(payload))
        Reflect.deleteProperty(payload, 'iat')
        Reflect.deleteProperty(payload, 'exp')

        res.setHeader('refresh-token', this.sign(payload, this._defaultExpiresIn))
      }
    } catch (err) {
      res.statusCode = 401

      return undefined
    }

    return payload
  }
}

const jwtHelper = new JWTHelper()

export { jwtHelper }
