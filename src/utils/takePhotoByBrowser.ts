export interface TakePhotoByBrowserOptions {
  /** 是否优先调用摄像头，默认 true */
  camera?: boolean
  /** 摄像头方向，默认后置 */
  capture?: 'user' | 'environment'
  /** 是否允许多选，默认 false */
  multiple?: boolean
  /** 最大选择数量，multiple 为 true 时生效 */
  count?: number
  /** 接受的文件类型，默认 image/* */
  accept?: string
}

/**
 * H5 拍照/选图，通过隐藏 input 唤起系统相机或相册
 */
export function takePhotoByBrowser(options: TakePhotoByBrowserOptions = {}): Promise<File[]> {
  const {
    camera = true,
    capture = 'user',
    multiple = false,
    count = 1,
    accept = 'image/*',
  } = options

  return new Promise((resolve, reject) => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = accept
    input.multiple = multiple
    input.className = 'pro-uploader__input'

    if (camera) {
      input.setAttribute('capture', capture)
    }

    let settled = false

    const cleanup = () => {
      input.removeEventListener('change', onChange)
      input.removeEventListener('cancel', onCancel)
      window.removeEventListener('focus', onWindowFocus)
      if (input.parentNode) {
        document.body.removeChild(input)
      }
    }

    const settle = (handler: () => void) => {
      if (settled) {
        return
      }
      settled = true
      cleanup()
      handler()
    }

    const onChange = (e: Event) => {
      const target = e.target as HTMLInputElement
      const files = [...(target.files ?? [])].slice(0, count)
      if (!files.length) {
        settle(() => reject('未选择图片'))
        return
      }
      settle(() => resolve(files))
    }

    const onCancel = () => {
      settle(() => reject('取消选择'))
    }

    const onWindowFocus = () => {
      window.setTimeout(() => {
        if (!settled && !input.files?.length) {
          settle(() => reject('取消选择'))
        }
      }, 300)
    }

    input.addEventListener('change', onChange)
    input.addEventListener('cancel', onCancel)
    window.addEventListener('focus', onWindowFocus, { once: true })

    document.body.appendChild(input)
    input.click()
  })
}
