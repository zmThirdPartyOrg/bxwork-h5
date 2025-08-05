export interface GeocoderResult {
  point: Point
  address: string
  addressComponents: AddressComponents
  surroundingPois: SurroundingPois[]
  business: string
  content: Content
}

interface Content {
  address: string
  address_detail: Addressdetail
  business: string
  edz: Edz
  poi_desc: string
  poi_region: Poiregion[]
  point: Point2
  surround_poi: Surroundpoi[]
}

interface Surroundpoi {
  addr: string
  cp: string
  direction: string
  distance: string
  name: string
  poiType: string
  point: Point2
  popularity_level: string
  tag: string
  tel: string
  uid: string
  zip: string
}

interface Point2 {
  x: string
  y: string
}

interface Poiregion {
  direction_desc: string
  distance: string
  name: string
  region_area: number
  tag: string
  uid: string
}

interface Edz {
  name: string
}

interface Addressdetail {
  adcode: number
  city: string
  city_code: number
  country: string
  country_code: number
  direction: string
  distance: string
  district: string
  province: string
  street: string
  street_number: string
  town: string
  town_code: string
}

export interface SurroundingPois {
  title: string
  uid: string
  point: Point
  city: string
  fj: string
  type: number
  address: string
  postcode: null
  phoneNumber: null | string
  tags: string[]
}

interface AddressComponents {
  streetNumber: string
  street: string
  district: string
  city: string
  province: string
  town: string
}

interface Point {
  lng: number
  lat: number
  We: string
}
