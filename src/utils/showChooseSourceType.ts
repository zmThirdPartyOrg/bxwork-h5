import { showActionSheet } from '@daysnap/horn-ui'

/**
 * 根据type选择图片来源，all-拍照或相册 camera-拍照 album-相册
 * @param type 选择图片来源
 * @returns
 */
export function showChooseSourceType(type?: 'camera' | 'album' | 'all') {
  let actions = []
  if (type && type !== 'all') {
    type === 'camera'
      ? (actions = [{ name: '拍照', value: 'camera' }])
      : (actions = [{ name: '相册选取', value: 'album' }])
    return showActionSheet({
      actions,
    })
  }
  return showActionSheet({
    actions: [
      { name: '拍照', value: 'camera' },
      { name: '相册选取', value: 'album' },
    ],
  })
}
