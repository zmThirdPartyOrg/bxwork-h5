import { makePhoneCall as call } from '@pkstar/horn-jssdk'
import { isApp } from './constants'

export function makePhoneCall(options: { phoneNumber: string }) {
  if (isApp) {
    call(options)
    return
  }
  const a = document.createElement('a')
  a.setAttribute('href', `tel:${options.phoneNumber}`)
  a.click()
}
