import { insertScript, sleep } from '@pkstar/utils'
import { showLoadingToast } from 'vant'

import type { GeocoderResult, SurroundingPois } from '@/types'

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

// 根据地址查询经纬度
export const parseAddressLngLatByBMap = async (address: string): Promise<any> => {
  const loading = showLoadingToast({ duration: 0 })
  if (!address) {
    await sleep(200)
    loading.close()
    return Promise.reject('请完善地址信息')
  }
  await appendBmap()
  const map = new BMap.Map({
    zoom: 14, //比例
    point: { lat: 31.14, lng: 121.2 }, //默认显示区
    search: false, //支持查询
  })
  const geocoder = new BMap.LocalSearch(map)
  const getPoint = function () {
    return new Promise((resolve, reject) => {
      geocoder.setSearchCompleteCallback(function (data: any) {
        loading.close()
        const sda = []
        for (let i = 0; i < data.getCurrentNumPois(); i++) {
          sda.push(data.getPoi(i))
        }
        if (sda && sda[0] && sda[0].point) {
          resolve(sda[0].point)
        } else {
          resolve({})
        }
      })
      geocoder.search(address)
    })
  }

  return new Promise(async (resolve, reject) => {
    let point = await getPoint()
    for (let i = 0; i < 6; i++) {
      if (!point?.hasOwnProperty('lng')) {
        point = await getPoint()
      } else {
        break
      }
    }

    if (!point?.hasOwnProperty('lng')) {
      console.log('失败了')
    }
    resolve(point)
  })
}
