import type { RouteRecordRaw } from 'vue-router'
import { RouteRank } from '../RouteRank'
import { ROUTE_NAMES } from '@/constants'
import IconEpHandbag from '~icons/ep/handbag'

export default {
  path: '/features',
  name: ROUTE_NAMES.features,
  meta: {
    rank: RouteRank.features,
    isMenu: true,
    title: '功能',
    icon: IconEpHandbag,
    requireAuth: true,
    dynamicLayout: true
  },
  children: [
    {
      path: 'water-mark',
      name: ROUTE_NAMES.waterMark,
      component: () => import('@/views/features/WaterMarkView.vue'),
      meta: {
        title: '水印',
        isMenu: true
      }
    },
    {
      path: 'print',
      name: ROUTE_NAMES.featuresPrint,
      component: () => import('@/views/features/print/index.vue'),
      meta: {
        title: '打印',
        isMenu: true
      }
    },
    {
      path: 'download',
      name: ROUTE_NAMES.download,
      component: () => import('@/views/features/DownloadView.vue'),
      meta: {
        title: '下载',
        isMenu: true
      }
    },
    {
      path: 'export-excel',
      name: ROUTE_NAMES.exportExcel,
      component: () => import('@/views/features/ExcelExportView.vue'),
      meta: {
        title: '导出Excel',
        isMenu: true
      }
    },
    {
      path: 'debounce-throttle',
      name: ROUTE_NAMES.debounceThrottle,
      component: () => import('@/views/features/DebounceThrottleView.vue'),
      meta: {
        title: '防抖，节流防抖',
        isMenu: true
      }
    },
    {
      path: 'copy-longpress',
      name: ROUTE_NAMES.copyLongPress,
      component: () => import('@/views/features/CopyLongpressView.vue'),
      meta: {
        title: '复制，长按指令',
        isMenu: true
      }
    },
    {
      path: 'draggable',
      name: ROUTE_NAMES.dragDrop,
      component: () => import('@/views/features/DraggableView.vue'),
      meta: {
        title: '拖拽',
        isMenu: true
      }
    },
    {
      path: 'pdf-preview',
      name: ROUTE_NAMES.pdfPreview,
      component: () => import('@/views/features/PDFPreviewView.vue'),
      meta: {
        title: 'PDF预览',
        isMenu: true
      }
    },
    {
      path: 'swipe',
      name: ROUTE_NAMES.swipe,
      component: () => import('@/views/features/PointerSwipeView.vue'),
      meta: {
        title: '滑动',
        isMenu: true
      }
    }
  ]
} as RouteRecordRaw
