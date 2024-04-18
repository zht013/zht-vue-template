import { useEventListener } from '@vueuse/core'
import { isFunction } from 'lodash-es'
import type { Directive, DirectiveBinding } from 'vue'

export const vLongpress: Directive = {
  mounted: (element: HTMLElement, binding: DirectiveBinding) => {
    const callBack = binding.value
    if (callBack && isFunction(callBack)) {
      const pressTime = Number(binding.arg)
      let timer: NodeJS.Timeout | undefined

      const clear = () => {
        if (timer) {
          clearTimeout(timer)
          timer = undefined
        }
      }

      const onUp = () => {
        clear()
      }

      const onDown = (ev: MouseEvent) => {
        clear()
        ev.preventDefault()

        if (!timer) {
          timer = setTimeout(() => callBack(), pressTime | 500)
        }
      }

      // Register using addEventListener on mounted, and removeEventListener automatically on unmounted
      useEventListener(element, 'pointerdown', onDown)
      useEventListener(element, 'pointerup', onUp)
      useEventListener(element, 'pointerleave', clear)
    } else {
      throw new Error(
        '[Directive: longpress]: need callback and callback must be a function! Like v-longpress="callback"'
      )
    }
  }
}
