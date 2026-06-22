import { defineRoutes } from '@/router/defineRoutes'

export default defineRoutes([
  {
    path: '/signin',
    name: 'SigninView',
    component: () => import('@/views/auth/SigninView.vue'),
    meta: {
      title: '登录',
      requiresAuth: -1,
      enterClass: 'popup-up',
      leaveClass: 'popup-down',
    },
  },
  {
    path: '/password-reset',
    name: 'PasswordResetView',
    component: () => import('@/views/auth/PasswordResetView.vue'),
    meta: {
      title: '修改密码',
      requiresAuth: 0,
    },
  },
])
