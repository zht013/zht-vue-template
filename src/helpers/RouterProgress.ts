import nProgress from 'nprogress'
import 'nprogress/nprogress.css'

/**
 * 当前应用路由切换时的进度条封装
 */
class RouterProgress {
  constructor() {
    // 配置进度条信息
    nProgress.configure({
      showSpinner: false
    })
  }

  /**
   * 开始显示进度条
   */
  start() {
    nProgress.start()
  }

  /**
   * 关闭进度条显示
   */
  done() {
    nProgress.done()
  }
}

const routerProgress = new RouterProgress()

export { routerProgress }
