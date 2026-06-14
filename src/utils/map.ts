import { insertScript } from '@pkstar/utils'

export const TMAP_TK = '01c366bb1c2ebeec27d040e6c5131e90'
const TMAP_API_URL = `https://api.tianditu.gov.cn/api?v=4.0&tk=${TMAP_TK}`

export type TmapLocationResult = {
  longitude: number
  latitude: number
  address: string
  poi: string
}

export const appendTmap = async () => {
  if (typeof T !== 'undefined') {
    return Promise.resolve()
  }
  return new Promise((resolve, reject) => {
    insertScript(TMAP_API_URL)
      .then(() => {
        console.log('tmap 成功')
        resolve(T)
      })
      .catch(() => {
        reject('地图引入失败')
      })
  })
}

/** 天地图 H5 定位获取当前经纬度 */
export const getCurrentPositionByTmap = async () => {
  await appendTmap()
  return new Promise<{ longitude: number; latitude: number }>((resolve, reject) => {
    const geolocation = new T.Geolocation()
    geolocation.getCurrentPosition((result: { lnglat?: { lng: number; lat: number } }) => {
      if (geolocation.getStatus() === 0 && result.lnglat) {
        resolve({
          longitude: result.lnglat.lng,
          latitude: result.lnglat.lat,
        })
        return
      }
      reject('获取定位失败')
    })
  })
}

/** 天地图逆地理编码：经纬度转地址 */
export const getAddressByTmapPoint = async (longitude: number, latitude: number) => {
  await appendTmap()
  return new Promise<string>((resolve, reject) => {
    const geocoder = new T.Geocoder()
    geocoder.getLocation(new T.LngLat(longitude, latitude), (result: any) => {
      if (result.getStatus() === 0) {
        resolve(result.getAddress())
        return
      }
      reject('获取地址失败')
    })
  })
}

/** 获取当前定位及地址信息 */
export const getLocationByTmap = async (): Promise<TmapLocationResult> => {
  const { longitude, latitude } = await getCurrentPositionByTmap()
  let address = ''
  try {
    address = await getAddressByTmapPoint(longitude, latitude)
  } catch {
    address = `${longitude},${latitude}`
  }
  return { longitude, latitude, address, poi: address }
}

/** 浏览器定位获取当前经纬度 */
export const getLocationByNavigator = () => {
  return new Promise<{ latitude: number; longitude: number }>((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(
      (position: GeolocationPosition) => {
        console.log('position', position)
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          ...position,
        })
      },
      (err) => {
        reject(err)
      },
    )
  })
}
