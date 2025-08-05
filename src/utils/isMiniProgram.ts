import { isWeChatMiniProgram } from '@pkstar/utils'

export const isMiniProgram = (() => {
  const key = 'isMiniProgram'

  if (window.location.href.includes('isMiniProgram=1')) {
    window.sessionStorage.setItem(key, '1')
  }

  return isWeChatMiniProgram() || window.sessionStorage.getItem(key)
})()
