import { ThemeType } from '@/types'
import { appStorage } from './AppStorage'

/** app 的主题管理类 */
class AppTheme {
  private get rootElement(): HTMLElement {
    return document.documentElement
  }

  /** App 用户设置的 theme */
  get userTheme(): ThemeType {
    return (
      (appStorage.local.getItem(import.meta.env.VITE_USER_THEME_KEY) as ThemeType) ||
      ThemeType.light
    )
  }

  /**
   * 设置 App 主题， 不做存储操作
   * @param value 目标 theme 状态
   * @param prevValue 当前 theme 状态
   */
  setTheme(value: ThemeType, prevValue?: ThemeType) {
    this.rootElement.classList.add(value)

    if (prevValue && prevValue !== value) {
      this.rootElement.classList.remove(prevValue)
    }
  }

  /**
   * 设置 App 主题，并存储
   * @param value 目标 theme 状态
   * @param prevValue 当前 theme 状态
   */
  saveTheme(value: ThemeType, prevValue?: ThemeType) {
    this.setTheme(value, prevValue)

    appStorage.local.setItem(import.meta.env.VITE_USER_THEME_KEY, value)
  }
}

const appTheme = new AppTheme()

export { appTheme }
