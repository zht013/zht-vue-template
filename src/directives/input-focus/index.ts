import type { ObjectDirective } from 'vue'

export const vInputFocus: ObjectDirective<HTMLInputElement | HTMLTextAreaElement> = {
  mounted: (el) => {
    const nodeName = el.nodeName.toLowerCase()
    if (nodeName === 'input' || nodeName === 'textarea') {
      el.focus()
    } else {
      const input = el.querySelector('input')
      input ? input.focus() : el.querySelector('textarea')?.focus()
    }
  }
}
