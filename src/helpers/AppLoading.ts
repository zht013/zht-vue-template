import { ElLoading, type LoadingOptionsResolved } from 'element-plus'
import 'element-plus/es/components/loading/style/css'

/**
 * loadingInstance类型声明
 */
type loadingInstanceType = ReturnType<typeof ElLoading.service>
/**
 * loadingOptions类型声明
 */
type loadingOptions = Partial<
  Omit<LoadingOptionsResolved, 'target' | 'parent'> & {
    target: string | HTMLElement
    body: boolean
  }
>

/**
 * 当前应用loading状态的封装
 */
class AppLoading {
  /**
   * 全局ElLoading实例
   */
  private loadingInstance!: loadingInstanceType

  get isLoading(): boolean {
    return this.loadingInstance?.visible.value
  }

  /**
   * 开启 Loading
   */
  start(options?: loadingOptions): loadingInstanceType {
    // 如果已经有loading实例, 先关闭再开启新的实例
    this.close()

    // 以服务的方式调用的全屏 Loading 是单例的。
    // 若在前一个全屏 Loading 关闭前再次调用全屏 Loading，
    // 并不会创建一个新的 Loading 实例，而是返回现有全屏 Loading 的实例
    this.loadingInstance = ElLoading.service(options)

    return this.loadingInstance
  }

  /**
   * 结束 Loading
   */
  close() {
    this.loadingInstance && this.loadingInstance.close()
  }
}

const appLoading = new AppLoading()

export { appLoading }
