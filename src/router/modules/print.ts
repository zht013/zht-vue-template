import { ROUTE_NAMES } from '@/constants'
import { LayoutType } from '@/types'
import type { RouteRecordRaw } from 'vue-router'

export default {
  path: '/print',
  name: ROUTE_NAMES.print,
  meta: {
    title: '打印',
    requireAuth: true,
    layout: LayoutType.print
  },
  children: [
    {
      path: 'bill',
      name: ROUTE_NAMES.printBill,
      component: () => import('@/views/print/Bill.vue'),
      meta: {
        title: '打印票据'
      }
    }
  ]
} as RouteRecordRaw
