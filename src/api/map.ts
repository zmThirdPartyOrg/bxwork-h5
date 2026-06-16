import type {
  GetLocationNameByTmapPointResult,
  GetPoiByTmapPointResult,
  GetPointByTmapAddressResult,
  TmapBaseResult,
} from '@/types'
import { TMAP_TK } from '@/utils'

import { curl } from './curl'

// http://api.tianditu.gov.cn/geocoder?postStr={'lon':116.37304,'lat':39.92594,'ver':1}&type=geocode&tk=
export const getLocationNameByTmapPoint = (lon: number, lat: number) => {
  return curl<TmapBaseResult<{ result: GetLocationNameByTmapPointResult }>>(
    `https://api.tianditu.gov.cn/geocoder`,
    {
      postStr: JSON.stringify({
        lon,
        lat,
        ver: 1,
      }),
      type: 'geocode',
      tk: TMAP_TK,
    },
    {
      method: 'GET',
    },
  ).then((res) => {
    if (res.status !== '0') {
      return Promise.reject(res.msg || `获取地址失败`)
    }
    return res.result || {}
  })
}

// http://api.tianditu.gov.cn/v2/search?postStr={"keyWord":"公园","level":12,"queryRadius":5000,"pointLonlat":"116.48016,39.93136","queryType":3,"start":0,"count":10}&type=query&tk=您的密钥
export const getPoiByTmapPoint = (lon: number, lat: number, keyWord: string) => {
  return curl<GetPoiByTmapPointResult>(
    `https://api.tianditu.gov.cn/v2/search`,
    {
      postStr: JSON.stringify({
        keyWord,
        level: 12,
        queryRadius: 5000,
        pointLonlat: `${lon},${lat}`,
        queryType: 3,
        start: 0,
        count: 20,
      }),
      type: 'query',
      tk: TMAP_TK,
    },
    {
      method: 'GET',
    },
  ).then((res) => {
    if (res.status.infocode !== 1000) {
      return Promise.reject(res.status.cndesc || `获取POI失败`)
    }
    return res.pois || []
  })
}

//  http://api.tianditu.gov.cn/geocoder?ds={"keyWord":"北京市海淀区莲花池西路28号"}&tk=您的密钥
export const getPointByTmapAddress = (address: string) => {
  return curl<TmapBaseResult<GetPointByTmapAddressResult>>(`https://api.tianditu.gov.cn/geocoder`, {
    ds: JSON.stringify({ keyWord: address }),
    tk: TMAP_TK,
  }).then((res) => {
    if (res.status !== '0') {
      return Promise.reject(res.msg || `地址解析失败`)
    }
    return res.location || {}
  })
}
