export interface GetLocationNameByTmapPointResult {
  formatted_address: string
  location: Location
  addressComponent: AddressComponent
}

interface AddressComponent {
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

interface Location {
  lon: number
  lat: number
}

export interface GetPoiByTmapPointResult {
  pois: Poi[]
}

interface Poi {
  address: string
  distance: string
  phone: string
  poiType: string
  name: string
  source: string
  hotPointID: string
  lonlat: string
}
