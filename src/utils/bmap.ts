import type { GeocoderResult, SurroundingPois } from '@/types'
import { insertScript } from '@pkstar/utils'

export const appendBmap = async () => {
  const bmpAk = 'CNX7X1fVOrSAODNDCAeMiWTkZjeruZK8'
  if (typeof (window as any).BMap !== 'undefined') {
    return Promise.resolve()
  }
  return new Promise((resolve, reject) => {
    ;(window as any).onBMapCallback = function () {
      console.log('bmap 成功')
      resolve((window as any).BMap)
    }
    insertScript(`https://api.map.baidu.com/api?v=3.0&ak=${bmpAk}&callback=onBMapCallback`).catch(
      () => {
        reject('百度地图引入失败')
      },
    )
  })
}

// 根据经纬度获取附近地点
export const getLocationNameByPoint = async (longitude: number, latitude: number) => {
  await appendBmap()
  const Geocoder = new BMap.Geocoder()
  const point = new BMap.Point(longitude, latitude)
  console.log('Geocoder', JSON.stringify(point))
  return new Promise<SurroundingPois[]>((resolve) => {
    Geocoder.getLocation(
      point,
      (res: GeocoderResult) => {
        resolve(res.surroundingPois)
      },
      { poiRadius: 500 },
    )
  })
}
