import ctc from 'copy-to-clipboard'
import { setClipboardData } from '@pkstar/horn-jssdk'
import { isApp } from '.'

export function copy(data: string) {
  if (isApp) {
    setClipboardData({ data })
    return true
  }
  return ctc(data)
}
