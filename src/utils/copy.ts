import { setClipboardData } from '@pkstar/horn-jssdk'
import ctc from 'copy-to-clipboard'

import { isApp } from '.'

export function copy(data: string) {
  if (isApp) {
    setClipboardData({ data })
    return true
  }
  return ctc(data)
}
