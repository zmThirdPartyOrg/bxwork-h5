import { defineRoutes } from '@/router/defineRoutes'

export default defineRoutes([
  {
    path: '/oa/notice',
    name: 'NoticeView',
    component: () => import('@/views/oa/NoticeView.vue'),
    meta: { title: '公告', requiresAuth: 1 },
  },
  {
    path: '/oa/notice-deatil',
    name: 'NoticeDetailView',
    component: () => import('@/views/oa/NoticeDetailView.vue'),
    meta: { title: '公告', requiresAuth: 1 },
  },
  {
    path: '/attend',
    name: 'AttendView',
    component: () => import('@/views/attend/AttendView.vue'),
    meta: { title: '打卡', requiresAuth: 1 },
  },
  {
    path: '/attend/attend-list',
    name: 'AttendListView',
    component: () => import('@/views/attend/AttendListView.vue'),
    meta: { title: '考勤统计', requiresAuth: 1 },
  },
  {
    path: '/sign',
    name: 'SignView',
    component: () => import('@/views/sign/SignView.vue'),
    meta: { title: '签到', requiresAuth: 1 },
  },
  {
    path: '/sign-list',
    name: 'SignListView',
    component: () => import('@/views/sign/SignListView.vue'),
    meta: { title: '足迹', requiresAuth: 1 },
  },
  {
    path: '/apply',
    name: 'ApplyHomeView',
    component: () => import('@/views/apply/ApplyHomeView.vue'),
    meta: { title: '审批', requiresAuth: 1 },
  },
  {
    path: '/apply/:id',
    name: 'ApplyDetailView',
    component: () => import('@/views/apply/ApplyDetailView.vue'),
    meta: { title: '审批详情', requiresAuth: 1 },
  },
  {
    path: '/apply/wait',
    name: 'ApplyWaitView',
    component: () => import('@/views/apply/wait/ApplyWaitView.vue'),
    meta: { title: '待我审批', requiresAuth: 1 },
  },
  {
    path: '/apply/my',
    name: 'ApplyMyView',
    component: () => import('@/views/apply/my/ApplyMyView.vue'),
    meta: { title: '我发起的', requiresAuth: 1 },
  },
  {
    path: '/apply/done',
    name: 'ApplyDoneView',
    component: () => import('@/views/apply/done/ApplyDoneView.vue'),
    meta: { title: '已审批', requiresAuth: 1 },
  },
  {
    path: '/apply/notice',
    name: 'ApplyNoticeView',
    component: () => import('@/views/apply/notice/ApplyNoticeView.vue'),
    meta: { title: '抄送我的', requiresAuth: 1 },
  },
  {
    path: '/apply/leave',
    name: 'ApplyLeaveFormView',
    component: () => import('@/views/apply/ApplyLeaveFormView.vue'),
    meta: { title: '请假申请', requiresAuth: 1 },
  },
  {
    path: '/apply/overtime',
    name: 'ApplyOvertimeFormView',
    component: () => import('@/views/apply/ApplyOvertimeFormView.vue'),
    meta: { title: '加班申请', requiresAuth: 1 },
  },
])
