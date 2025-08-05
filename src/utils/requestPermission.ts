import { getAppAuthorizeSetting, openAppAuthorizeSetting } from '@pkstar/horn-jssdk'
import { showConfirmDialog } from 'vant'

export enum PermissionScope {
  album = 'albumAuthorized',
  camera = 'cameraAuthorized',
  location = 'locationAuthorized',
  microphone = 'microphoneAuthorized',
  notification = 'notificationAuthorized',
}

export interface RequestPermissionOptions {
  scope: PermissionScope
  message?: string
}

export async function requestPermission(options: RequestPermissionOptions) {
  const defaultMessages = {
    albumAuthorized: '需要开启使用相册的权限',
    cameraAuthorized: '需要开启使用摄像头的权限',
    locationAuthorized: '需要开启使用定位的权限',
    microphoneAuthorized: '需要开启使用麦克风的权限',
    notificationAuthorized: '需要开启使用通知的权限',
    phoneCalendarAuthorized: '需要开启使用读写日历的权限',
  }
  const { scope, message = defaultMessages[scope] } = options
  const authorizes: any = await getAppAuthorizeSetting()
  if (authorizes[scope] === 'denied') {
    await showConfirmDialog({
      title: '温馨提示',
      message,
      confirmButtonText: '去开启',
    })
    openAppAuthorizeSetting()
  }
}
