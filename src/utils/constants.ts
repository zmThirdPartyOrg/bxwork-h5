import jssdk from '@pkstar/horn-jssdk'
import { ato } from '@daysnap/utils'

// 是否是开发环境
export const __DEV__ = process.env.NODE_ENV === 'development'

export const NAME = 'BXKQ-APP'

// 是否是app
export const isApp = jssdk.canIUse()

// 是否安卓
export const isAndroid = /os-name\/android/.test(navigator.userAgent.toLowerCase())

// 是否ios
export const isIOS = navigator.userAgent.includes('HornIOSApp')

// app 下载页
export const DOWNLOAD_URL = `https://gyzj.gongyujjh.org.cn/app/#/download`

// 提醒方式
export const NOTICE_METHOD = [
  { label: 'app', value: 'app' },
  { label: '邮件', value: 'email' },
  { label: '短信', value: 'sms' },
]
export const noticeMethodValueMap = ato(NOTICE_METHOD, 'value')

// 消息类型
export const BIS_MSG_TYPE = [
  {
    label: '系统消息',
    title: '系统',
    value: 'system',
    icon: new URL('@/assets/img/icon/woke_announcement.png', import.meta.url).href,
  },
  {
    label: '审批',
    title: '审批',
    value: 'approve',
    icon: new URL('@/assets/img/icon/woke_approval.png', import.meta.url).href,
  },
]
export const bisTypeValueMap = ato(BIS_MSG_TYPE, 'value')

// 申请类型
export const APPLY_TYPE = [
  {
    label: '加班',
    value: 'overtime',
    icon: new URL('@/assets/img/icon/approval_overtime.png', import.meta.url).href,
  },
  {
    label: '请假',
    value: 'leave',
    icon: new URL('@/assets/img/icon/approval_leave.png', import.meta.url).href,
  },
]
export const applyTypeValueMap = ato(APPLY_TYPE, 'value')

// 审批状态
export const APPLY_STATUS = [
  {
    label: '未审批',
    value: 'init',
  },
  {
    label: '通过',
    value: 'pass',
  },
  {
    label: '拒绝',
    value: 'deny',
  },
  {
    label: '部分审批',
    value: 'part',
  },
]
export const applyStatusValueMap = ato(APPLY_STATUS, 'value')

// 审批提交状态
export const APPLY_SUBMIT_STATUS = [
  {
    label: '未提交',
    value: 'init',
  },
  {
    label: '已提交',
    value: 'submit',
  },
  {
    label: '已撤回',
    value: 'withdraw',
  },
]
export const applySubmitStatusValueMap = ato(APPLY_SUBMIT_STATUS, 'value')

export const applyStatusLabelMap = function (submitStatus: string, status: string) {
  if (submitStatus === 'submit') {
    return applyStatusValueMap[status]?.label
  } else {
    return applySubmitStatusValueMap[submitStatus]?.label
  }
}
