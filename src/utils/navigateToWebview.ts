import { navigateToWebview as navigateToWebviewNative } from '@pkstar/horn-jssdk'

import { isApp, isMiniProgram } from '.'

export function navigateToWebview(options: { url: string; title?: string }) {
  if (isMiniProgram) {
    const { url: link, title = '' } = options
    const query = encodeURIComponent(JSON.stringify({ link, title }))
    wx.miniProgram.navigateTo({
      url: `/pages/webview/index?query=${query}`,
    })
  } else if (isApp) {
    navigateToWebviewNative(options)
  } else {
    window.open(options.url, '_blank')
  }
}
