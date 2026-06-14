// http://api.tianditu.gov.cn/geocoder?postStr={'lon':116.37304,'lat':39.92594,'ver':1}&type=geocode&tk=
import type { GetLocationNameByTmapPointResult, GetPoiByTmapPointResult } from '@/types'
import { TMAP_TK } from '@/utils'

import { curl } from './curl'

export const getLocationNameByTmapPoint = (lon: number, lat: number) => {
  return curl<GetLocationNameByTmapPointResult>(
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
  )
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
  )
}
