import { defineRoutes } from '@/router/defineRoutes'

export default defineRoutes([
  {
    path: '/message/detail',
    name: 'MessageDetailView',
    component: () => import('@/views/message/MessageDetailView.vue'),
    meta: { title: '', requiresAuth: 1 },
  },
])
