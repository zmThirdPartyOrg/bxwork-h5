import { sleep } from '@pkstar/utils'

import { isMiniProgram } from '@/utils'

export function useSuperRouter() {
  const router = useRouter()

  const back = async (ms?: number) => {
    if (isMiniProgram) {
      if (ms) {
        await sleep(ms)
      }
      wx.miniProgram.postMessage({ data: 'navigateBack' })
      wx.miniProgram.navigateBack()
    } else {
      router.back()
    }
  }

  return {
    back,
  }
}
