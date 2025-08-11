import { formatMessage } from '@pkstar/utils'
import { closeToast, showToast } from 'vant'

import { __DEV__ } from './constants'
import { excludeMessage } from './excludeMessage'

// 资源加载失败
export const isChunkLoadError = (errMsg: string) => {
  const chunkLoadError = [
    'Unable to preload CSS',
    'Failed to fetch dynamically imported module',
    'Importing a module script failed',
  ]

  return chunkLoadError.some((error) => {
    return errMsg.includes(error)
  })
}

// global error handler
export const errorHandler = (err: any) => {
  // close vant toast
  closeToast()

  const message = formatMessage(err)

  // 资源加载失败
  if (isChunkLoadError(message)) {
    showToast('新版发布，页面即将刷新！')
    setTimeout(() => {
      window.location.reload()
    }, 1500)
    return
  }

  if (message && !excludeMessage(message)) {
    showToast(message)
  }

  // development env 需要抛出异常 方便查看问题
  if (__DEV__) {
    throw err
  }
}
