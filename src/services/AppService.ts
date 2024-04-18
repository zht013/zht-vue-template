import { appHttp } from '@/helpers'
import type { AppConfig } from '@/types'

class AppService {
  /** 获取系统配置信息 */
  async getConfig(): Promise<AppConfig> {
    const result = await appHttp.get<AppConfig>('/app/config')

    return result.data
  }
}

const appService = new AppService()

export { appService }
