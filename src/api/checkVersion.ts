import { showConfirmDialog } from 'vant'

import { reqH5Version } from '@/api'

export const checkVersion = (function () {
  let preVersion = 0,
    flag = true
  return async () => {
    const { version } = await reqH5Version()
    if (!preVersion) {
      preVersion = version
    }
    // 判断版本号
    if (flag && version > preVersion) {
      flag = false
      try {
        await showConfirmDialog({
          title: '更新提示',
          message: '检测到新版本，请更新',
          confirmButtonText: '更新',
          showCancelButton: false,
        })
        window.location.reload()
      } catch {
        /* empty */
      } finally {
        flag = true
      }
    }
  }
})()
