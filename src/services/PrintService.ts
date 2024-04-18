import { appHttp } from '@/helpers'

class PrintService {
  /** 打印数据延迟测试 */
  async test(): Promise<unknown> {
    const result = await appHttp.get<unknown>('/print/test')

    return result.data
  }
}

const printService = new PrintService()

export { printService }
