import { LayoutType } from '@/types'
import { appStorage } from './AppStorage'
// import type { RouteMeta } from 'vue-router'

/** app 用户自定义布局管理类 */
class AppLayout {
  /** 获取用户的 layout */
  get userLayout(): LayoutType {
    return appStorage.local.getItem(import.meta.env.VITE_USER_LAYOUT_KEY) as LayoutType
  }

  /** 设置用户的 layout */
  set userLayout(value: LayoutType) {
    appStorage.local.setItem(import.meta.env.VITE_USER_LAYOUT_KEY, value)
  }

  // /**
  //  * 获取当前路由使用的 layout
  //  * 路由是否指定了 layout，如果指定了就用指定的 layout
  //  * 如果没有指定，则查看路由是否使用动态模板设置，如果是，则从 localstorage 中查找数据
  //  * 如果什么都没设置，则不使用模板
  //  * @param meta 当前路由的 meta 信息
  //  * @returns
  //  */
  // getRouteLayout(meta: RouteMeta): LayoutType {
  //   return meta?.layout
  //     ? meta?.layout
  //     : meta?.dynamicLayout
  //       ? this.userLayout || LayoutType.default
  //       : LayoutType.empty
  // }
}

const appLayout = new AppLayout()

export { appLayout }
