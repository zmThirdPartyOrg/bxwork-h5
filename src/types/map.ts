export interface GetLocationNameByTmapPointResult {
  formatted_address: string
  location: {
    lon: number
    lat: number
  }
  addressComponent: AddressComponent
}

export interface AddressComponent {
  address: string
  town: string
  nation: string
  city: string
  county_code: string
  poi_position: string
  county: string
  city_code: string
  address_position: string
  poi: string
  province_code: string
  town_code: string
  province: string
  road: string
  road_distance: number
  address_distance: number
  poi_distance: number
}

export interface GetPoiByTmapPointResult {
  pois: Poi[]
  status: {
    infocode: number
    cndesc: string
  }
}

export interface Poi {
  address: string
  distance: string
  phone: string
  poiType: string
  name: string
  source: string
  hotPointID: string
  lonlat: string
}

export type TmapBaseResult<T> = {
  searchVersion?: string
  status: '0' | '101' | '404'
  msg?: string
} & T

export interface GetPointByTmapAddressResult {
  location: {
    score: number
    level: string
    lon: string
    lat: string
    keyWord: string
  }
}
