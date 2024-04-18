import {
  ElMessageBox,
  type Action,
  type ElMessageBoxOptions,
  type MessageBoxData
} from 'element-plus'
import { breakpointsTailwind } from '@vueuse/core'

export enum AppDialogSize {
  small = '30%',
  middle = '40%',
  large = '60%',
  xLarge = '80%',
  xxLarge = '90%',
  fullScreen = '100%'
}

export type AppDialogOptions = Omit<ElMessageBoxOptions, 'customClass' | 'customStyle'> & {
  size?: AppDialogSize
  onVanish?: () => void
  onAction?: (action: Action) => void
  close?: (action: Action) => void
}

export type AppMessageBoxData = {
  messageBox: Promise<MessageBoxData>
  close: (action: Action) => void
}

class AppMessgeBox {
  private positionTop = {
    '30%': '15%',
    '40%': '15%',
    '60%': '10%',
    '80%': '8%',
    '90%': '8%',
    '100%': '0%'
  }

  /**
   * dialog 模式
   * 没有默认按钮
   * @param options dialog options
   * @returns
   */
  open(options: AppDialogOptions): AppMessageBoxData {
    const dialogOptions = this.getDialogOptions({ ...options, showConfirmButton: false })

    const messageBox = ElMessageBox(dialogOptions)
    const close = (action: Action) => {
      dialogOptions.onAction && dialogOptions.onAction(action)
      dialogOptions.onVanish && dialogOptions.onVanish()
    }

    return { messageBox, close }
  }

  /**
   * alert 模式
   * @param message alert message
   * @param options alert options
   */
  alert(
    message: ElMessageBoxOptions['message'],
    title?: ElMessageBoxOptions['title'] | AppDialogOptions,
    options?: AppDialogOptions
  ): Promise<MessageBoxData> {
    const dialogOptions = this.getDialogOptions(options)

    return ElMessageBox.alert(message, title, dialogOptions)
  }

  /**
   * confirm 模式
   * @param message confirm message
   * @param options
   */
  confirm(
    message: ElMessageBoxOptions['message'],
    title?: ElMessageBoxOptions['title'] | AppDialogOptions,
    options?: AppDialogOptions
  ): Promise<MessageBoxData> {
    const dialogOptions = this.getDialogOptions(options)

    return ElMessageBox.confirm(message, title, dialogOptions)
  }

  /** 关闭所有 messagebox */
  close() {
    ElMessageBox.close()
  }

  private getDialogOptions(options?: AppDialogOptions): AppDialogOptions {
    const dialogOptions = { ...options } as ElMessageBoxOptions
    let dialogWidth = options?.size || AppDialogSize.middle
    if (window.innerWidth < breakpointsTailwind.lg && dialogWidth !== AppDialogSize.fullScreen) {
      dialogWidth = AppDialogSize.xxLarge
    }

    dialogOptions.customClass = 'app-dialog'
    dialogOptions.customStyle = {
      '--el-messagebox-width': dialogWidth,
      '--app-dialog-top': this.positionTop[dialogWidth]
    }

    return dialogOptions
  }
}

const appMessageBox = new AppMessgeBox()

export { appMessageBox }
