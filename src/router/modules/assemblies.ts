import { ROUTE_NAMES } from '@/constants'
import type { RouteRecordRaw } from 'vue-router'
import { RouteRank } from '../RouteRank'
import IconEpBox from '~icons/ep/box'

export default {
  path: '/assemblies',
  name: ROUTE_NAMES.assemblies,
  meta: {
    rank: RouteRank.assembilies,
    isMenu: true,
    title: '组件',
    icon: IconEpBox,
    requireAuth: true,
    dynamicLayout: true
  },
  children: [
    {
      path: 'app-dialog',
      alias: [''],
      name: ROUTE_NAMES.appMessagebox,
      component: () => import('@/views/assemblies/app-dialog/index.vue'),
      meta: {
        title: '消息框',
        isMenu: true
      }
    },
    {
      path: 'file-upload',
      name: ROUTE_NAMES.fileUpload,
      component: () => import('@/views/assemblies/file-upload/index.vue'),
      meta: {
        title: '文件上传',
        isMenu: true
      }
    },
    {
      path: 'text-llipsis',
      name: ROUTE_NAMES.textEllipsis,
      component: () => import('@/views/assemblies/TextEllipsisView.vue'),
      meta: {
        title: '文本省略',
        isMenu: true
      }
    },
    {
      path: 'image',
      alias: [''],
      name: ROUTE_NAMES.image,
      component: () => import('@/views/assemblies/ImageView.vue'),
      meta: {
        title: '图片',
        isMenu: true
      }
    },
    {
      path: 'reusable-template',
      name: ROUTE_NAMES.reusableTemplate,
      component: () => import('@/views/assemblies/ReusableTemplateView.vue'),
      meta: {
        title: '重用模板',
        isMenu: true
      }
    }
  ]
} as RouteRecordRaw
