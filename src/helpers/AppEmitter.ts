import type { LayoutType } from '@/types'
import type { Emitter } from 'mitt'
import mitt from 'mitt'

export class AppEmitter {
  static readonly REFRESH_VIEW = Symbol()
  static readonly SAVE_APP_LAYOUT = Symbol()
}

type Events = {
  [AppEmitter.REFRESH_VIEW]: unknown
  [AppEmitter.SAVE_APP_LAYOUT]: LayoutType
}

const emitter: Emitter<Events> = mitt<Events>()

export { emitter as appEmitter }
