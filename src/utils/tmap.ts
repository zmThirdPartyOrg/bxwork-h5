import { insertScript } from '@pkstar/utils'

const TMAP_API_URL = 'http://api.tianditu.gov.cn/api?v=4.0&tk=01c366bb1c2ebeec27d040e6c5131e90'

export const appendTmap = async () => {
  if (typeof (window as any).BMap !== 'undefined') {
    return Promise.resolve()
  }
  return new Promise((resolve, reject) => {
    ;(window as any).onBMapCallback = function () {
      console.log('tmap 成功')
      resolve((window as any).BMap)
    }
    insertScript(TMAP_API_URL)
      .then((e) => {
        console.log('tmap script loaded', e)
      })
      .catch(() => {
        reject('地图引入失败')
      })
  })
}
