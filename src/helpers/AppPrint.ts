import { isVNode, render, type VNode, type Component, type VNodeProps } from 'vue'

/** 打印功能封装 */
class AppPrint {
  /**
   * 打印内容
   * @param content 打印内容，可以是 url，vnode，HtmlElement
   */
  print(content: string | VNode | Element): Promise<unknown> {
    return new Promise((resolve) => {
      const iframe = document.createElement('iframe') as HTMLIFrameElement
      iframe.setAttribute('style', 'position:absolute;width:0;height:0;top:-10px;left:-10px;')
      iframe.onload = async () => {
        const contentWindow = iframe.contentWindow!

        contentWindow.onafterprint = () => {
          this.closeIframe(iframe)
          resolve(undefined)
        }

        if (content instanceof HTMLElement) {
          contentWindow.document.body.appendChild(content)
          contentWindow.print()
        } else if (isVNode(content)) {
          render(content, contentWindow.document.body)
          contentWindow.print()
        }
      }

      if (typeof content === 'string') {
        iframe.src = content + '?t=' + Date.now()
      }

      document.body.appendChild(iframe)
    })
  }

  /**
   * 打印组件
   * @param component
   * @returns
   */
  printComponent(
    component: Component,
    options?: VNodeProps & {
      __v_isVNode?: never
      [Symbol.iterator]?: never
    } & Record<string, any>
  ): Promise<unknown> {
    return new Promise((resolve) => {
      const container = document.createElement('div') as HTMLDivElement
      render(
        h(component, {
          ...options,
          onInited: () => {
            this.print(container.firstElementChild!).then(() => {
              resolve(undefined)
            })
          }
        }),
        container
      )
    })
  }

  private closeIframe(iframe: HTMLIFrameElement) {
    document.body.removeChild(iframe)
  }
}

const appPrint = new AppPrint()

export { appPrint }
